import SupabaseService from '../services/supabaseService'
import dotenv from 'dotenv'

dotenv.config()

async function setupDatabase() {
  try {
    const supabaseService = SupabaseService.getInstance()
    const supabase = supabaseService.getClient()
    
    console.log('Setting up database...')
    
    // Create the todos table using raw SQL
    const createTableSQL = `
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
      DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
      CREATE TRIGGER update_todos_updated_at
          BEFORE UPDATE ON todos
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      -- Enable Row Level Security (RLS) - optional but recommended for security
      ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

      -- Create a policy that allows all operations for now
      DROP POLICY IF EXISTS "Allow all operations on todos" ON todos;
      CREATE POLICY "Allow all operations on todos" ON todos
      FOR ALL USING (true);
    `
    
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    
    if (error) {
      console.error('Error creating table with RPC, trying direct approach:', error)
      
      // Fallback: try creating table directly
      const { error: createError } = await supabase
        .from('todos')
        .select('*')
        .limit(1)
      
      if (createError && createError.message.includes('does not exist')) {
        console.log('Table does not exist. Please run the SQL schema manually in Supabase Dashboard.')
        console.log('Go to: Supabase Dashboard > SQL Editor > New Query')
        console.log('Copy the contents of: backend/database/schema.sql')
        console.log('Then paste and run it.')
        process.exit(1)
      }
    } else {
      console.log('Database table created successfully!')
    }
    
    // Insert sample data
    const sampleTodos = [
      {
        title: 'Setup Supabase integration',
        description: 'Configure Supabase database and integrate with the todo app',
        status: 'in-progress',
        priority: 'high',
        category: 'Development',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      },
      {
        title: 'Write API documentation',
        description: 'Document all API endpoints for the todo application',
        status: 'todo',
        priority: 'medium',
        category: 'Documentation',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      },
      {
        title: 'Team meeting',
        description: 'Weekly sync with development team',
        status: 'completed',
        priority: 'low',
        category: 'Meeting',
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true
      }
    ]
    
    console.log('Inserting sample data...')
    const { error: insertError } = await supabase
      .from('todos')
      .insert(sampleTodos)
    
    if (insertError) {
      console.error('Error inserting sample data:', insertError)
    } else {
      console.log('Sample data inserted successfully!')
    }
    
    console.log('Database setup completed!')
    process.exit(0)
    
  } catch (error) {
    console.error('Database setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()