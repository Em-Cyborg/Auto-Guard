/**
 * 이 파일은 TrafficGraph 컴포넌트를 정의
 * TrafficGraph 컴포넌트는 인바운드와 아웃바운드 트래픽 데이터를 시각화하는 라인 차트를 렌더링
 * 
 * 주요 기능:
 * - Chart.js를 사용하여 트래픽 데이터를 시각화
 * - 인바운드와 아웃바운드 트래픽을 각각 다른 색상으로 표시
 * - 반응형 디자인을 지원하여 다양한 화면 크기에서 적절하게 표시
 * 
 * 사용된 주요 라이브러리:
 * - React: 컴포넌트 기반 UI 라이브러리
 * - Chart.js: 차트 생성 라이브러리
 * - chartjs-adapter-date-fns: Chart.js의 날짜 형식 어댑터
 * - lucide-react: 아이콘 라이브러리
 * 
 * 컴포넌트 구조:
 * - TrafficGraph: 메인 컴포넌트로, 트래픽 데이터를 받아 차트를 생성 및 업데이트
 * - TrafficCard: 각 트래픽 차트를 포함하는 카드 컴포넌트
 * 
 * 주요 함수:
 * - createOrUpdateChart: 차트를 생성하거나 업데이트하는 함수
 * 
 * 주요 훅:
 * - useEffect: 컴포넌트가 마운트되거나 trafficData가 변경될 때 차트를 생성 또는 업데이트하고, 언마운트될 때 차트를 파괴
 * - useMemo: createOrUpdateChart 함수를 메모이제이션하여 불필요한 재생성을 방지
 * 
 * props:
 * - trafficData: 인바운드와 아웃바운드 트래픽 데이터를 포함하는 배열
 */
"use client"

// 필요한 라이브러리와 컴포넌트들을 import
import { useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Chart, type ChartConfiguration, registerables } from "chart.js/auto"
import "chartjs-adapter-date-fns"
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import type React from "react"

// Chart.js의 플러그인들을 등록
Chart.register(...registerables)

// 컴포넌트의 props 타입 정의
interface TrafficGraphProps {
  trafficData: { inbound: number; outbound: number; time: Date }[]
}

