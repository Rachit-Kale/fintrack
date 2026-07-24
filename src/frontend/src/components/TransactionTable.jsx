import { Receipt, Calendar, Tag, Store } from 'lucide-react';

export const TransactionTable = ({ transactions = [] }) => {
    return (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                </div>
                <span className="text-xs text-slate-400">Showing last 20 records</span>
            </div>

            {transactions.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                    <p className="text-base">No transactions found.</p>
                    <p className="text-xs mt-1">Make sure your pairing token is correct and your mobile app has sent SMS logs.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/60 border-b border-slate-700/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="py-3.5 px-6"><Store className="w-3.5 h-3.5 inline mr-1" /> Merchant</th>
                                <th className="py-3.5 px-6"><Tag className="w-3.5 h-3.5 inline mr-1" /> Category</th>
                                <th className="py-3.5 px-6"><Calendar className="w-3.5 h-3.5 inline mr-1" /> Date & Time</th>
                                <th className="py-3.5 px-6 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60 text-sm">
                            {transactions.map((tx) => {
                                const formattedDate = new Date(tx.transactionTimestamp).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });

                                return (
                                    <tr key={tx._id} className="hover:bg-slate-700/30 transition">
                                        <td className="py-4 px-6 font-semibold text-white">
                                            {tx.merchantName}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-xs">
                                            {formattedDate}
                                        </td>
                                        <td className="py-4 px-6 text-right font-extrabold text-white">
                                            -₹{tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};