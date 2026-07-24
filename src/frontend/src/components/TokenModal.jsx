import { useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';

export const TokenModal = ({ isOpen, onClose, onSaveToken }) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('FINTRACK_PAIRING_TOKEN');
        if (saved) setToken(saved);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSaveToken(token);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                        <Key className="w-5 h-5" />
                        <span>Pair Backend Token</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    Enter the <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">devicePairingToken</code> generated for your account to authorize the dashboard.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Pairing Token
                        </label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="ft_pair_9f8d7e..."
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                        >
                            <Check className="w-4 h-4" />
                            <span>Save & Connect</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};