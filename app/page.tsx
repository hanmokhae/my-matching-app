import Link from 'next/link';
import { UserPlus, LayoutDashboard, ListChecks } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          시니어 일자리 매칭 시스템
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          원하시는 시스템 메뉴를 선택해 주세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/register" className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-4 group">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <UserPlus size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">시니어 등록</h2>
          </Link>
          <Link href="/admin" className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all flex flex-col items-center gap-4 group">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">담당자 대시보드</h2>
          </Link>
          <Link href="/recommendations" className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all flex flex-col items-center gap-4 group">
            <div className="p-4 bg-green-50 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ListChecks size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">매칭 결과 보기</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}