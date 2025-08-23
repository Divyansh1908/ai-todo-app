# Supabase Database Setup Guide

This guide will help you set up Supabase database integration for the AI Todo Manager application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. The project cloned and dependencies installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ai-todo-manager`
   - **Database Password**: Choose a secure password
   - **Region**: Choose the region closest to you
5. Click "Create new project"
6. Wait for the project to be set up (usually 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

### Backend Configuration

1. Navigate to the `backend/` directory
2. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and update the Supabase credentials:
   ```
   PORT=3001
   NODE_ENV=development
   
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Frontend Configuration

1. Navigate to the `frontend/` directory
2. Copy the environment example file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Edit `.env.local`:
   ```
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `backend/database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- The `todos` table with all required columns
- Proper indexes for performance
- Row Level Security (RLS) policies
- A trigger for automatic `updated_at` timestamps
- Sample data to get started

## Step 5: Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `todos` table with sample data
3. The table should have columns: `id`, `title`, `description`, `completed`, `status`, `priority`, `category`, `due_date`, `created_at`, `updated_at`

## Step 6: Test the Integration

1. Start the backend server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open http://localhost:3000 in your browser
4. You should see the sample todos loaded from your Supabase database
5. Try creating, editing, and deleting todos to verify everything works

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**:
   - Make sure you've copied the correct URL and anon key
   - Ensure there are no extra spaces in your `.env` file
   - Restart your backend server after updating environment variables

2. **Database connection failed**:
   - Verify your Supabase project is active and not paused
   - Check that your URL and key are correct
   - Ensure your internet connection is stable

3. **Frontend can't connect to backend**:
   - Make sure the backend is running on port 3001
   - Verify the `NEXT_PUBLIC_API_URL` in `.env.local` is correct
   - Check browser console for CORS errors

4. **"Todo not found" errors**:
   - Make sure the database schema was applied correctly
   - Check that the RLS policies are set up properly
   - Verify the sample data was inserted

### Database Schema Issues

If you need to reset your database:

1. Go to **SQL Editor** in Supabase
2. Run: `DROP TABLE IF EXISTS todos CASCADE;`
3. Re-run the schema from `backend/database/schema.sql`

## Security Notes

- The anon key is safe to use in client-side code
- Row Level Security (RLS) is enabled for data protection
- Never commit your actual environment variables to version control
- Consider setting up authentication for production use

## Next Steps

- Set up user authentication with Supabase Auth
- Add real-time subscriptions for collaborative editing
- Implement file uploads for todo attachments
- Set up automated backups for your database

For more advanced configuration, refer to the [Supabase Documentation](https://supabase.com/docs).