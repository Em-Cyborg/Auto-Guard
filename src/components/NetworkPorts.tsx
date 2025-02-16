/**
 * 이 컴포넌트는 네트워크 포트의 연결 상태와 속도를 시각적으로 표시
 * 
 * 주요 기능:
 * - 네트워크 포트 정보를 배열로 정의하고 이를 기반으로 UI를 구성
 * - Card 컴포넌트를 사용하여 전체 레이아웃을 구성
 * - CardHeader와 CardTitle 컴포넌트를 사용하여 헤더 영역을 구성하고, 네트워크 아이콘과 제목을 표시
 * - CardContent 컴포넌트를 사용하여 내용 영역을 구성하고, 그리드 레이아웃으로 포트 정보를 표시
 * - 각 포트 정보는 개별 카드로 표시되며, 포트 이름, 상태, 속도를 포함
 * - Badge 컴포넌트를 사용하여 포트 상태를 시각적으로 표시하며, 상태에 따라 색상이 변경
 * 
 * 사용된 주요 라이브러리:
 * - React: 리액트 라이브러리를 사용하여 컴포넌트를 구성
 * - lucide-react: 네트워크 아이콘을 표시하기 위해 사용
 * - Card, CardContent, CardHeader, CardTitle, Badge: UI 구성 요소로 사용
 */
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card" // Card 컴포넌트 관련 import
import { Badge } from "./ui/badge" // Badge 컴포넌트 import
import { Network } from "lucide-react" // Network 아이콘 import

const NetworkPorts: React.FC = () => {
  // 네트워크 포트 정보 배열
  const ports = [
    { id: 0, name: "Eth 0", status: "연결됨", speed: "1 Gbps" },
    { id: 1, name: "Eth 1", status: "연결됨", speed: "10 Gbps" },
    { id: 2, name: "Eth 2", status: "연결 안됨", speed: "-" },
    { id: 3, name: "Eth 3", status: "연결됨", speed: "100 Mbps" },
  ]

  return (
    <Card className="shadow-lg overflow-hidden"> {/* Card 컴포넌트로 전체 레이아웃 구성 */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700"> {/* CardHeader 컴포넌트로 헤더 영역 구성 */}
        <CardTitle className="text-lg text-white flex items-center"> {/* CardTitle 컴포넌트로 제목과 아이콘 표시 */}
          <Network className="mr-2" /> 네트워크 포트 연결 현황
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white"> {/* CardContent 컴포넌트로 내용 영역 구성 */}
        <div className="grid grid-cols-1 gap-4"> {/* 포트 정보를 그리드 레이아웃으로 표시 */}
          {ports.map((port) => (
            <div key={port.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow"> {/* 각 포트 정보를 개별 카드로 표시 */}
              <span className="font-medium text-gray-700">{port.name}</span> {/* 포트 이름 표시 */}
              <div className="flex items-center space-x-2"> {/* 포트 상태와 속도 표시 */}
                <Badge variant={port.status === "연결됨" ? "default" : "destructive"}>{port.status}</Badge> {/* 상태에 따라 Badge 색상 변경 */}
                <span className="text-sm text-gray-500">{port.speed}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default NetworkPorts
