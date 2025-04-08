import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  return null
}

// Function to calculate fuzzy grade based on percentage
const calculateFuzzyGrade = (percentage: number): string => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Above Average";
  if (percentage >= 70) return "Average";
  if (percentage >= 60) return "Passed";
  return "Failed";
}

// Function to generate remarks based on score and rubric
const generateRemarks = (score: number, maxScore: number, rubricFailures: string[] = []): string => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) {
    return "Outstanding work! Code demonstrates exceptional quality and understanding.";
  } else if (percentage >= 80) {
    return rubricFailures.length > 0 
      ? `Very good work with minor issues: ${rubricFailures.join(", ")}.` 
      : "Very good work! Solution meets all requirements effectively.";
  } else if (percentage >= 70) {
    return rubricFailures.length > 0 
      ? `Good work with some issues to address: ${rubricFailures.join(", ")}.` 
      : "Good work. Solution demonstrates solid understanding.";
  } else if (percentage >= 60) {
    return `Satisfactory work with several issues: ${rubricFailures.join(", ")}.`;
  } else if (percentage >= 50) {
    return `Work needs improvement. Major issues: ${rubricFailures.join(", ")}.`;
  }
  
  return `Submission does not meet requirements. Major issues: ${rubricFailures.join(", ")}.`;
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Check for user role
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Only allow teachers to export data
    if (profile.role !== 'teacher') {
      return new Response(
        JSON.stringify({ error: 'Only teachers can export data' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request data
    const { exportType, courseId, options } = await req.json()
    
    // Default options if not provided
    const exportOptions = options || {
      includeRubric: true,
      includeSubmissionTime: true,
      includeFuzzyGrade: true,
      includePercentage: true,
      includeRemarks: true
    };
    
    // Fetch the relevant data based on export type
    let data;
    let error;
    
    switch(exportType) {
      case 'student-profiles':
        ({ data, error } = await supabaseClient
          .from('profiles')
          .select('id, first_name, last_name, email, role, tup_id, created_at')
          .eq('role', 'student'));
        break;
      case 'class-rosters':
        ({ data, error } = await supabaseClient
          .from('enrollments')
          .select(`
            id,
            course:courses(id, name, code),
            student:profiles(id, first_name, last_name, email, tup_id),
            created_at
          `));
        break;
      case 'assessment-results':
        // Build the query for assessment results
        let query = supabaseClient
          .from('submissions')
          .select(`
            id,
            assessment:assessments(id, title, type, points_possible, rubric, course_id, content),
            student:profiles(id, first_name, last_name, email, tup_id),
            status,
            submitted_at,
            graded_at,
            score,
            content,
            feedback
          `);
        
        // If a specific course is selected, filter by that course
        if (courseId) {
          query = query.eq('assessment.course_id', courseId);
        }
        
        ({ data, error } = await query);
        
        // Process assessment data to include fuzzy grades and other calculations
        if (data && !error) {
          data = data.map(submission => {
            const maxPoints = submission.assessment?.points_possible || 100;
            const score = submission.score || 0;
            const percentage = (score / maxPoints) * 100;
            const fuzzyGrade = calculateFuzzyGrade(percentage);
            
            // Extract failed rubric items if available
            let rubricFailures: string[] = [];
            if (submission.feedback && submission.feedback.rubric_feedback) {
              rubricFailures = Object.entries(submission.feedback.rubric_feedback)
                .filter(([_, passed]) => !passed)
                .map(([item, _]) => item);
            }
            
            // Generate remarks based on performance
            const remarks = generateRemarks(score, maxPoints, rubricFailures);
            
            return {
              ...submission,
              percentage: percentage.toFixed(2) + '%',
              fuzzy_grade: fuzzyGrade,
              remarks: remarks
            };
          });
        }
        break;
      default:
        data = [];
        error = null;
    }

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate Excel-compatible CSV content
    const generateCsv = (data: any[]) => {
      if (data.length === 0) return '';
      
      // Flatten nested objects and apply export options for filtering fields
      const flattenedData = data.map(item => {
        const flattened: Record<string, any> = {};
        
        Object.entries(item).forEach(([key, value]) => {
          // Skip fields that should be excluded based on options
          if (key === 'submitted_at' && !exportOptions.includeSubmissionTime) {
            return;
          }
          if (key === 'fuzzy_grade' && !exportOptions.includeFuzzyGrade) {
            return;
          }
          if (key === 'percentage' && !exportOptions.includePercentage) {
            return;
          }
          if (key === 'remarks' && !exportOptions.includeRemarks) {
            return;
          }
          if (key === 'rubric' && !exportOptions.includeRubric) {
            return;
          }
          
          if (value !== null && typeof value === 'object') {
            Object.entries(value as Record<string, any>).forEach(([nestedKey, nestedValue]) => {
              // Skip rubric details if not included
              if (nestedKey === 'rubric' && !exportOptions.includeRubric) {
                return;
              }
              
              flattened[`${key}_${nestedKey}`] = nestedValue;
            });
          } else {
            flattened[key] = value;
          }
        });
        
        return flattened;
      });
      
      // Get all unique headers
      const headers = Array.from(
        new Set(
          flattenedData.flatMap(item => Object.keys(item))
        )
      );
      
      // Create CSV header row
      const csvHeader = headers.join(',');
      
      // Create CSV data rows
      const csvRows = flattenedData.map(item => {
        return headers.map(header => {
          const value = item[header];
          // Handle values that need escaping
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        }).join(',');
      });
      
      // Combine header and rows
      return [csvHeader, ...csvRows].join('\n');
    };

    const csvContent = generateCsv(data);
    
    return new Response(
      csvContent,
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${exportType}-${new Date().toISOString().split('T')[0]}.csv"`
        } 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
