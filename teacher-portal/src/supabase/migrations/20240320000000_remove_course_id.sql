-- First make the course_id column nullable
ALTER TABLE "public"."assessments" ALTER COLUMN "course_id" DROP NOT NULL;

-- Remove the foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'assessments_course_id_fkey'
    ) THEN
        ALTER TABLE "public"."assessments" DROP CONSTRAINT "assessments_course_id_fkey";
    END IF;
END $$;

-- Finally remove the course_id column
ALTER TABLE "public"."assessments" DROP COLUMN IF EXISTS "course_id";

-- Update the database types to reflect the changes
ALTER TYPE "public"."assessments" DROP ATTRIBUTE IF EXISTS "course_id"; 