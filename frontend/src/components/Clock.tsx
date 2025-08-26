'use client'

import { useState, useEffect } from 'react'
import { Clock as ClockIcon } from 'lucide-react'

export function Clock() {
  const [time, setTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update every minute instead of every second

    return () => clearInterval(timer)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border rounded-lg px-3 py-2 card-shadow">
        <ClockIcon className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimezone = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      timeZoneName: 'short'
    }).split(', ').pop() || 'Local'
  }

  return (
    <div className="flex items-center gap-2 text-sm bg-card border rounded-lg px-3 py-2 card-shadow">
      <ClockIcon className="h-4 w-4 text-primary" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatTime(time)}</span>
          <span className="text-muted-foreground text-xs">
            {getTimezone(time)}
          </span>
        </div>
        <div className="hidden sm:block text-muted-foreground">•</div>
        <span className="text-muted-foreground text-xs">
          {formatDate(time)}
        </span>
      </div>
    </div>
  )
}