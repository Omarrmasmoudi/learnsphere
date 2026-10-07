'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Single-series charts: one accent color, no legend (the card title names the series).
const SERIES = '#8B5CF6'
const GRID = '#1F2937' // one step off the card surface; hairline, solid
const AXIS_TEXT = '#9CA3AF'
const BAR_SIZE = 24

const tooltipStyle = {
  contentStyle: { backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 6 },
  labelStyle: { color: '#F9FAFB' },
  itemStyle: { color: '#D1D5DB' },
  cursor: { fill: 'rgba(139, 92, 246, 0.08)' },
  separator: ': ',
}

function TableView({ caption, column, rows }: { caption: string; column: string; rows: [string, number][] }) {
  return (
    <details className="mt-3 text-sm text-gray-400">
      <summary className="cursor-pointer select-none hover:text-gray-200">View as table</summary>
      <table className="mt-2 w-full text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-gray-800 text-gray-300">
            <th className="py-1 font-medium">{column}</th>
            <th className="py-1 text-right font-medium">Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-gray-800/60">
              <td className="py-1">{label}</td>
              <td className="py-1 text-right tabular-nums">{value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

export function MonthlyEnrollmentsChart({ data }: { data: { month: string; label: string; enrollments: number }[] }) {
  return (
    <>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis dataKey="month" stroke={AXIS_TEXT} tickLine={false} axisLine={{ stroke: GRID }} />
            <YAxis stroke={AXIS_TEXT} allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip
              {...tooltipStyle}
              labelFormatter={(_, payload) => payload?.[0]?.payload.label ?? ''}
              formatter={(value: number) => [value.toLocaleString(), 'Enrollments']}
            />
            <Bar dataKey="enrollments" fill={SERIES} barSize={BAR_SIZE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <TableView caption="Enrollments by month" column="Month" rows={data.map((d) => [d.label, d.enrollments])} />
    </>
  )
}

export function CourseEnrollmentsChart({ data }: { data: { course: string; enrollments: number }[] }) {
  // Horizontal bars keep long course names readable without rotated labels
  const height = Math.max(160, data.length * 40 + 32)
  return (
    <>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke={GRID} />
            <XAxis type="number" stroke={AXIS_TEXT} allowDecimals={false} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="course"
              width={160}
              stroke={AXIS_TEXT}
              tickLine={false}
              axisLine={{ stroke: GRID }}
              // Truncate to one line; the tooltip and table carry the full name
              tickFormatter={(name: string) => (name.length > 18 ? `${name.slice(0, 17)}…` : name)}
            />
            <Tooltip {...tooltipStyle} formatter={(value: number) => [value.toLocaleString(), 'Enrollments']} />
            <Bar dataKey="enrollments" fill={SERIES} barSize={BAR_SIZE} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <TableView caption="Enrollments by course" column="Course" rows={data.map((d) => [d.course, d.enrollments])} />
    </>
  )
}