// TrafficGraph 컴포넌트 정의
const TrafficGraph: React.FC<TrafficGraphProps> = ({ trafficData }) => {
  // 캔버스와 차트 인스턴스를 참조하기 위한 ref 생성
  const inboundChartRef = useRef<HTMLCanvasElement | null>(null)
  const outboundChartRef = useRef<HTMLCanvasElement | null>(null)
  const inboundChartInstance = useRef<Chart | null>(null)
  const outboundChartInstance = useRef<Chart | null>(null)

  // 차트를 생성하거나 업데이트하는 함수 정의
  const createOrUpdateChart = useMemo(
    () =>
      (
        canvasRef: React.RefObject<HTMLCanvasElement>, // 캔버스 엘리먼트를 참조하는 ref
        chartInstance: React.MutableRefObject<Chart | null>, // 차트 인스턴스를 참조하는 ref
        data: number[], // 차트에 표시할 데이터 배열
        color: string, // 차트의 색상
      ) => {
        if (canvasRef.current) { // 캔버스 엘리먼트가 존재하는지 확인
          const ctx = canvasRef.current.getContext("2d") // 2D 컨텍스트를 가져옴
          if (ctx) { // 컨텍스트가 유효한지 확인
            if (chartInstance.current) { // 차트 인스턴스가 이미 존재하는지 확인
              // 차트가 이미 존재하면 데이터를 업데이트
              chartInstance.current.data.labels = trafficData.map((d) => d?.time ?? new Date()) // 라벨을 업데이트
              chartInstance.current.data.datasets[0].data = data // 데이터셋을 업데이트
              chartInstance.current.update() // 차트를 업데이트
            } else {
              // 차트가 존재하지 않으면 새로 생성
              const chartConfig: ChartConfiguration = {
                type: "line", // 차트 타입을 라인 차트로 설정
                data: {
                  labels: trafficData.map((d) => d?.time ?? new Date()), // 라벨 설정
                  datasets: [
                    {
                      data: data, // 데이터 설정
                      borderColor: color, // 선 색상 설정
                      backgroundColor: `${color}33`, // 배경 색상 설정 (투명도 포함)
                      fill: true, // 영역 채우기 설정
                      tension: 0.4, // 곡선의 장력 설정
                      borderWidth: 2, // 선 두께 설정
                    },
                  ],
                },
                options: {
                  responsive: true, // 반응형 설정
                  maintainAspectRatio: false, // 종횡비 유지 설정
                  scales: {
                    y: {
                      beginAtZero: true, // Y축이 0부터 시작하도록 설정
                      max: 30, // Y축 최대값 설정
                      grid: {
                        color: "rgba(0, 0, 0, 0.1)", // 그리드 색상 설정
                      },
                      ticks: {
                        color: "#666", // 눈금 색상 설정
                        callback: (value) => `${value} Mbps`, // 눈금 라벨 포맷 설정
                      },
                      title: {
                        display: true, // Y축 제목 표시 설정
                        text: "트래픽 (Mbps)", // Y축 제목 텍스트 설정
                        color: "#666", // Y축 제목 색상 설정
                      },
                    },
                    x: {
                      type: "time", // X축 타입을 시간으로 설정
                      time: {
                        unit: "second", // 시간 단위를 초로 설정
                        displayFormats: {
                          second: "HH:mm:ss", // 시간 표시 형식 설정
                        },
                      },
                      grid: {
                        color: "rgba(0, 0, 0, 0.1)", // 그리드 색상 설정
                      },
                      ticks: {
                        source: "auto", // 눈금 소스를 자동으로 설정
                        maxRotation: 0, // 눈금 라벨 최대 회전 각도 설정
                        color: "#666", // 눈금 색상 설정
                      },
                      title: {
                        display: true, // X축 제목 표시 설정
                        text: "시간", // X축 제목 텍스트 설정
                        color: "#666", // X축 제목 색상 설정
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false, // 범례 표시 설정
                    },
                  },
                  animation: {
                    duration: 0, // 애니메이션 지속 시간 설정
                  },
                },
              }
              chartInstance.current = new Chart(ctx, chartConfig) // 새로운 차트 인스턴스 생성
            }
          }
        }
      },
    [trafficData], // trafficData가 변경될 때마다 함수가 재생성됨
  )

  // 컴포넌트가 마운트되거나 trafficData가 변경될 때 실행
  useEffect(() => {
    if (Array.isArray(trafficData) && trafficData.length > 0) {
      const validInboundData = trafficData.map((d) => (typeof d?.inbound === "number" ? d.inbound : 0)) // 유효한 인바운드 데이터를 추출
      const validOutboundData = trafficData.map((d) => (typeof d?.outbound === "number" ? d.outbound : 0)) // 유효한 아웃바운드 데이터를 추출

      createOrUpdateChart(inboundChartRef, inboundChartInstance, validInboundData, "#3B82F6") // 인바운드 차트를 생성하거나 업데이트
      createOrUpdateChart(outboundChartRef, outboundChartInstance, validOutboundData, "#EF4444") // 아웃바운드 차트를 생성하거나 업데이트
    }

    // 컴포넌트가 언마운트될 때 차트 인스턴스를 파괴
    return () => {
      if (inboundChartInstance.current) {
        inboundChartInstance.current.destroy() // 인바운드 차트 인스턴스를 파괴
        inboundChartInstance.current = null // 인바운드 차트 인스턴스를 null로 설정
      }
      if (outboundChartInstance.current) {
        outboundChartInstance.current.destroy() // 아웃바운드 차트 인스턴스를 파괴
        outboundChartInstance.current = null // 아웃바운드 차트 인스턴스를 null로 설정
      }
    }
  }, [trafficData, createOrUpdateChart]) // trafficData 또는 createOrUpdateChart가 변경될 때마다 useEffect 실행

  // TrafficCard 컴포넌트 정의
  const TrafficCard = ({
    title, // 카드의 제목
    icon: Icon, // 카드에 표시할 아이콘
    chartRef, // 차트를 참조하는 ref
  }: {
    title: string // 제목의 타입 정의
    icon: React.ElementType // 아이콘의 타입 정의
    chartRef: React.RefObject<HTMLCanvasElement> // 차트 ref의 타입 정의
  }) => (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700">
        <CardTitle className="text-lg text-white flex items-center">
          <Icon className="mr-2" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="h-[200px] w-full bg-gray-50 rounded-lg p-4">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  )

  // TrafficGraph 컴포넌트의 반환값
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TrafficCard title="인바운드 트래픽" icon={ArrowDownToLine} chartRef={inboundChartRef} />
      <TrafficCard title="아웃바운드 트래픽" icon={ArrowUpFromLine} chartRef={outboundChartRef} />
    </div>
  )
}

export default TrafficGraph
