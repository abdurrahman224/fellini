import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../../../../services/axiosInstance';

const COLORS = ['#9AAFC8', '#3FC3FF', '#7C3AED', '#A78BFA', '#FFD166', '#06D6A0'];

const mapApiToPie = (revenueByPlan = []) => {
    // revenueByPlan expected items: { _sum: { amount }, _count: X, plan: 'PRO' }
    // We'll use _count for distribution; fall back to _sum if _count missing
    const mapped = revenueByPlan.map((item) => {
        const name = item.plan || 'Unknown';
        const value = (item._count ?? item._sum?.amount ?? 0);
        return { name, value };
    });
    return mapped;
};

const PlanDistribution = () => {
    const [pieData, setPieData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        axios.get('/api/v1/admin/revenue')
            .then((res) => {
                if (!mounted) return;
                const data = res.data?.data ?? {};
                const revenueByPlan = data.revenueByPlan ?? [];
                const mapped = mapApiToPie(revenueByPlan);
                const totalCount = mapped.reduce((s, it) => s + Number(it.value || 0), 0);
                setPieData(mapped);
                setTotal(totalCount);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err?.response?.data?.message || err.message || 'Failed to load distribution');
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, []);

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            <div className="flex  items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Plan Distribution</h2>
            </div>

            {loading ? (
                <div className="py-8 text-center">Loading…</div>
            ) : error ? (
                <div className="py-8 text-center text-red-600">{error}</div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div style={{ width: 160, height: 160 }}>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    startAngle={90}
                                    endAngle={450}
                                    dataKey="value"
                                    paddingAngle={6}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="-mt-28 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-lg font-bold dark:text-white">{total}</div>
                                <div className="text-sm text-gray-500 dark:text-white/90">Total Users</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="space-y-3 text-sm">
                            {pieData.map((entry, idx) => {
                                const percent = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                                return (
                                    <div key={entry.name} className="flex items-center justify-between w-full gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                                            <span className="text-gray-600 dark:text-white">{entry.name}</span>
                                        </div>
                                        <span className="ml-auto font-semibold dark:text-white">{percent}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanDistribution;
