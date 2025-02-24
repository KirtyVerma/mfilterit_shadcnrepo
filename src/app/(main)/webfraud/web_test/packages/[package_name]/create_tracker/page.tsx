"use client"
import { useParams } from 'next/navigation';
import React from 'react'

export default function CreateTracker() {
    const packageName = useParams().package_name;
  return (
    <div>
        CreateTracker for {packageName}
      
    </div>
  )
}
