# Alma leads Application

This application is designed to manage leads for an immigration law firm, providing a public form for lead submission and an admin interface for lead management.

## Table of Contents

1. [Running the Application Locally](#running-the-application-locally)
2. [Navigating the Application](#navigating-the-application)
3. [Project Structure](#project-structure)
4. [Design Choices](#design-choices)
5. [Technologies Used](#technologies-used)

## Running the Application Locally

To run this application on your local machine, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/ricarellano/alma-leads.git
   cd alma-leads
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Navigating the Application

1. **Public Lead Submission Form**
- URL: `http://localhost:3000/`
- This is the landing page of the application.
- Potential clients can fill out their information and submit it as a new lead.
- Fields include personal details, visa preferences, and additional information.

2. **Admin Login**
- URL: `http://localhost:3000/admin/login`
- Use the following mock credentials to log in:
  - Email: admin@example.com
  - Password: password123

3. **Admin Dashboard**
- URL: `http://localhost:3000/admin/leads`
- After logging in, you'll be redirected to the admin dashboard.
- Here you can view all submitted leads, search for specific leads, and filter by status.

4. **Lead Management**
- On the admin dashboard, you can:
  - View lead details including name, submission date, status, and country.
  - Update lead status from "Pending" to "Reached Out".
  - Use the search bar to find specific leads.
  - Filter leads by status using the dropdown menu.

5. **Pagination**
- Navigate through multiple pages of leads using the pagination controls at the bottom of the lead list.

## Project Structure

The project follows a standard Next.js structure with some additional organization:

- `/app`: Contains the main application pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and Redux store setup
- `/public`: Static assets

Key files:
- `/app/page.tsx`: The main landing page with the lead form
- `/app/admin/leads/page.tsx`: The admin interface for managing leads
- `/components/LeadForm.tsx`: The lead submission form component
- `/lib/features/leadsSlice.ts`: Redux slice for managing lead state

## Design Choices

1. **Next.js App Router**: I chose to use Next.js with the App Router for its built-in API routes, server-side rendering capabilities, and simplified routing system.

2. **Redux Toolkit**: For state management, I opted for Redux Toolkit to manage the global state of leads. This allows for easy scaling and management of complex state logic.

3. **Tailwind CSS**: I used Tailwind CSS for styling to ensure rapid development and consistent design across the application.

4. **shadcn/ui**: This component library was chosen for its high-quality, accessible components that integrate well with Tailwind CSS.

5. **Zod**: For form validation, I used Zod to create a robust schema-based validation system that integrates well with TypeScript.

6. **Responsive Design**: The application is built with a mobile-first approach, ensuring it works well on various screen sizes.

7. **Separation of Concerns**: I separated the public lead form and admin interface to maintain clear boundaries between different parts of the application.

## Technologies Used

- Next.js 15+ (App Router)
- React 19+
- Redux Toolkit
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod
- React Hook Form
