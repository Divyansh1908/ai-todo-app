import { Todo } from '@/types/todo'
import { v4 as uuidv4 } from 'uuid'

export const sampleTodos: Todo[] = [
  {
    id: uuidv4(),
    title: "Design new landing page",
    description: "Create mockups and wireframes for the new product landing page with modern UI/UX principles",
    completed: false,
    status: "in-progress",
    priority: "high",
    category: "Design",
    dueDate: "2025-01-15",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z"
  },
  {
    id: uuidv4(),
    title: "Fix authentication bug",
    description: "Users are experiencing login issues on mobile devices. Investigation needed.",
    completed: false,
    status: "todo",
    priority: "high",
    category: "Development",
    dueDate: "2025-01-12",
    createdAt: "2025-01-09T14:30:00Z",
    updatedAt: "2025-01-09T14:30:00Z"
  },
  {
    id: uuidv4(),
    title: "Write technical documentation",
    description: "Document the new API endpoints and update the developer guide",
    completed: true,
    status: "completed",
    priority: "medium",
    category: "Documentation",
    dueDate: "2025-01-10",
    createdAt: "2025-01-08T09:00:00Z",
    updatedAt: "2025-01-10T16:00:00Z"
  },
  {
    id: uuidv4(),
    title: "Team standup meeting",
    description: "Daily sync with the development team to discuss progress and blockers",
    completed: true,
    status: "completed",
    priority: "low",
    category: "Meeting",
    dueDate: "2025-01-10",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T09:15:00Z"
  },
  {
    id: uuidv4(),
    title: "Update project dependencies",
    description: "Audit and update all npm packages to their latest stable versions",
    completed: false,
    status: "todo",
    priority: "medium",
    category: "Development",
    dueDate: "2025-01-20",
    createdAt: "2025-01-09T11:00:00Z",
    updatedAt: "2025-01-09T11:00:00Z"
  },
  {
    id: uuidv4(),
    title: "Research competitor analysis",
    description: "Analyze top 5 competitors and their feature offerings for the quarterly review",
    completed: false,
    status: "in-progress",
    priority: "low",
    category: "Research",
    dueDate: "2025-01-25",
    createdAt: "2025-01-08T16:00:00Z",
    updatedAt: "2025-01-10T14:00:00Z"
  },
  {
    id: uuidv4(),
    title: "Set up monitoring alerts",
    description: "Configure system alerts for server performance and error tracking",
    completed: false,
    status: "todo",
    priority: "medium",
    category: "DevOps",
    dueDate: "2025-01-18",
    createdAt: "2025-01-09T13:00:00Z",
    updatedAt: "2025-01-09T13:00:00Z"
  },
  {
    id: uuidv4(),
    title: "Client presentation",
    description: "Prepare slides for the quarterly business review with key stakeholders",
    completed: false,
    status: "todo",
    priority: "high",
    category: "Business",
    dueDate: "2025-01-16",
    createdAt: "2025-01-08T12:00:00Z",
    updatedAt: "2025-01-08T12:00:00Z"
  }
]

export const categories = [
  "General",
  "Development", 
  "Design",
  "Documentation",
  "Meeting",
  "Research",
  "DevOps",
  "Business",
  "Personal",
  "Shopping"
]