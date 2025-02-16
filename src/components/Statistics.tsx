/**
 * @component
 * Statistics 컴포넌트는 두 가지 주요 데이터를 시각화
 * 1. attackData: 정상 패킷, 악성 패킷, 새로운 패턴으로 분류된 패킷 데이터
 * 2. trafficData: 국가별 트래픽 빈도 데이터
 * 
 * 이 컴포넌트는 useState와 useEffect 훅을 사용하여 상태를 관리하고, 일정 간격으로 데이터를 업데이트
 * 
 * PieChart와 같은 Recharts 라이브러리의 컴포넌트를 사용하여 데이터를 시각화하며, 각 데이터 항목에 대해 색상을 지정
 * 
 * 주요 기능:
 * - 일정 간격으로 attackData와 trafficData를 업데이트
 * - PieChart를 사용하여 데이터를 시각화
 * - Tooltip과 Legend를 사용하여 차트에 대한 추가 정보를 제공
 * 
 * @returns {React.FC} 통계 데이터를 시각화하는 React 함수형 컴포넌트
 */
"use client"

// React와 필요한 훅, 컴포넌트들을 임포트
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { BarChart2 } from "lucide-react"

// Statistics 컴포넌트 정의
const Statistics: React.FC = () => {
  // attackData와 trafficData 상태 정의 및 초기값 설정
  const [attackData, setAttackData] = useState([
    { name: "정상 패킷", value: 60 },
    { name: "악성 패킷", value: 30 },
    { name: "새로운 패턴", value: 10 },
  ])

  const [trafficData, setTrafficData] = useState([
    { name: "미국", value: 35 },
    { name: "중국", value: 25 },
    { name: "한국", value: 20 },
    { name: "기타", value: 20 },
  ])

  // useEffect를 사용해 일정 간격으로 데이터 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      // attackData 업데이트
      setAttackData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.max(0, item.value + (Math.random() - 0.5) * 5),
        })),
      )

      // trafficData 업데이트
      setTrafficData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.max(0, item.value + (Math.random() - 0.5) * 5),
        })),
      )
    }, 3000)

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(interval)
  }, [])

  // 차트에 사용할 색상 배열
  const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"]

  // 파이 차트를 렌더링하는 함수
  const renderPieChart = (data: any[], title: string) => {
    // 데이터의 전체 트래픽 계산
    const totalTraffic = data.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="flex flex-col h-full">
        {/* 차트 제목 */}
        <h3 className="text-sm font-medium mb-4 text-gray-700">{title}</h3>
        <div className="flex-1">
          {/* 반응형 컨테이너로 차트 크기 조절 */}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              {/* 파이 차트 설정 */}
              <Pie
                data={data} // 차트에 사용할 데이터
                cx="50%" // 차트의 중심 x 좌표
                cy="45%" // 차트의 중심 y 좌표
                labelLine={false} // 라벨 라인 표시 여부
                outerRadius={100} // 파이 차트의 외부 반지름
                fill="#8884d8" // 파이 차트의 기본 색상
                dataKey="value" // 데이터에서 값을 가져올 키
                animationBegin={0} // 애니메이션 시작 시간
                animationDuration={1500} // 애니메이션 지속 시간
              >
                {/* 데이터 항목별 색상 설정 */}
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* 툴팁 설정 */}
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`, "비율"]} // 툴팁에 표시할 값 포맷
                contentStyle={{
                  backgroundColor: "white", // 툴팁 배경색
                  border: "1px solid #ccc", // 툴팁 테두리
                  borderRadius: "4px", // 툴팁 모서리 둥글기
                  fontSize: "12px", // 툴팁 폰트 크기
                }}
              />
              {/* 범례 설정 */}
              <Legend
                layout="horizontal" // 범례 레이아웃
                align="center" // 범례 정렬
                verticalAlign="bottom" // 범례 수직 정렬
                iconType="circle" // 범례 아이콘 모양
                iconSize={8} // 범례 아이콘 크기
                wrapperStyle={{
                  fontSize: "12px", // 범례 폰트 크기
                  paddingTop: "20px", // 범례 상단 여백
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 전체 트래픽 표시 */}
        <div className="text-center mt-2 text-sm text-gray-600">전체 트래픽: {totalTraffic.toFixed(2)}</div>
      </div>
    )
  }

  // 컴포넌트 렌더링
  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700">
        <CardTitle className="text-lg text-white flex items-center">
          <BarChart2 className="mr-2" /> 통계
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {renderPieChart(attackData, "유형별 트래픽 빈도")}
          {renderPieChart(trafficData, "국가별 트래픽 빈도")}
        </div>
      </CardContent>
    </Card>
  )
}

export default Statistics
