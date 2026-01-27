'use client';

import { useState } from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SyncButton() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const router = useRouter();

    const handleSync = async () => {
        setLoading(true);
        setStatus('idle');
        try {
            const res = await fetch('/api/sync', { method: 'POST' });
            if (!res.ok) throw new Error('Sync failed');

            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
            router.refresh(); // Refresh server components to show updated timestamps
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSync}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Syncing...' : 'Sync Data Now'}
            </button>

            {status === 'success' && (
                <span className="text-green-600 flex items-center gap-1 text-sm animate-in fade-in slide-in-from-left-2">
                    <Check className="w-4 h-4" /> Done
                </span>
            )}

            {status === 'error' && (
                <span className="text-red-500 flex items-center gap-1 text-sm animate-in fade-in slide-in-from-left-2">
                    <AlertCircle className="w-4 h-4" /> Failed
                </span>
            )}
        </div>
    );
}
