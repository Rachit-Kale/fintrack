import { DollarSign, ArrowUpRight, ShoppingBag } from 'lucide-react';

export const SummaryCards = ({ transactions = [], microDrain = {} }) => {
    const totalSpent = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalCount = transactions.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Total Spent */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tracked Spend</span>
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-white">₹{totalSpent.toFixed(2)}</div>
                <p className="text-xs text-slate-400 mt-2">Sum of 20 most recent logged transactions</p>
            </div>

            {/* Micro-Drain Spend */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">30-Day Micro-Drain (≤ ₹100)</span>
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-white">
                    ₹{(microDrain.totalMicroDrainAmount || 0).toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Across {microDrain.totalMicroTransactions || 0} small daily purchases
                </p>
            </div>

            {/* Total Logged count */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Transactions</span>
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-white">{totalCount}</div>
                <p className="text-xs text-slate-400 mt-2">Parsed automatically from SMS stream</p>
            </div>

        </div>
    );
};