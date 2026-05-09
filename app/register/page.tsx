"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', region: '', desired_job: '', career_years: 0 });
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: senior, error } = await supabase.from('seniors').insert([form]).select().single();
        if (error) return setStatus('error');

        const { data: jobs } = await supabase.from('jobs').select('*');
        if (jobs) {
            const matches = jobs.map(job => ({
                senior_id: senior.id, job_id: job.id,
                score: (form.region === job.region ? 3 : 0) + (form.desired_job === job.job_type ? 2 : 0) + (form.career_years >= job.required_career ? 1 : 0)
            }));
            await supabase.from('matches').insert(matches);
        }
        setStatus('success');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600"><UserPlus /> 시니어 등록</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full p-3 border rounded-lg" placeholder="이름" onChange={e => setForm({ ...form, name: e.target.value })} />
                    <select className="w-full p-3 border rounded-lg bg-white" onChange={e => setForm({ ...form, region: e.target.value })}>
                        <option>지역 선택</option><option>서울</option><option>경기</option><option>인천</option>
                    </select>
                    <select className="w-full p-3 border rounded-lg bg-white" onChange={e => setForm({ ...form, desired_job: e.target.value })}>
                        <option>직종 선택</option><option>경비</option><option>청소</option><option>조리</option>
                    </select>
                    <input type="number" className="w-full p-3 border rounded-lg" placeholder="경력(년)" onChange={e => setForm({ ...form, career_years: parseInt(e.target.value) })} />
                    <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold">등록 및 자동 매칭</button>
                </form>
                {status === 'success' && <p className="mt-4 text-green-600 flex items-center gap-2"><CheckCircle2 size={18} /> 등록 및 매칭 완료!</p>}
            </div>
        </div>
    );
}
