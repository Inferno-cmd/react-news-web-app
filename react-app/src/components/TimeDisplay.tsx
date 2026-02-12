import { useState, useEffect } from 'react'
import './TimeDisplay.css'

export function TimeDisplay() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    // Set initial time and date
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      setTime(timeString)
      setDate(dateString)
    }

    // Update immediately
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="time-display">
      <div className="time">{time || '--:--:--'}</div>
      <div className="date">{date || 'Loading...'}</div>
    </div>
  )
}
