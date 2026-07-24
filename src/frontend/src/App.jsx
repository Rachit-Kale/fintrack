import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TokenModal } from './components/TokenModal';
import { SummaryCards } from './components/SummaryCards';
import { MicroDrainWidget } from './components/MicroDrainWidget';
import { TransactionTable } from './components/TransactionTable';
import { getTransactions, getMicroDrainStats } from './api/client';
import { AlertCircle } from 'lucide-react';

export default function App() {
    const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [microDrain, setMicroDrain] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('FINTRACK_PAIRING_TOKEN');
        if (!token) {
            setIsTokenModalOpen(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [txList, microStats] = await Promise.all([
                getTransactions(),
                getMicroDrainStats(),
            ]);
            setTransactions(txList);
            setMicroDrain(microStats);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.error || 'Failed to connect to backend server. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveToken = (newToken) => {
        localStorage.setItem('FINTRACK_PAIRING_TOKEN', newToken.trim());
        fetchData();
    };

    return (
        <div className="min-h-screen bg-slate-900 pb-16">
            <Navbar
                onOpenTokenModal={() => setIsTokenModalOpen(true)}
                onRefresh={fetchData}
                loading={loading}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <SummaryCards transactions={transactions} microDrain={microDrain} />
                <MicroDrainWidget microDrain={microDrain} />
                <TransactionTable transactions={transactions} />
            </main>

            <TokenModal
                isOpen={isTokenModalOpen}
                onClose={() => setIsTokenModalOpen(false)}
                onSaveToken={handleSaveToken}
            />
        </div>
    );
}