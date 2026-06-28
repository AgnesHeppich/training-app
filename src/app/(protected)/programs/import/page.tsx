'use client';

import { useState, useRef, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ImportProgramPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (f: File) => {
        if (f.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            return;
        }
        setError(null);
        setFile(f);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    };

    const handleImport = async () => {
        if (!file) return;
        setError(null);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('pdf', file);
            const res = await fetch('/api/programs/import-pdf', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                let message = 'Failed to import program';
                try {
                    const data = await res.json();
                    message = data.error ?? message;
                } catch { /* non-JSON error body */ }
                throw new Error(message);
            }
            router.push('/');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-black uppercase tracking-[0.2em] transition-colors mb-8"
                >
                    ← Back
                </Link>
                <h1 className="text-4xl font-black tracking-tight text-gray-900">Import from PDF</h1>
                <p className="text-gray-500 text-sm mt-2">Upload any training program PDF and we'll parse it for you.</p>
            </motion.div>

            <div className="space-y-7">
                {/* Drop zone */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                        Training program PDF
                    </label>
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !loading && fileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 transition-all cursor-pointer ${
                            dragging
                                ? 'border-green-500 bg-green-50'
                                : file
                                    ? 'border-green-400 bg-green-50/60'
                                    : 'border-gray-200 bg-white hover:border-green-400 hover:bg-gray-50'
                        } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        {file ? (
                            <>
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-600">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="9 15 12 18 15 15" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="12" x2="12" y2="18" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(0)} KB — click to change</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-700">Drop your PDF here</p>
                                    <p className="text-xs text-gray-400 mt-0.5">or click to browse</p>
                                </div>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            className="sr-only"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                        />
                    </div>
                </motion.div>

                {/* Info callout */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4"
                >
                    <p className="text-xs text-gray-500">
                        Any training plan format works — we'll use AI to interpret the exercises, sets, reps, and schedule. The imported program will become your active program and supports logging, history, and AI coaching.
                    </p>
                </motion.div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600 font-medium"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Import button */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <button
                        onClick={handleImport}
                        disabled={loading || !file}
                        className="w-full py-4 rounded-2xl bg-green-600 text-white text-sm font-black uppercase tracking-widest hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Parsing your program…
                            </span>
                        ) : (
                            'Import Program'
                        )}
                    </button>
                    {loading && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            This usually takes 10–20 seconds. Hang tight!
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
