import { Card, CardContent } from './Card'

interface KPICardProps {
  icon: string
  label: string
  value: number | string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export function KPICard({ icon, label, value, trend }: KPICardProps) {
  return (
    <Card variant="elevated" className="group">
      <CardContent className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1.5 flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {label}
          </p>
          <p className="text-4xl font-bold text-gray-800 mb-2">{value}</p>
          {trend && (
            <div className={`text-xs font-semibold flex items-center gap-1 ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
