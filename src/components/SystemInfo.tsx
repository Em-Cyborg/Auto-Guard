/**
 * 시스템 정보를 표시하는 컴포넌트
 * 
 * 이 컴포넌트는 시스템의 모델명, 펌웨어 버전, 마지막 업그레이드 날짜, 마지막 백업 날짜 등의 정보를 카드 레이아웃으로 표시
 * 
 * - `systemInfo` 객체를 통해 시스템 정보를 정의
 * - `Card`, `CardHeader`, `CardTitle`, `CardContent` 컴포넌트를 사용하여 레이아웃을 구성
 * - `lucide-react` 라이브러리의 아이콘을 사용하여 각 정보 항목에 아이콘을 추가
 * - Tailwind CSS 클래스를 사용하여 스타일을 적용
 */
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Server, Cpu, Calendar, Database } from "lucide-react"

// 시스템 정보를 표시하는 컴포넌트
const SystemInfo: React.FC = () => {
  // 시스템 정보 객체
  const systemInfo = {
    modelName: "AutoGuard X1", // 모델명
    firmwareVersion: "v2.3.1", // 펌웨어 버전
    lastUpgrade: "2025-01-15", // 마지막 업그레이드 날짜
    lastBackup: "2025-01-24", // 마지막 백업 날짜
  }

  return (
    <Card className="shadow-lg overflow-hidden h-full"> {/* 카드 컴포넌트로 전체 레이아웃을 구성 */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700"> {/* 카드 헤더 부분 */}
        <CardTitle className="text-lg text-white flex items-center"> {/* 카드 타이틀 부분 */}
          <Server className="mr-2" /> 시스템 정보 {/* 서버 아이콘 */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white"> {/* 카드 내용 부분 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* 그리드 레이아웃으로 정보 배치 */}
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg"> {/* 모델명 정보 */}
              <Cpu className="h-8 w-8 text-blue-600 mr-4" /> {/* CPU 아이콘 */}
              <div>
                <dt className="text-sm font-medium text-gray-500">모델명</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{systemInfo.modelName}</dd>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg"> {/* 마지막 업그레이드 정보 */}
              <Calendar className="h-8 w-8 text-blue-600 mr-4" /> {/* 캘린더 아이콘 */}
              <div>
                <dt className="text-sm font-medium text-gray-500">마지막 업그레이드</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{systemInfo.lastUpgrade}</dd>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg"> {/* 펌웨어 버전 정보 */}
              <Server className="h-8 w-8 text-blue-600 mr-4" /> {/* 서버 아이콘 */}
              <div>
                <dt className="text-sm font-medium text-gray-500">펌웨어 버전</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{systemInfo.firmwareVersion}</dd>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg"> {/* 마지막 백업 정보 */}
              <Database className="h-8 w-8 text-blue-600 mr-4" /> {/* 데이터베이스 아이콘 */}
              <div>
                <dt className="text-sm font-medium text-gray-500">마지막 백업</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{systemInfo.lastBackup}</dd>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemInfo
