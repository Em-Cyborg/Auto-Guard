/**
 * 
 * 주요 컴포넌트:
 * - `SemiCircleGauge`: 반원형 게이지를 렌더링하여 리소스 값을 시각화
 * - `ResourceMonitoring`: 리소스 모니터링 대시보드를 렌더링하며, 여러 리소스 항목들을 표시
 * 
 * `SemiCircleGauge` 컴포넌트는 다음과 같은 props를 받습니다:
 * - `value`: 현재 값 (number)
 * - `maxValue`: 최대 값 (number)
 * - `color`: 게이지 색상 (string)
 * - `unit`: 단위 (string)
 * 
 * `ResourceMonitoring` 컴포넌트는 내부 상태로 리소스 목록을 관리하며, 2초마다 리소스 값을 업데이트
 * 각 리소스 항목은 이름, 현재 값, 최대 값, 단위, 아이콘, 색상 등의 속성을 가짐짐
 * 
 * `useEffect` 훅을 사용하여 컴포넌트가 마운트될 때 2초 간격으로 리소스 값을 업데이트하는 인터벌을 설정하고,
 * 컴포넌트가 언마운트될 때 인터벌을 클리어
 * 
 * `Card`, `CardHeader`, `CardTitle`, `CardContent` 컴포넌트를 사용하여 대시보드의 레이아웃과 스타일을 구성
 * 
 * 리소스 항목들은 그리드 레이아웃으로 배치되며, 각 항목은 반원형 게이지를 통해 시각화됨
 */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"
import { Cpu, Thermometer, MemoryStick, Fan, Activity, Gauge } from "lucide-react"

// SemiCircleGauge 컴포넌트는 반원형 게이지를 렌더링함
const SemiCircleGauge = ({
  value, // 현재 값
  maxValue, // 최대 값
  color, // 게이지 색상
  unit, // 단위
}: {
  value: number
  maxValue: number
  color: string
  unit: string
}) => {
  const percentage = (value / maxValue) * 100 // 현재 값의 백분율 계산
  const data = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ]

  // 게이지 중앙에 표시될 라벨 렌더링 함수
  const renderLabel = ({ viewBox }: any) => {
    const { cx = 0, cy = 0 } = viewBox // 중심 좌표 설정
    const radius = Math.min(cx, cy) // 반지름 계산
    const fontSize = Math.max(radius * 0.2, 8) // 폰트 크기 계산 (최소 8px)
    const smallFontSize = Math.max(fontSize * 0.5, 6) // 작은 폰트 크기 계산 (최소 6px)

    const valueOffset = radius * -0.05 // 값의 위치 조정
    const unitOffset = radius * 0.12 // 단위의 위치 조정

    return (
      <g>
        <text
          x={cx}
          y={cy + valueOffset}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: `${fontSize}px` }} // 값의 폰트 크기 설정
          className="fill-gray-900 font-bold" // 값의 스타일 설정
        >
          {value}
        </text>
        <text
          x={cx}
          y={cy + unitOffset}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: `${smallFontSize}px` }} // 단위의 폰트 크기 설정
          className="fill-gray-500" // 단위의 스타일 설정
        >
          {unit}
        </text>
      </g>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data} // 게이지 데이터 설정
            cx="50%" // 원형 차트의 중심 x 좌표
            cy="85%" // 원형 차트의 중심 y 좌표
            startAngle={180} // 시작 각도 (반원형이므로 180도)
            endAngle={0} // 끝 각도 (반원형이므로 0도)
            innerRadius="65%" // 내부 반지름
            outerRadius="85%" // 외부 반지름
            paddingAngle={0} // 각 데이터 간의 간격
            dataKey="value" // 데이터 키 설정
          >
            <Cell fill={color} /> // 첫 번째 데이터의 색상 설정
            <Cell fill={`${color}33`} /> // 두 번째 데이터의 색상 설정 (투명도 추가)
            <Label content={renderLabel} position="center" /> // 중앙 라벨 설정
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ResourceMonitoring 컴포넌트는 리소스 모니터링 대시보드를 렌더링함
const ResourceMonitoring: React.FC = () => {
  const [resources, setResources] = useState([
    {
      name: "CPU 점유율",
      value: 45,
      maxValue: 100,
      unit: "%",
      icon: Cpu,
      color: "#3B82F6",
    },
    {
      name: "CPU 온도",
      value: 55,
      maxValue: 100,
      unit: "°C",
      icon: Thermometer,
      color: "#EF4444",
    },
    {
      name: "쿨러 팬 상태",
      value: 3500,
      maxValue: 3500,
      unit: "RPM",
      icon: Fan,
      color: "#10B981",
    },
    {
      name: "메모리 점유율",
      value: 60,
      maxValue: 100,
      unit: "%",
      icon: MemoryStick,
      color: "#8B5CF6",
    },
    {
      name: "메모리 온도",
      value: 40,
      maxValue: 100,
      unit: "°C",
      icon: Thermometer,
      color: "#F59E0B",
    },
    {
      name: "대역폭",
      value: 75,
      maxValue: 100,
      unit: "Mbps",
      icon: Activity,
      color: "#6366F1",
    },
  ])

  // useEffect 훅을 사용하여 2초마다 리소스 값을 업데이트함
  useEffect(() => {
    // 2초마다 실행되는 인터벌 설정
    const interval = setInterval(() => {
      // 이전 리소스 상태를 기반으로 새로운 리소스 상태를 설정
      setResources((prevResources) =>
        prevResources.map((resource) => ({
          ...resource, // 기존 리소스 속성 유지
          // 값 업데이트 (최대값과 최소값 사이에서 랜덤하게 변경)
          value: Math.min(
            resource.maxValue,
            Math.max(0, resource.value + (Math.random() - 0.5) * 10)
          ),
        }))
      )
    }, 2000) // 2초 간격

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(interval)
  }, []) // 빈 배열을 의존성으로 설정하여 컴포넌트 마운트 시 한 번만 실행

  return (
    <Card className="shadow-lg overflow-hidden h-full"> {/* 카드 컴포넌트를 사용하여 리소스 모니터링 대시보드를 렌더링 */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700"> {/* 카드 헤더 설정 */}
        <CardTitle className="text-lg text-white flex items-center"> {/* 카드 타이틀 설정 */}
          <Gauge className="mr-2" /> 리소스 모니터링
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 bg-white"> {/* 카드 콘텐츠 설정 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> {/* 그리드 레이아웃을 사용하여 리소스 항목들을 배치 */}
          {resources.map((resource, index) => (
            <div
              key={index} // 각 항목에 고유 키 설정
              className="bg-gray-50 rounded-lg shadow flex flex-col h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px]"
            >
              <div className="px-3 pt-2"> {/* 리소스 이름과 아이콘을 표시 */}
                <span className="text-xs font-medium flex items-center text-gray-600">
                  <resource.icon className="mr-1.5 h-3.5 w-3.5" />
                  {resource.name}
                </span>
              </div>
              <div className="flex-1 flex items-center"> {/* 반원형 게이지를 사용하여 리소스 값을 시각화 */}
                <SemiCircleGauge
                  value={Math.round(resource.value)} // 현재 리소스 값 (반올림)
                  maxValue={resource.maxValue} // 최대 리소스 값
                  color={resource.color} // 게이지 색상
                  unit={resource.unit} // 단위
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceMonitoring
