-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  status VARCHAR(20) DEFAULT 'todo' NOT NULL CHECK (status IN ('todo', 'in-progress', 'completed')),
  priority VARCHAR(10) DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category VARCHAR(50) DEFAULT 'General' NOT NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_todos_status_priority ON todos(status, priority);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - optional but recommended for security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- You can customize this based on your authentication requirements
CREATE POLICY "Allow all operations on todos" ON todos
FOR ALL USING (true);

-- Insert some sample data
INSERT INTO todos (title, description, status, priority, category, due_date) VALUES
('Setup Supabase integration', 'Configure Supabase database and integrate with the todo app', 'in-progress', 'high', 'Development', NOW() + INTERVAL '2 days'),
('Design user interface', 'Create modern and responsive UI components', 'completed', 'high', 'Design', NOW() - INTERVAL '1 day'),
('Write API documentation', 'Document all API endpoints for the todo application', 'todo', 'medium', 'Documentation', NOW() + INTERVAL '5 days'),
('Setup user authentication', 'Implement user login and registration system', 'todo', 'high', 'Development', NOW() + INTERVAL '7 days'),
('Add search functionality', 'Implement search and filter capabilities', 'todo', 'low', 'Development', NOW() + INTERVAL '10 days'),
('Team meeting', 'Weekly sync with development team', 'completed', 'low', 'Meeting', NOW() - INTERVAL '2 days'),
('Database optimization', 'Optimize database queries and add proper indexes', 'in-progress', 'medium', 'Development', NOW() + INTERVAL '3 days'),
('Mobile responsiveness', 'Ensure the app works well on mobile devices', 'todo', 'medium', 'Design', NOW() + INTERVAL '8 days');