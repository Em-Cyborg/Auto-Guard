/**
 * 실시간 로그 데이터를 표시하는 React 컴포넌트
 * 주기적으로 새로운 로그 데이터를 생성하여 상태를 업데이트하고, 
 * 필터를 통해 로그를 유형별로 분류하여 표시
 * 
 * 주요 기능:
 * - 주기적으로 로그 데이터를 생성하여 상태 업데이트
 * - 필터를 통해 로그를 유형별로 분류하여 표시
 * - 로그 유형에 따른 색상과 아이콘 적용
 * - 테이블 스크롤을 맨 위로 설정
 * 
 * 사용된 주요 라이브러리:
 * - React: 상태 관리 및 컴포넌트 생명주기 관리
 * - lucide-react: 로그 유형에 따른 아이콘 표시
 * - Tailwind CSS: 스타일링
 * 
 * @component
 * @example
 * const trafficData = [
 *   { inbound: 100, outbound: 200, time: new Date() },
 *   // ...더 많은 트래픽 데이터
 * ];
 * 
 * <LogTable trafficData={trafficData} />
 * 
 * @param {Object[]} trafficData - 트래픽 데이터 배열
 * @param {number} trafficData[].inbound - 인바운드 트래픽 양
 * @param {number} trafficData[].outbound - 아웃바운드 트래픽 양
 * @param {Date} trafficData[].time - 트래픽 데이터의 시간
 * 
 * @returns {JSX.Element} 실시간 로그 테이블 컴포넌트
 */
"use client"

// 필요한 React 훅과 컴포넌트들을 import
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { generateLogData } from "../utils/dataGenerators"

// 로그 항목의 타입 정의
interface LogEntry {
  timestamp: Date
  sourceIP: string
  sourcePort: number
  destinationIP: string
  destinationPort: number
  protocol: string
  type: string
  trafficVolume: number
}

// 컴포넌트에 전달될 props 타입 정의
interface LogTableProps {
  trafficData: { inbound: number; outbound: number; time: Date }[]
}

// LogTable 컴포넌트 정의
const LogTable: React.FC<LogTableProps> = ({ trafficData }) => {
  // 로그 상태와 필터 상태 정의
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState("all")
  const tableRef = useRef<HTMLDivElement>(null)

  // 주기적으로 로그 데이터를 생성하여 상태 업데이트
  useEffect(() => {
    // 1초마다 실행되는 인터벌 설정
    const interval = setInterval(() => {
      setLogs((prevLogs) => {
        // trafficData의 마지막 항목을 기반으로 새로운 로그 데이터 생성
        const newLogs = generateLogData(trafficData.slice(-1), [])
        // 새로운 로그가 존재하면 기존 로그와 합쳐서 최대 100개까지 유지
        return Array.isArray(newLogs) && newLogs.length > 0
          ? [...newLogs, ...(prevLogs || [])].slice(0, 100)
          : prevLogs || []
      })
    }, 1000)

    // 컴포넌트가 언마운트될 때 인터벌 정리
    return () => clearInterval(interval)
  }, [trafficData])

  // 컴포넌트가 처음 렌더링될 때 테이블 스크롤을 맨 위로 설정
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0
    }
  }, [])

  // 필터링된 로그를 반환하는 함수
  const getFilteredLogs = () => {
    if (!Array.isArray(logs) || logs.length === 0) return []

    return logs.filter((log) => {
      if (!log || typeof log.type !== "string") return false
      if (filter === "all") return true
      if (filter === "normal") return log.type === "정상"
      if (filter === "malicious") return log.type.startsWith("악성")
      if (filter === "new") return log.type === "새로운 패턴"
      return false
    })
  }

  // 로그 유형에 따른 색상을 반환하는 함수
  const getTypeColor = (type: string) => {
    if (type === "정상") return "text-green-600"
    if (type === "악성") return "text-red-600"
    if (type === "새로운 패턴") return "text-yellow-600"
    return "text-gray-600"
  }

  // 로그 유형에 따른 아이콘을 반환하는 함수
  const getTypeIcon = (type: string) => {
    if (type === "정상") return <CheckCircle className="w-4 h-4" />
    if (type.startsWith("악성")) return <AlertTriangle className="w-4 h-4" />
    return null
  }

  // 필터링된 로그 데이터
  const filteredLogs = getFilteredLogs()

  return (
    // 카드 컴포넌트로 전체 로그 테이블을 감쌈
    <Card className="shadow-lg overflow-hidden">
      {/* 카드 헤더 부분 */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700">
        <CardTitle className="text-lg text-white flex items-center">
          {/* 제목 옆에 아이콘 추가 */}
          <FileText className="mr-2" /> 실시간 로그
        </CardTitle>
      </CardHeader>
      {/* 카드 내용 부분 */}
      <CardContent className="bg-white p-6">
        {/* 필터 선택 부분 */}
        <div className="flex justify-between items-center mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="필터 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 로그</SelectItem>
              <SelectItem value="normal">정상 로그</SelectItem>
              <SelectItem value="malicious">악성 로그</SelectItem>
              <SelectItem value="new">새로운 패턴</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* 로그 테이블 부분 */}
        <div ref={tableRef} className="overflow-auto h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시간</TableHead>
                <TableHead>출발 IP</TableHead>
                <TableHead>출발 Port</TableHead>
                <TableHead>도착 IP</TableHead>
                <TableHead>도착 Port</TableHead>
                <TableHead>프로토콜</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>트래픽 용량</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, index) => (
              <TableRow key={index} className="transition-all duration-300 ease-in-out">
                <>
                <TableCell>{log.timestamp instanceof Date ? log.timestamp.toLocaleTimeString() : "N/A"}</TableCell> {/* 로그의 타임스탬프를 시간 형식으로 표시 */}
                <TableCell>{log.sourceIP || "N/A"}</TableCell> {/* 로그의 출발 IP 주소를 표시 */}
                <TableCell>{typeof log.sourcePort === "number" ? log.sourcePort : "N/A"}</TableCell> {/* 로그의 출발 포트를 표시 */}
                <TableCell>{log.destinationIP || "N/A"}</TableCell> {/* 로그의 도착 IP 주소를 표시 */}
                <TableCell>{typeof log.destinationPort === "number" ? log.destinationPort : "N/A"}</TableCell> {/* 로그의 도착 포트를 표시 */}
                <TableCell>{log.protocol || "N/A"}</TableCell> {/* 로그의 프로토콜을 표시 */}
                <TableCell>
                <span className={`flex items-center ${getTypeColor(log.type || "")}`}>
                {getTypeIcon(log.type || "")}
                <span className="ml-1">{log.type.startsWith("악성") ? "악성" : log.type || "N/A"}</span>
                </span>
                </TableCell> {/* 로그 유형에 따른 색상과 아이콘 적용 */}
                <TableCell>{`${typeof log.trafficVolume === "number" ? log.trafficVolume : 0} KB`}</TableCell> {/* 로그의 트래픽 용량을 KB 단위로 표시 */}
                </>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default LogTable
