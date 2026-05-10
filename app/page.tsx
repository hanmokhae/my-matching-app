"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserPlus, CheckCircle2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 🌟 인공지능이 추가한 정규화(Normalization) 헬퍼 함수
const normalizeRegion = (region: string) => {
  if (!region) return "";
  // "서울특별시" -> "서울", "경기도" -> "경기", "인천광역시" -> "인천"
  return region.replace('특별시', '').replace('광역시', '').replace('도', '');
};

const normalizeJobType = (jobType: string) => {
  if (!jobType) return "";
  // "경비직" -> "경비", "청소직" -> "청소"
  return jobType.replace('직', '');
};

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', region: '', desired_job: '', career_years: 0 });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. 원본 데이터는 그대로 DB에 저장합니다.
    const { data: senior, error } = await supabase.from('seniors').insert([form]).select().single();
    if (error) return setStatus('error');

    const { data: jobs } = await supabase.from('jobs').select('*');
    if (jobs) {
      // 2. 점수를 계산할 때만 정규화 함수(normalize)를 거쳐서 똑똑하게 비교합니다.
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
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <UserPlus /> 시니어 등록
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-3 border rounded-lg" placeholder="이름"
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <select className="w-full p-3 border rounded-lg bg-white"
            onChange={e => setForm({ ...form, region: e.target.value })}>
            <option value="">지역 선택</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="서울특별시">서울특별시</option>
          </select>
          <select className="w-full p-3 border rounded-lg bg-white"
            onChange={e => setForm({ ...form, desired_job: e.target.value })}>
            <option value="">직종 선택</option>
            <option value="경비">경비</option>
            <option value="청소">청소</option>
            <option value="조리">조리</option>
            <option value="경비직">경비직</option>
          </select>
          <input type="number" className="w-full p-3 border rounded-lg" placeholder="경력(년)"
            onChange={e => setForm({ ...form, career_years: parseInt(e.target.value) || 0 })} />
          <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold">등록 및 자동 매칭</button>
        </form>
        {status === 'success' && (
          <p className="mt-4 text-green-600 flex items-center gap-2">
            <CheckCircle2 size={18} /> 등록 및 매칭 완료!
          </p>
        )}
      </div>
    </div>
  );
}