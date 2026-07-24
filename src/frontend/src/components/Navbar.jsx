import { Wallet, Key, RefreshCw } from 'lucide-react';

export const Navbar = ({ onOpenTokenModal, onRefresh, loading }) => {
    return (
        <nav className="bg-slate-800/80 backdrop-blur border-b border-slate-700/80 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="font-extrabold text-xl tracking-tight text-white">FinTrack</span>
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Web
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition border border-slate-600/50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        <button
                            onClick={onOpenTokenModal}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-sm"
                        >
                            <Key className="w-4 h-4" />
                            <span>Device Pairing Token</span>
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};