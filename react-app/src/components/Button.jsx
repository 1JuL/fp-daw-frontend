import React from 'react'

export function Button ({callback , label }) {
  return (
    <button onClick={callback}>{label}</button>
  )
}