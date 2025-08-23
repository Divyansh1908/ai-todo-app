import SupabaseService from './supabaseService'

const supabaseService = SupabaseService.getInstance()
const supabase = supabaseService.getClient()

export async function ensureTablesExist(): Promise<void> {
  try {
    console.log('Checking if todos table exists...')
    
    // Try to query the table - if it doesn't exist, this will fail
    const { data, error } = await supabase
      .from('todos')
      .select('count(*)', { count: 'exact', head: true })
    
    if (error) {
      if (error.message.includes('relation "public.todos" does not exist')) {
        console.log('Todos table does not exist. Please create it manually in Supabase.')
        console.log('Go to your Supabase dashboard > SQL Editor and run the schema from backend/database/schema.sql')
        return
      }
      throw error
    }
    
    console.log('Todos table exists and is accessible')
  } catch (error) {
    console.error('Database setup error:', error)
    throw error
  }
}

export async function createSampleData(): Promise<void> {
  try {
    // Check if we already have data
    const { data: existingData, error: countError } = await supabase
      .from('todos')
      .select('id', { count: 'exact' })
      .limit(1)
    
    if (countError) {
      throw countError
    }
    
    if (existingData && existingData.length > 0) {
      console.log('Sample data already exists')
      return
    }
    
    console.log('Creating sample data...')
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
    
    const { error: insertError } = await supabase
      .from('todos')
      .insert(sampleTodos)
    
    if (insertError) {
      throw insertError
    }
    
    console.log('Sample data created successfully')
  } catch (error) {
    console.error('Failed to create sample data:', error)
  }
}