"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Briefcase, Trash2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPage() {
    const [form, setForm] = useState({ title: '', region: '', job_type: '', required_career: 0 });
    const [jobs, setJobs] = useState<any[]>([]);

    const fetchJobs = async () => {
        const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (data) setJobs(data);
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: job } = await supabase.from('jobs').insert([form]).select().single();
        if (job) {
            const { data: seniors } = await supabase.from('seniors').select('*');
            if (seniors) {
                const matches = seniors.map(s => ({
                    senior_id: s.id, job_id: job.id,
                    score: (s.region === form.region ? 3 : 0) + (s.desired_job === form.job_type ? 2 : 0) + (s.career_years >= form.required_career ? 1 : 0)
                }));
                await supabase.from('matches').insert(matches);
            }
            fetchJobs();
            setForm({ title: '', region: '', job_type: '', required_career: 0 });
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-purple-700"><LayoutDashboard /> 담당자 대시보드</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4 h-fit">
                    <h2 className="font-bold text-lg mb-2">새 일자리 등록</h2>
                    <input className="w-full p-2 border rounded" placeholder="공고명" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <select className="w-full p-2 border rounded bg-white" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                        <option>지역 선택</option><option>서울</option><option>경기</option><option>인천</option>
                    </select>
                    <select className="w-full p-2 border rounded bg-white" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
                        <option>직종 선택</option><option>경비</option><option>청소</option><option>조리</option>
                    </select>
                    <input type="number" className="w-full p-2 border rounded" placeholder="요구경력" value={form.required_career} onChange={e => setForm({ ...form, required_career: parseInt(e.target.value) })} />
                    <button className="w-full py-2 bg-purple-600 text-white rounded font-bold">일자리 추가</button>
                </form>
                <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="font-bold text-lg mb-4">등록된 일자리 목록</h2>
                    <div className="space-y-3">
                        {jobs.map(j => (
                            <div key={j.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                                <div><p className="font-bold">{j.title}</p><p className="text-sm text-gray-500">{j.region} | {j.job_type} | {j.required_career}년 이상</p></div>
                                <button onClick={async () => { await supabase.from('jobs').delete().eq('id', j.id); fetchJobs(); }} className="text-red-400"><Trash2 /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
