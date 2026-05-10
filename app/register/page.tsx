"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserPlus, CheckCircle2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const normalizeRegion = (region: string) => {
    if (!region) return "";
    return region.replace('특별시', '').replace('광역시', '').replace('도', '');
};

const normalizeJobType = (jobType: string) => {
    if (!jobType) return "";
    return jobType.replace('직', '');
};

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
                senior_id: senior.id,
                job_id: job.id,
                score: (normalizeRegion(form.region) === normalizeRegion(job.region) ? 3 : 0) +
                    (normalizeJobType(form.desired_job) === normalizeJobType(job.job_type) ? 2 : 0) +
                    (form.career_years >= job.required_career ? 1 : 0)
            }));
            await supabase.from('matches').insert(matches);
        }
        setStatus('success');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center font-sans">
            <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-600">
                    <UserPlus size={32} /> 시니어 일자리 신청하기
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 text-lg">
                    <div>
                        <label className="block font-bold text-gray-700 mb-2">어르신 성함이 어떻게 되시나요?</label>
                        <input className="w-full p-4 border rounded-xl" placeholder="예) 홍길동"
                            onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-2">어디에서 일하고 싶으세요?</label>
                        <select className="w-full p-4 border rounded-xl bg-white"
                            onChange={e => setForm({ ...form, region: e.target.value })}>
                            <option value="">지역을 선택해주세요</option>
                            <option value="서울">서울</option>
                            <option value="경기">경기</option>
                            <option value="인천">인천</option>
                            <option value="서울특별시">서울특별시</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-2">어떤 일을 하고 싶으세요?</label>
                        <select className="w-full p-4 border rounded-xl bg-white"
                            onChange={e => setForm({ ...form, desired_job: e.target.value })}>
                            <option value="">원하시는 직종을 선택해주세요</option>
                            <option value="경비">경비</option>
                            <option value="청소">청소</option>
                            <option value="조리">조리</option>
                            <option value="돌봄">돌봄</option>
                            <option value="경비직">경비직</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-2">관련 일을 몇 년 해보셨나요?</label>
                        <input type="number" className="w-full p-4 border rounded-xl" placeholder="예) 5"
                            onChange={e => setForm({ ...form, career_years: parseInt(e.target.value) || 0 })} />
                    </div>

                    <button className="w-full py-5 mt-4 bg-blue-600 text-white text-xl rounded-xl font-bold shadow-md hover:bg-blue-700 transition">
                        등록하기 (일자리 자동 찾기)
                    </button>
                </form>

                {status === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-green-700 font-bold text-lg flex items-center justify-center gap-2">
                            <CheckCircle2 size={24} /> 등록이 완료되었습니다. 담당자가 곧 연락드립니다!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}