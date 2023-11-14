'use client'

import {ReactNode} from 'react'

export function Table(props: {
  data?: Record<string, any>[]
  columns?: {
    name: string
    property: string
    builder?: (value: any, index: number) => ReactNode
  }[]
}) {

  const columns = props.columns ?? []
  const data = props.data ?? []

  return (
    <table className={`w-full`}>
      <thead>
        <tr className={`h-8 border-b`}>
          {columns.map((column, index) => (
            <th key={index} className={`px-4 border-r last:border-r-0 font-normal`}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className={`h-8 border-b`}>
            {columns.map((column, index) => (
              <td key={index}>{column.builder?.(row[column.property], index) ?? row[column.property]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
