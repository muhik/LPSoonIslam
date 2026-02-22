'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = '/admin'; // Force full reload to apply layout nicely
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
                <h1 className="text-2xl font-bold text-center text-premium-600 mb-8">Admin Login</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Admin Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:border-premium-500 outline-none transition-shadow"
                            placeholder="Enter password..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-premium-600 hover:bg-premium-700 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
