-- Enable Row Level Security
ALTER TABLE "public"."submissions" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "submissions_select_policy" ON "public"."submissions";
DROP POLICY IF EXISTS "submissions_insert_policy" ON "public"."submissions";
DROP POLICY IF EXISTS "submissions_update_policy" ON "public"."submissions";
DROP POLICY IF EXISTS "submissions_delete_policy" ON "public"."submissions";

-- Create policy for SELECT (viewing submissions)
CREATE POLICY "submissions_select_policy" ON "public"."submissions"
FOR SELECT
TO public
USING (
  -- Students can view their own submissions
  auth.uid() = student_id
  OR
  -- Teachers can view submissions for assessments they created
  EXISTS (
    SELECT 1 FROM "public"."assessments"
    WHERE assessments.id = submissions.assessment_id
    AND assessments.created_by = auth.uid()
  )
);

-- Create policy for INSERT (creating submissions)
CREATE POLICY "submissions_insert_policy" ON "public"."submissions"
FOR INSERT
TO public
WITH CHECK (
  -- Only students can create submissions
  auth.uid() = student_id
  AND
  -- Submission must be for an existing assessment
  EXISTS (
    SELECT 1 FROM "public"."assessments"
    WHERE assessments.id = submissions.assessment_id
  )
);

-- Create policy for UPDATE (modifying submissions)
CREATE POLICY "submissions_update_policy" ON "public"."submissions"
FOR UPDATE
TO public
USING (
  -- Students can update their own submissions if not graded
  (auth.uid() = student_id AND status != 'graded')
  OR
  -- Teachers can update submissions they are grading
  EXISTS (
    SELECT 1 FROM "public"."assessments"
    WHERE assessments.id = submissions.assessment_id
    AND assessments.created_by = auth.uid()
  )
)
WITH CHECK (
  -- Students can only update their own submissions
  auth.uid() = student_id
  OR
  -- Teachers can update submissions they are grading
  EXISTS (
    SELECT 1 FROM "public"."assessments"
    WHERE assessments.id = submissions.assessment_id
    AND assessments.created_by = auth.uid()
  )
);

-- Create policy for DELETE (removing submissions)
CREATE POLICY "submissions_delete_policy" ON "public"."submissions"
FOR DELETE
TO public
USING (
  -- Students can delete their own submissions if not graded
  (auth.uid() = student_id AND status != 'graded')
  OR
  -- Teachers can delete submissions for assessments they created
  EXISTS (
    SELECT 1 FROM "public"."assessments"
    WHERE assessments.id = submissions.assessment_id
    AND assessments.created_by = auth.uid()
  )
); 