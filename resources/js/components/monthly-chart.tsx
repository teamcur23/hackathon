import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryData {
    name: string
    amount: number
    color: string
}

interface MonthlyChartProps {
    data: CategoryData[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0]
            return (
                <div className="bg-background border rounded-lg p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">${data.value.toFixed(2)}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="amount">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
