
# CodeGrade: Code Assessment using Rubric-based Fuzzy Logic

## Introduction

CodeGrade is a state-of-the-art code assessment platform designed for educational institutions, specifically developed for first year IT/CS TUP students. The system utilizes rubric-based fuzzy logic assessment with bisector method defuzzification to provide fair, accurate, and comprehensive evaluations of student code submissions.

This approach enables more nuanced grading that considers multiple factors beyond simple correctness, resulting in fairer assessments and better learning outcomes for students.

## Features

- **Rubric-based Assessment**: Create customized rubric criteria for code evaluation with weight distributions
- **Fuzzy Logic Grading**: Utilize bisector method defuzzification for accurate and fair assessment
- **Multiple Language Support**: Assess code written in C, C++, Python, and more
- **Instructor Dashboard**: Create courses, assessments, and review student submissions with detailed metrics
- **Student Portal**: Submit assignments, view feedback, and track progress
- **Analytics**: Visualize performance metrics and assessment statistics
- **Responsive Design**: Seamlessly works across desktop and mobile devices

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui component library for consistent UI
  - React Router for navigation
  - Tanstack Query (React Query) for data fetching and state management
  - Recharts for data visualization
  - Lucide React for icons

- **Backend**:
  - Supabase for authentication, database, and storage
  - PostgreSQL database
  - Supabase RLS policies for security
  - Serverless functions for specialized operations

## Requirements

- Node.js (v16 or higher)
- npm (v7 or higher), yarn, pnpm, or bun
- Modern web browser (Chrome, Firefox, Safari, Edge)
- TXT editor for code files
- Internet connection for accessing Supabase services

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/codegrade.git
   cd fuzzy-assessment-hub
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open your browser and navigate to `http://localhost:8080` or the URL displayed in your terminal

## How to Use

### For Instructors

1. Register and log in as an instructor
2. Create courses and add students
3. Create assessments with custom rubrics for different programming languages
4. Set up evaluation criteria with appropriate weights
5. Review and grade student submissions using the fuzzy logic system
6. View analytics and export results

### For Students

1. Register and log in as a student
2. View assigned courses and assessments
3. Submit code for evaluation
4. View detailed feedback and grades based on the rubric
5. Track progress through the dashboard

## Deployment

The application can be built for production using:

```sh
npm run build
# or
yarn build
# or
pnpm build
# or
bun run build
```

This will create an optimized build in the `dist` folder that can be deployed to any static hosting service.

## License

[MIT License](LICENSE)
