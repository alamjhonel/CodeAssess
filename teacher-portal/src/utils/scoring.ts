/**
 * Advanced Scoring Engine for CodeGrade
 * Provides comprehensive, robust, and accurate assessment of code submissions
 * with features similar to industry-leading platforms like CodeChum
 */

type ScoreMetric = {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  details?: string;
};

// Enhanced CodeAssessment with more detailed metrics
type CodeAssessment = {
  // Core assessment metrics
  correctness: number; // 0-100
  efficiency: number; // 0-100
  readability: number; // 0-100
  testCasesPassed: number;
  totalTestCases: number;
  
  // Advanced metrics
  timeComplexity: string; // e.g., "O(n)", "O(n²)"
  spaceComplexity: string; // e.g., "O(1)", "O(n)"
  codeStyle: number; // 0-100, adherence to style guides
  errorHandling: number; // 0-100, quality of error handling
  
  // Code matching metrics
  fuzzyMatchScore?: number; // 0-100, how close to expected solution
  patternMatchScore?: number; // 0-100, pattern recognition score
  keywordCoverage?: number; // 0-100, essential keywords used
  
  // Performance metrics
  executionTime?: number; // in milliseconds
  memoryUsage?: number; // in KB/MB
  
  // Code quality checks
  codeQuality?: {
    isDumpCode: boolean;
    hasLoops: boolean;
    hasVariables: boolean;
    hasInputHandling: boolean;
    hasHardcodedOutput: boolean;
    structureScore: number; // 0-100
  };
  
  // Raw code for analysis
  rawCode?: string;
  
  // Detailed test results for granular feedback
  testCaseDetails?: Array<{
    id: string;
    name: string;
    passed: boolean;
    expectedOutput: string;
    actualOutput: string;
    executionTime?: number;
  }>;
};

export interface ScoringRubric {
  metrics: ScoreMetric[];
  totalWeight: number;
  totalScore: number;
  maxPossibleScore: number;
  categorizedMetrics?: {
    correctness: ScoreMetric[];
    efficiency: ScoreMetric[];
    style: ScoreMetric[];
    advanced: ScoreMetric[];
  };
  rejectionReason?: string; // Added for dump code rejection
}

/**
 * Calculate a comprehensive weighted score based on multiple assessment metrics
 * Uses a sophisticated algorithm similar to industry-leading platforms
 */
export const calculateWeightedScore = (assessment: CodeAssessment): ScoringRubric => {
  // Check for dump code patterns first
  const isDumpCode = checkForDumpCode(assessment);
  
  // If dump code is detected, return early with rejection
  if (isDumpCode.isDumpCode) {
    return {
      metrics: [],
      totalWeight: 0,
      totalScore: 0,
      maxPossibleScore: 100,
      rejectionReason: isDumpCode.reason
    };
  }

  // Initialize metrics array with core metrics
  const metrics: ScoreMetric[] = [
    {
      name: "Correctness",
      weight: 0.25,
      score: assessment.correctness,
      maxScore: 100,
      details: "Measures if the code produces the correct output"
    },
    {
      name: "Test Cases",
      weight: 0.25,
      score: (assessment.testCasesPassed / assessment.totalTestCases) * 100,
      maxScore: 100,
      details: `Passed ${assessment.testCasesPassed} of ${assessment.totalTestCases} test cases`
    }
  ];

  // Add code structure metrics if available
  if (assessment.codeQuality?.structureScore !== undefined) {
    metrics.push({
      name: "Code Structure",
      weight: 0.1,
      score: assessment.codeQuality.structureScore,
      maxScore: 100,
      details: "Quality of code organization and structure"
    });
  }

  // Add efficiency metrics
  metrics.push(
    {
      name: "Efficiency",
      weight: 0.15,
      score: assessment.efficiency,
      maxScore: 100,
      details: "Overall algorithmic efficiency"
    },
    {
      name: "Time Complexity",
      weight: 0.05,
      score: calculateComplexityScore(assessment.timeComplexity),
      maxScore: 100,
      details: `Time complexity: ${assessment.timeComplexity}`
    },
    {
      name: "Space Complexity",
      weight: 0.05,
      score: calculateComplexityScore(assessment.spaceComplexity),
      maxScore: 100,
      details: `Space complexity: ${assessment.spaceComplexity}`
    }
  );

  // Add code quality metrics
  metrics.push(
    {
      name: "Readability",
      weight: 0.1,
      score: assessment.readability,
      maxScore: 100,
      details: "Code clarity and documentation"
    }
  );

  // Add code style metrics if available
  if (assessment.codeStyle !== undefined) {
    metrics.push({
      name: "Code Style",
      weight: 0.05,
      score: assessment.codeStyle,
      maxScore: 100,
      details: "Adherence to style guidelines"
    });
  }

  // Add error handling metric if available
  if (assessment.errorHandling !== undefined) {
    metrics.push({
      name: "Error Handling",
      weight: 0.05,
      score: assessment.errorHandling,
      maxScore: 100,
      details: "Quality of error handling and edge cases"
    });
  }

  // Add pattern matching metrics if available
  if (assessment.fuzzyMatchScore !== undefined) {
    metrics.push({
      name: "Solution Match",
      weight: 0.05,
      score: assessment.fuzzyMatchScore,
      maxScore: 100,
      details: "Similarity to expected solution patterns"
    });
  }

  // Calculate totals
  const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
  const totalScore = metrics.reduce((sum, metric) => sum + (metric.score * metric.weight), 0);
  const maxPossibleScore = metrics.reduce((sum, metric) => sum + (metric.maxScore * metric.weight), 0);

  // Organize metrics by category for UI presentation
  const categorizedMetrics = {
    correctness: metrics.filter(m => ["Correctness", "Test Cases"].includes(m.name)),
    efficiency: metrics.filter(m => ["Efficiency", "Time Complexity", "Space Complexity"].includes(m.name)),
    style: metrics.filter(m => ["Readability", "Code Style", "Code Structure"].includes(m.name)),
    advanced: metrics.filter(m => ["Error Handling", "Solution Match"].includes(m.name))
  };

  return {
    metrics,
    totalWeight,
    totalScore,
    maxPossibleScore,
    categorizedMetrics
  };
};

