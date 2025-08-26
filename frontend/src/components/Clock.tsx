'use client'

import { Clock as ClockIcon } from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export function Clock() {
  const { currentTime, mounted } = useCurrentTime()

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
          <span className="font-medium">{formatTime(currentTime)}</span>
          <span className="text-muted-foreground text-xs">
            {getTimezone(currentTime)}
          </span>
        </div>
        <div className="hidden sm:block text-muted-foreground">•</div>
        <span className="text-muted-foreground text-xs">
          {formatDate(currentTime)}
        </span>
      </div>
    </div>
  )
}