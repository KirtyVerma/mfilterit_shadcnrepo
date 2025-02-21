import { useParams } from 'next/navigation'
import React from 'react'

export default function TrackerConfig() {
  const params = useParams()
  return (
    <div>
      config of {params.tracker_id}
    </div>
  )
}