/**
 * Calculate a score based on the time/space complexity
 * Lower complexity gets higher scores
 */
const calculateComplexityScore = (complexity: string): number => {
  const complexityMap: Record<string, number> = {
    "O(1)": 100,
    "O(log n)": 95,
    "O(n)": 90,
    "O(n log n)": 85,
    "O(n²)": 70,
    "O(n^2)": 70,
    "O(2^n)": 40,
    "O(n!)": 30
  };

  return complexityMap[complexity] || 50; // Default to 50 if unknown
};

/**
 * Normalize score to a 0-100 scale
 */
export const normalizeScore = (score: number, maxScore: number): number => {
  return (score / maxScore) * 100;
};

/**
 * Get letter grade based on normalized score with +/- gradations
 */
export const getLetterGrade = (normalizedScore: number): string => {
  if (normalizedScore >= 97) return "A+";
  if (normalizedScore >= 93) return "A";
  if (normalizedScore >= 90) return "A-";
  if (normalizedScore >= 87) return "B+";
  if (normalizedScore >= 83) return "B";
  if (normalizedScore >= 80) return "B-";
  if (normalizedScore >= 77) return "C+";
  if (normalizedScore >= 73) return "C";
  if (normalizedScore >= 70) return "C-";
  if (normalizedScore >= 67) return "D+";
  if (normalizedScore >= 63) return "D";
  if (normalizedScore >= 60) return "D-";
  return "F";
};

/**
 * Get fuzzy grade based on normalized score using specific categories
 */
export const getFuzzyGrade = (normalizedScore: number): string => {
  if (normalizedScore >= 90) return "Excellent";
  if (normalizedScore >= 80) return "Above Average";
  if (normalizedScore >= 70) return "Average";
  if (normalizedScore >= 60) return "Passed";
  return "Failed";
};

/**
 * Check if code is "dump code" - hardcoded solutions without proper structure
 * Returns an object with a boolean and a reason if it's dump code
 */
