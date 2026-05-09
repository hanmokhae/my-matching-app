"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ListChecks, MapPin, Briefcase } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RecommendationsPage() {
    const [seniors, setSeniors] = useState<any[]>([]);
    const [selectedSenior, setSelectedSenior] = useState('');
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        const fetchSeniors = async () => {
            const { data } = await supabase.from('seniors').select('*').order('created_at', { ascending: false });
            if (data) setSeniors(data);
        };
        fetchSeniors();
    }, []);

    useEffect(() => {
        if (!selectedSenior) return;
        const fetchMatches = async () => {
            const { data } = await supabase.from('matches').select('score, jobs(*)').eq('senior_id', selectedSenior).order('score', { ascending: false });
            if (data) setMatches(data);
        };
        fetchMatches();
    }, [selectedSenior]);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-green-700"><ListChecks /> 맞춤 일자리 추천</h1>
            <select className="w-full p-4 border rounded-xl mb-8 bg-white text-lg shadow-sm" onChange={e => setSelectedSenior(e.target.value)}>
                <option value="">대상 시니어를 선택하세요</option>
                {seniors.map(s => <option key={s.id} value={s.id}>{s.name} ({s.region} | {s.desired_job} | {s.career_years}년)</option>)}
            </select>
            <div className="space-y-4">
                {matches.map((m, i) => (
                    <div key={i} className="p-6 bg-white border rounded-2xl shadow-sm flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold mb-2">{m.jobs.title}</h2>
                            <div className="flex gap-4 text-gray-500 text-sm">
                                <span className="flex items-center gap-1"><MapPin size={16} />{m.jobs.region}</span>
                                <span className="flex items-center gap-1"><Briefcase size={16} />{m.jobs.job_type}</span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold border-2 ${m.score === 6 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                            {m.score}점 매칭
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
