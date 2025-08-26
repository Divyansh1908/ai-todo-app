'use client'

/*

Why use this hook - 

Great question! Let me explain why we created this as a custom hook and the benefits of this approach:

🎯 Why Create a Custom Hook?
The Problem Without a Hook:
If we didn't use a custom hook, each component would have to duplicate this logic:

✅ Benefits of Using a Custom Hook:
1. DRY Principle (Don't Repeat Yourself)
2. Shared State Management
3. Centralized Logic
4. Easy Testing
5. Performance Benefits
🏗️ Architecture Comparison:
Without Custom Hook (Bad):
Result: 3 timers, duplicated code, potential inconsistencies
Clock Component ──► Own timer, own logic, own state
TodoItem Component ──► Own timer, own logic, own state  
TodosPage Component ──► Own timer, own logic, own state

With Custom Hook (Good):
useCurrentTime Hook ──► One timer, shared logic, shared state
         ↙       ↓       ↘
    Clock   TodoItem   TodosPage
Result: 1 timer, no duplication, consistent data 

🎪 Real-World Analogy:
Think of it like a radio station:

Without Hook = Everyone has their own radio station:

Clock has "Time Radio 101.1"
TodoItem has "Time Radio 102.5"
TodosPage has "Time Radio 103.9"
Each broadcasts slightly different times! 📻📻📻
With Hook = Everyone listens to the same station:

One "Master Time Radio 100.1"
Everyone gets the exact same time
More efficient, consistent! 📻➡️🎧🎧🎧
🚀 Key Benefits Summary:
Code Reusability - Write once, use everywhere
Consistency - All components use the same time source
Performance - One timer instead of multiple
Maintainability - Change logic in one place
Testing - Test once, works everywhere
Memory Efficiency - Shared resources instead of duplicated
This is exactly why React hooks exist - to share stateful logic across components without duplication! 🎯

*/

import { useState, useEffect } from 'react'

export function useCurrentTime() {
  // 📅 State to store the current time - starts with "right now"
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  
  // 🚀 State to track if component has loaded in browser (prevents hydration issues)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // ✅ Tell React: "Yes, I'm now running in the browser, not on server"
    setMounted(true)
    
    // ⏰ Update the time immediately when component loads
    setCurrentTime(new Date())
    
    // ⏱️ Set up a timer that runs every 60,000 milliseconds (1 minute)
    // Think of this like setting an alarm clock that goes off every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date()) // Update time every minute
    }, 60000)

    // 🧹 Cleanup function: When component is destroyed, cancel the timer
    // This prevents memory leaks (like canceling a subscription when you move)
    return () => clearInterval(timer)
  }, []) // Empty array means "only run this once when component mounts"

// ----------------------------------------------------

  // 🚨 Function to check if a task is overdue
  const isOverdue = (dueDate: string | null, completed: boolean = false) => {
    // 🛡️ Safety checks first:
    if (!dueDate) return false        // No due date = not overdue
    if (completed) return false       // Already completed = not overdue
    if (!mounted) return false        // Still loading = don't check yet
    
    // 📅 Convert the due date string into a Date object
    const due = new Date(dueDate)
    const now = currentTime // Use our real-time current time
    
    // ⏰ Set due date to end of day (11:59:59 PM) to be fair
    // This means if something is due "Jan 15", you have until 11:59 PM on Jan 15
    due.setHours(23, 59, 59, 999)
    
    // ⚖️ Compare: Is current time AFTER the due date?
    return now > due
  }

// ---------------------------------------------------- getTimeUntilDue NOT USED 
// Possible Uses 
// Option 1: Use it in TodoItem component
// Show the time remaining next to each todo item

// Option 2: Use it in tooltips
// Show detailed timing when hovering over due dates

// Option 3: Remove it for now
// Since it's unused, you could remove it to keep the code clean

// Option 4: Use it in TodoList stats
// Show "X tasks due today, Y overdue" etc.


  // 📊 Function to calculate how much time is left (or how overdue)
  const getTimeUntilDue = (dueDate: string | null) => {
    // 🛡️ Safety checks
    if (!dueDate) return null     // No due date = no calculation
    if (!mounted) return null     // Still loading = wait
    
    const due = new Date(dueDate)
    const now = currentTime
    
    // ⏰ Set due date to end of day (same as above)
    due.setHours(23, 59, 59, 999)
    
    // 🧮 Math time! Calculate difference in milliseconds
    const diffMs = due.getTime() - now.getTime()
    
    // 📅 Convert milliseconds to days
    // 1000 ms = 1 second
    // 60 seconds = 1 minute  
    // 60 minutes = 1 hour
    // 24 hours = 1 day
    // Math.ceil rounds up (so 0.1 days = 1 day)
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    // 🏷️ Return human-readable messages based on the difference
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue` // Negative = overdue
    if (diffDays === 0) return 'Due today'                        // Zero = today
    if (diffDays === 1) return 'Due tomorrow'                     // One = tomorrow
    return `Due in ${diffDays} days`                               // Positive = future
  }

  // 📦 Return all the useful things this hook provides
  return {
    currentTime,      // 📅 The current time (updates every minute)
    mounted,          // 🚀 Whether component is ready (prevents hydration issues)
    isOverdue,        // 🚨 Function to check if a task is overdue
    getTimeUntilDue   // 📊 Function to get human-readable time remaining
  }
}