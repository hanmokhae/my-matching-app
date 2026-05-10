"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Trash2, PlusCircle } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const normalizeRegion = (region: string) => {
    if (!region) return "";
    return region.replace('특별시', '').replace('광역시', '').replace('도', '');
};

const normalizeJobType = (jobType: string) => {
    if (!jobType) return "";
    return jobType.replace('직', '');
};

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
                    senior_id: s.id,
                    job_id: job.id,
                    score: (normalizeRegion(s.region) === normalizeRegion(form.region) ? 3 : 0) +
                        (normalizeJobType(s.desired_job) === normalizeJobType(form.job_type) ? 2 : 0) +
                        (s.career_years >= form.required_career ? 1 : 0)
                }));
                await supabase.from('matches').insert(matches);
            }
            fetchJobs();
            setForm({ title: '', region: '', job_type: '', required_career: 0 });
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans">
            <h1 className="text-3xl font-bold mb-10 flex items-center gap-3 text-purple-700">
                <LayoutDashboard size={36} /> 담당자 업무 대시보드
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 새 일자리 등록 폼 */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border-2 shadow-sm space-y-6 h-fit text-lg">
                    <h2 className="font-bold text-2xl mb-4 text-gray-800 border-b pb-4">새 일자리 등록</h2>

                    <div>
                        <label className="block text-gray-600 text-sm font-bold mb-1">공고명</label>
                        <input className="w-full p-4 border rounded-xl" placeholder="예) 아파트 경비원" value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-bold mb-1">근무 지역</label>
                        <select className="w-full p-4 border rounded-xl bg-white" value={form.region}
                            onChange={e => setForm({ ...form, region: e.target.value })}>
                            <option value="">지역 선택</option>
                            <option value="서울">서울</option>
                            <option value="경기">경기</option>
                            <option value="인천">인천</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-bold mb-1">모집 직종</label>
                        <select className="w-full p-4 border rounded-xl bg-white" value={form.job_type}
                            onChange={e => setForm({ ...form, job_type: e.target.value })}>
                            <option value="">직종 선택</option>
                            <option value="경비">경비</option>
                            <option value="청소">청소</option>
                            <option value="조리">조리</option>
                            <option value="돌봄">돌봄</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-bold mb-1">요구 경력 (년)</label>
                        <input type="number" className="w-full p-4 border rounded-xl" placeholder="예) 3"
                            value={form.required_career} onChange={e => setForm({ ...form, required_career: parseInt(e.target.value) || 0 })} />
                    </div>

                    <button className="w-full py-4 mt-2 bg-purple-600 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition">
                        <PlusCircle size={24} /> 일자리 추가
                    </button>
                </form>

                {/* 등록된 일자리 목록 */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border-2 shadow-sm">
                    <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-4">등록된 일자리 목록</h2>
                    <div className="space-y-4">
                        {jobs.length === 0 && (
                            <p className="text-gray-500 text-center py-8 text-lg">아직 등록된 일자리가 없습니다.</p>
                        )}
                        {jobs.map(j => (
                            <div key={j.id} className="p-6 border-2 rounded-xl flex justify-between items-center hover:bg-gray-50 transition">
                                <div>
                                    <p className="font-bold text-xl text-gray-800 mb-2">{j.title}</p>
                                    <div className="flex gap-3 text-base text-gray-600">
                                        <span className="bg-gray-100 px-3 py-1 rounded-md">{j.region}</span>
                                        <span className="bg-gray-100 px-3 py-1 rounded-md">{j.job_type}</span>
                                        <span className="bg-gray-100 px-3 py-1 rounded-md">경력 {j.required_career}년↑</span>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => { await supabase.from('jobs').delete().eq('id', j.id); fetchJobs(); }}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="삭제하기"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}