const checkForDumpCode = (assessment: CodeAssessment): { isDumpCode: boolean; reason?: string } => {
  if (!assessment.rawCode) {
    return { isDumpCode: false };
  }

  const code = assessment.rawCode;
  const language = detectLanguage(code);
  
  // Check for C/C++ dump code
  if (language === 'c' || language === 'cpp') {
    // Check for hardcoded outputs (multiple consecutive cout statements with literals)
    const hardcodedOutputPattern = /cout\s*<<\s*"[^"]*"\s*<<\s*(?:endl|"\\n"|"\n");?\s*cout\s*<<\s*"[^"]*"\s*<<\s*(?:endl|"\\n"|"\n");?/g;
    
    // Check for lack of loops in code that should have loops
    const hasLoops = /\b(?:for|while|do)\b.*[{(]/.test(code);
    
    // Check for lack of variables/dynamic behavior
    const hasVariables = /\b(?:int|float|double|char|string|auto|var)\s+\w+\s*[;=]/.test(code);
    
    // Check for lack of input handling for problems that should have it
    const hasInputHandling = /\bcin\s*>>/.test(code);
    
    // Detect patterns like cout << "*\n**\n***\n"
    const hasMultilineString = /cout\s*<<\s*"[^"]*\\n[^"]*\\n[^"]*"/.test(code);
    
    // Count the number of print statements
    const printStatementMatches = code.match(/cout\s*<<.*(?:endl|"\\n"|"\n");?/g);
    const printStatementCount = printStatementMatches ? printStatementMatches.length : 0;
    
    // For patterns like star pyramid, we should expect loops
    const starPatternIndicators = /(?:pattern|pyramid|triangle|diamond|matrix|array)/i.test(code);
    
    if (starPatternIndicators && !hasLoops && printStatementCount > 3) {
      return { 
        isDumpCode: true, 
        reason: "Hard-coded solution detected. Your code should use loops to generate patterns dynamically instead of printing each line manually."
      };
    }
    
    if (hardcodedOutputPattern.test(code) && !hasLoops && starPatternIndicators) {
      return { 
        isDumpCode: true, 
        reason: "Multiple hard-coded print statements detected. Your solution should use loops for pattern generation."
      };
    }
    
    if (hasMultilineString && starPatternIndicators) {
      return { 
        isDumpCode: true, 
        reason: "Hard-coded multi-line string detected. Your solution should generate output programmatically using loops."
      };
    }
  }
  
  // Check for Python dump code
  if (language === 'python') {
    // Check for hardcoded prints
    const hardcodedPrints = /print\s*\(\s*['"][^'"]*['"]\s*\)[\s\S]*print\s*\(\s*['"][^'"]*['"]\s*\)/g;
    
    // Check for loops
    const hasLoops = /\b(?:for|while)\b.*:/.test(code);
    
    // Check for variables
    const hasVariables = /\b(?:\w+)\s*=\s*(?!\s*['"])/.test(code);
    
    // Check for input handling
    const hasInputHandling = /\binput\s*\(/.test(code);
    
    // Detect patterns like print("*\n**\n***\n")
    const hasMultilineString = /print\s*\(\s*(?:f|r|)['"][^'"]*\\n[^'"]*['"]\s*\)/.test(code);
    
    // Count the number of print statements
    const printStatementMatches = code.match(/print\s*\(/g);
    const printStatementCount = printStatementMatches ? printStatementMatches.length : 0;
    
    // For patterns like star pyramid, we should expect loops
    const starPatternIndicators = /(?:pattern|pyramid|triangle|diamond|matrix|array)/i.test(code);
    
    if (starPatternIndicators && !hasLoops && printStatementCount > 3) {
      return { 
        isDumpCode: true, 
        reason: "Hard-coded solution detected. Your code should use loops to generate patterns dynamically instead of printing each line manually."
      };
    }
    
    if (hardcodedPrints.test(code) && !hasLoops && starPatternIndicators) {
      return { 
        isDumpCode: true, 
        reason: "Multiple hard-coded print statements detected. Your solution should use loops for pattern generation."
      };
    }
    
    if (hasMultilineString && starPatternIndicators) {
      return { 
        isDumpCode: true, 
        reason: "Hard-coded multi-line string detected. Your solution should generate output programmatically using loops."
      };
    }
  }
  
  return { isDumpCode: false };
};

/**
 * Detect the programming language from the code
 */
const detectLanguage = (code: string): string => {
  // C/C++ detection
  if (code.includes('#include <iostream>') || 
      code.includes('#include <stdio.h>') ||
      /\b(?:int|void)\s+main\s*\([^)]*\)\s*{/.test(code)) {
    return code.includes('cout') || code.includes('cin') ? 'cpp' : 'c';
  }
  
  // Python detection
  if (code.includes('def ') || 
      code.includes('import ') || 
      code.includes('print(') ||
      /^\s*for\s+\w+\s+in\s+/.test(code)) {
    return 'python';
  }
  
  // JavaScript detection
  if (code.includes('function ') || 
      code.includes('const ') || 
      code.includes('let ') ||
      code.includes('console.log')) {
    return 'javascript';
  }
  
  // Java detection
  if (code.includes('public class ') || 
      code.includes('System.out.println') ||
      /public\s+static\s+void\s+main/.test(code)) {
    return 'java';
  }
  
  return 'unknown';
};

/**
 * Provide comprehensive feedback based on assessment
 * Uses a more advanced algorithm with pattern matching and analysis
 */
export const generateFeedback = (assessment: CodeAssessment): string[] => {
  const feedback: string[] = [];
  
  // Check if this is rejected dump code
  if (assessment.codeQuality?.isDumpCode) {
    feedback.push("Your solution contains hard-coded outputs instead of a proper algorithmic approach.");
    feedback.push("Rewrite your solution to use loops and variables to generate the output dynamically.");
    feedback.push("Hard-coding the output does not demonstrate understanding of programming concepts.");
    return feedback;
  }
  
  // Code structure feedback
  if (assessment.codeQuality?.structureScore !== undefined) {
    if (assessment.codeQuality.structureScore < 70) {
      feedback.push("Your code structure needs improvement. Consider using appropriate loops, functions, and variables.");
      
      if (!assessment.codeQuality.hasLoops) {
        feedback.push("Your solution should use loops to handle repetitive tasks.");
      }
      
      if (!assessment.codeQuality.hasVariables) {
        feedback.push("Use variables to make your code more flexible and easier to maintain.");
      }
      
      if (!assessment.codeQuality.hasInputHandling) {
        feedback.push("Consider adding input handling to make your solution work with different inputs.");
      }
    }
  }
  
  // Correctness feedback with more details
  if (assessment.correctness < 70) {
    feedback.push("The solution doesn't correctly solve the problem. Review the requirements carefully.");
  } else if (assessment.correctness < 90) {
    feedback.push("The solution works but may not handle all edge cases. Consider additional testing.");
  }
  
  // Test cases feedback with specifics
  const testCasePercentage = (assessment.testCasesPassed / assessment.totalTestCases) * 100;
  if (testCasePercentage < 100) {
    feedback.push(`Passed ${assessment.testCasesPassed} out of ${assessment.totalTestCases} test cases.`);
    
    // Add specific test case details if available
    if (assessment.testCaseDetails && assessment.testCaseDetails.length > 0) {
      const failedTests = assessment.testCaseDetails.filter(test => !test.passed);
      if (failedTests.length > 0) {
        feedback.push(`Failed test cases: ${failedTests.map(test => test.name).join(", ")}`);
      }
    }
  }
  
  // Time complexity feedback with optimization suggestions
  if (assessment.timeComplexity === "O(n²)" || assessment.timeComplexity === "O(n^2)") {
    feedback.push("Consider optimizing your solution to improve time complexity. Look for nested loops that could be simplified.");
  } else if (assessment.timeComplexity === "O(2^n)" || assessment.timeComplexity === "O(n!)") {
    feedback.push("Your solution has exponential time complexity. Consider dynamic programming or memoization to optimize.");
  }
  
  // Space complexity feedback with specific suggestions
  if (assessment.spaceComplexity !== "O(1)" && assessment.spaceComplexity !== "O(log n)") {
    feedback.push("Consider ways to reduce memory usage in your solution. Look for opportunities to use in-place algorithms.");
  }
  
  // Code style feedback
  if (assessment.codeStyle !== undefined && assessment.codeStyle < 80) {
    feedback.push("Your code could benefit from better adherence to style guidelines. Consider consistent indentation and naming conventions.");
  }
  
  // Readability feedback with specific suggestions
  if (assessment.readability < 80) {
    feedback.push("Improve code readability with better variable names, function decomposition, and appropriate comments.");
  }
  
  // Error handling feedback
  if (assessment.errorHandling !== undefined && assessment.errorHandling < 70) {
    feedback.push("Your solution could benefit from better error handling and validation of input parameters.");
  }

  // Pattern matching feedback
  if (assessment.fuzzyMatchScore !== undefined && assessment.fuzzyMatchScore < 70) {
    feedback.push("Your approach differs significantly from common solution patterns. Consider reviewing standard algorithms for this problem type.");
  }
  
  // Performance metrics feedback
  if (assessment.executionTime !== undefined && assessment.executionTime > 1000) {
    feedback.push(`Your solution took ${(assessment.executionTime/1000).toFixed(2)}s to execute. Consider optimizing for better performance.`);
  }
  
  return feedback;
};

/**
 * Comprehensive assessment function that provides a complete evaluation
 * with detailed metrics and feedback
 */
export const assessCode = (assessment: CodeAssessment) => {
  // Analyze code structure if raw code is available
  if (assessment.rawCode && !assessment.codeQuality) {
    assessment.codeQuality = analyzeCodeStructure(assessment.rawCode);
  }
  
  const rubric = calculateWeightedScore(assessment);
  
  // Check if the submission was rejected as dump code
  if (rubric.rejectionReason) {
    return {
      rubric,
      normalizedScore: 0,
      letterGrade: 'F',
      feedback: [rubric.rejectionReason, "Your submission has been rejected because it uses hard-coded outputs instead of proper programming constructs."],
      performanceSummary: null,
      memorySummary: null,
      strengths: [],
      weaknesses: ["Using hard-coded outputs instead of algorithms"],
      rejected: true,
      rejectionReason: rubric.rejectionReason
    };
  }
  
  const normalizedScore = normalizeScore(rubric.totalScore, rubric.maxPossibleScore);
  const letterGrade = getLetterGrade(normalizedScore);
  const fuzzyGrade = getFuzzyGrade(normalizedScore);
  const feedback = generateFeedback(assessment);
  
  // Advanced metrics summary
  const performanceSummary = assessment.executionTime 
    ? `Execution time: ${assessment.executionTime}ms` 
    : null;
  
  const memorySummary = assessment.memoryUsage 
    ? `Memory usage: ${assessment.memoryUsage}KB` 
    : null;
  
  // Create a strengths and weaknesses analysis
  const strengths = [];
  const weaknesses = [];
  
  for (const metric of rubric.metrics) {
    if (metric.score >= 90) {
      strengths.push(`Strong ${metric.name.toLowerCase()}`);
    } else if (metric.score <= 70) {
      weaknesses.push(`Needs improvement in ${metric.name.toLowerCase()}`);
    }
  }
  
  return {
    rubric,
    normalizedScore,
    letterGrade,
    fuzzyGrade,
    feedback,
    performanceSummary,
    memorySummary,
    strengths,
    weaknesses,
    rejected: rubric.rejectionReason ? true : false,
    rejectionReason: rubric.rejectionReason
  };
};

/**
 * Analyze code structure to detect dump code and assess quality
 */
const analyzeCodeStructure = (code: string): CodeAssessment['codeQuality'] => {
  const language = detectLanguage(code);
  let hasLoops = false;
  let hasVariables = false;
  let hasInputHandling = false;
  let hasHardcodedOutput = false;
  let structureScore = 50; // Default middle score
  
  switch (language) {
    case 'cpp':
    case 'c':
      hasLoops = /\b(?:for|while|do)\b.*[{(]/.test(code);
      hasVariables = /\b(?:int|float|double|char|string|auto|var)\s+\w+\s*[;=]/.test(code);
      hasInputHandling = /\b(?:cin|scanf)\b/.test(code);
      hasHardcodedOutput = /(?:cout|printf)\s*<<\s*['"][^'"]*['"]\s*;[\s\S]*(?:cout|printf)\s*<<\s*['"][^'"]*['"]\s*;/.test(code);
      break;
      
    case 'python':
      hasLoops = /\b(?:for|while)\b.*:/.test(code);
      hasVariables = /\b(?:\w+)\s*=\s*(?!\s*['"])/.test(code);
      hasInputHandling = /\binput\s*\(/.test(code);
      hasHardcodedOutput = /print\s*\(\s*['"][^'"]*['"]\s*\)[\s\S]*print\s*\(\s*['"][^'"]*['"]\s*\)/.test(code);
      break;
      
    case 'javascript':
      hasLoops = /\b(?:for|while|do)\b.*[{(]/.test(code);
      hasVariables = /\b(?:var|let|const)\s+\w+\s*[;=]/.test(code);
      hasInputHandling = /\b(?:prompt|readline|process\.stdin)\b/.test(code);
      hasHardcodedOutput = /console\.log\s*\(\s*['"][^'"]*['"]\s*\);[\s\S]*console\.log\s*\(\s*['"][^'"]*['"]\s*\);/.test(code);
      break;
      
    case 'java':
      hasLoops = /\b(?:for|while|do)\b.*[{(]/.test(code);
      hasVariables = /\b(?:int|float|double|char|String|var)\s+\w+\s*[;=]/.test(code);
      hasInputHandling = /\b(?:Scanner|BufferedReader|System\.in)\b/.test(code);
      hasHardcodedOutput = /System\.out\.println\s*\(\s*['"][^'"]*['"]\s*\);[\s\S]*System\.out\.println\s*\(\s*['"][^'"]*['"]\s*\);/.test(code);
      break;
  }
  
  // Calculate a structure score based on programming best practices
  let score = 50; // Start with an average score
  
  if (hasLoops) score += 15;
  if (hasVariables) score += 15;
  if (hasInputHandling) score += 10;
  if (!hasHardcodedOutput) score += 10;
  
  // Check for code organization
  const hasFunctions = /\b(?:function|def|void|int|String|public static)\s+\w+\s*\(/.test(code);
  if (hasFunctions) score += 10;
  
  // Check for comments
  const hasComments = /(?:\/\/|\/\*|\*\/|#)/.test(code);
  if (hasComments) score += 5;
  
  // Check for consistent indentation
  const hasConsistentIndentation = /\n\s+\S+[\s\S]*\n\s+\S+/.test(code);
  if (hasConsistentIndentation) score += 5;
  
  // Detect dump code pattern: multiple consecutive print statements
  const isDumpCode = determineIfDumpCode(code, language);
  
  return {
    isDumpCode,
    hasLoops,
    hasVariables,
    hasInputHandling,
    hasHardcodedOutput,
    structureScore: Math.min(score, 100) // Cap at 100
  };
};

/**
 * Determine if the code is likely "dump code" based on language-specific patterns
 */
const determineIfDumpCode = (code: string, language: string): boolean => {
  // Common patterns that indicate dump code across languages
  const starPattern = /[*]{1,10}/g;
  let printStatements: RegExpMatchArray | null = null;
  let consecutivePrints = false;
  
  switch (language) {
    case 'cpp':
    case 'c':
      printStatements = code.match(/(?:cout|printf)\s*<<?\s*['"][^'"]*['"]/g);
      if (printStatements && printStatements.length > 3) {
        // Check if these print statements contain incrementing patterns like * ** *** ****
        let starPatternCount = 0;
        for (const stmt of printStatements) {
          if (starPattern.test(stmt)) starPatternCount++;
        }
        consecutivePrints = starPatternCount > 2;
      }
      break;
      
    case 'python':
      printStatements = code.match(/print\s*\(\s*['"][^'"]*['"]\s*\)/g);
      if (printStatements && printStatements.length > 3) {
        let starPatternCount = 0;
        for (const stmt of printStatements) {
          if (starPattern.test(stmt)) starPatternCount++;
        }
        consecutivePrints = starPatternCount > 2;
      }
      break;
      
    case 'javascript':
      printStatements = code.match(/console\.log\s*\(\s*['"][^'"]*['"]\s*\)/g);
      if (printStatements && printStatements.length > 3) {
        let starPatternCount = 0;
        for (const stmt of printStatements) {
          if (starPattern.test(stmt)) starPatternCount++;
        }
        consecutivePrints = starPatternCount > 2;
      }
      break;
      
    case 'java':
      printStatements = code.match(/System\.out\.println?\s*\(\s*['"][^'"]*['"]\s*\)/g);
      if (printStatements && printStatements.length > 3) {
        let starPatternCount = 0;
        for (const stmt of printStatements) {
          if (starPattern.test(stmt)) starPatternCount++;
        }
        consecutivePrints = starPatternCount > 2;
      }
      break;
  }
  
  // Special case for patterns
  const patternProblem = /pattern|pyramid|triangle|diamond|matrix|array/i.test(code);
  const hasNestedLoops = /for\s*\([^)]*\)\s*[{]?[\s\S]*for\s*\([^)]*\)/i.test(code) || 
                         /for\s+\w+\s+in[\s\S]*for\s+\w+\s+in/i.test(code);
  
  // For pattern problems, we really want to see nested loops rather than hardcoded outputs
  if (patternProblem && !hasNestedLoops && consecutivePrints) {
    return true;
  }
  
  return false;
};
