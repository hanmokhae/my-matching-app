"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ListChecks, MapPin, Briefcase } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RecommendationsPage() {
    const [seniors, setSeniors] = useState<any[]>([]);
    const [selectedSenior, setSelectedSenior] = useState("");
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        const fetchSeniors = async () => {
            const { data } = await supabase.from('seniors').select('*').order('created_at', { ascending: false });
            if (data) setSeniors(data);
        };
        fetchSeniors();
    }, []);

    useEffect(() => {
        if (!selectedSenior) {
            setMatches([]);
            return;
        }
        const fetchMatches = async () => {
            const { data } = await supabase.from('matches').select('score, jobs(*)').eq('senior_id', selectedSenior).order('score', { ascending: false });
            if (data) setMatches(data);
        };
        fetchMatches();
    }, [selectedSenior]);

    // 선택된 시니어의 이름을 찾습니다
    const seniorInfo = seniors.find(s => s.id === selectedSenior);
    const titleText = seniorInfo ? `${seniorInfo.name} 님께 맞는 일자리` : "맞춤 일자리 추천";

    // 점수에 따른 라벨 생성 함수
    const getScoreLabel = (score: number) => {
        if (score === 6) return "매우 적합";
        if (score >= 4) return "적합";
        if (score >= 2) return "보통";
        return "매칭 낮음";
    };

    return (
        <div className="p-8 max-w-4xl mx-auto font-sans">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-green-700">
                <ListChecks size={32} /> {titleText}
            </h1>

            <select className="w-full p-5 border rounded-2xl mb-10 bg-white text-xl shadow-sm font-bold"
                onChange={e => setSelectedSenior(e.target.value)}>
                <option value="">👤 대상 시니어를 선택하세요</option>
                {seniors.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.name} (희망지역: {s.region} | 희망직종: {s.desired_job} | 경력: {s.career_years}년)
                    </option>
                ))}
            </select>

            <div className="space-y-6">
                {matches.length === 0 && selectedSenior && (
                    <div className="p-8 text-center bg-gray-100 rounded-2xl text-xl text-gray-600">
                        현재 딱 맞는 일자리가 없습니다. 담당자가 직접 연락드리니 잠시만 기다려 주세요.
                    </div>
                )}

                {matches.map((m, i) => (
                    <div key={i} className="p-8 bg-white border-2 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-800">{m.jobs.title}</h2>
                            <div className="flex flex-wrap gap-4 text-gray-600 text-lg">
                                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg"><MapPin size={20} /> 지역: {m.jobs.region}</span>
                                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg"><Briefcase size={20} /> 직종: {m.jobs.job_type}</span>
                                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg">요구경력: {m.jobs.required_career}년</span>
                            </div>
                        </div>

                        <div className={`px-5 py-3 rounded-xl font-bold border-2 text-lg text-center min-w-[140px] ${m.score === 6 ? 'bg-yellow-100 text-yellow-800 border-yellow-400' :
                                m.score >= 4 ? 'bg-green-100 text-green-800 border-green-400' :
                                    'bg-gray-100 text-gray-800 border-gray-300'
                            }`}>
                            <div className="text-2xl">{m.score}점</div>
                            <div className="text-sm mt-1">{getScoreLabel(m.score)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}