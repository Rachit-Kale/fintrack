import { Zap, AlertCircle } from 'lucide-react';

export const MicroDrainWidget = ({ microDrain = {} }) => {
    const breakdown = microDrain.breakdownByCategory || [];

    return (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-bold text-white">Micro-Drain Category Breakdown</h2>
                </div>
                <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    Purchases ≤ ₹100
                </span>
            </div>

            {breakdown.length === 0 ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm italic py-4">
                    <AlertCircle className="w-4 h-4" />
                    <span>No micro-drain transactions logged in the past 30 days.</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {breakdown.map((item) => (
                        <div key={item._id} className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3.5 text-center">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {item._id}
                            </span>
                            <span className="block text-lg font-extrabold text-amber-400">
                                ₹{item.totalSpent}
                            </span>
                            <span className="block text-[11px] text-slate-500 mt-0.5">
                                {item.count} {item.count === 1 ? 'tx' : 'txs'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};