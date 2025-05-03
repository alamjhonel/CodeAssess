-- Enable RLS on assessments table
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for assessments table
CREATE POLICY "Enable read access for all authenticated users" ON assessments
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON assessments
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for users based on role" ON assessments
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'teacher'
        )
    )
    WITH CHECK (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'teacher'
        )
    );

CREATE POLICY "Enable delete for users based on role" ON assessments
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'teacher'
        )
    );

-- Enable RLS on submissions table
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions table
CREATE POLICY "Enable read access for students and teachers" ON submissions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM assessments
            WHERE assessments.id = submissions.assessment_id
            AND assessments.created_by = auth.uid()
        )
    );

CREATE POLICY "Enable insert for students only" ON submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'student'
        )
    );

CREATE POLICY "Enable update for students and teachers" ON submissions
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM assessments
            WHERE assessments.id = submissions.assessment_id
            AND assessments.created_by = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM assessments
            WHERE assessments.id = submissions.assessment_id
            AND assessments.created_by = auth.uid()
        )
    );

CREATE POLICY "Enable delete for students and teachers" ON submissions
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM assessments
            WHERE assessments.id = submissions.assessment_id
            AND assessments.created_by = auth.uid()
        )
    );