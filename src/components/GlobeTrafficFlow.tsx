/**
 * 지구본을 중심으로 트래픽 흐름을 시각화하는 React 컴포넌트를 정의
 * 
 * 주요 컴포넌트:
 * - Earth: 지구본을 렌더링하고, 주기적으로 회전시키며, 트래픽 흐름 데이터를 기반으로 선을 표시시
 * - GlobeTrafficFlow: 지구본과 트래픽 흐름을 포함하는 전체 카드 레이아웃을 렌더링
 * 
 * 주요 함수:
 * - getCoordinates: 국가 코드에 따른 위도와 경도를 반환
 * - latLonToVector3: 위도와 경도를 3D 벡터로 변환
 * 
 * 주요 라이브러리:
 * - @react-three/fiber: React와 Three.js를 통합하여 3D 그래픽을 렌더링
 * - @react-three/drei: Three.js를 위한 유틸리티와 컴포넌트를 제공
 * - three: Three.js 라이브러리로 3D 그래픽을 생성
 * 
 * 주요 기능:
 * - 지구본 텍스처 로드 및 렌더링
 * - 지구본 회전 애니메이션
 * - 주기적으로 트래픽 흐름 데이터 생성
 * - 트래픽 흐름 데이터를 기반으로 3D 곡선 및 선 렌더링
 * - 카드 레이아웃을 통해 지구본과 트래픽 흐름 시각화
 */
"use client"

import { useRef, Suspense, useEffect, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { generateFlowData } from "../utils/dataGenerators"
import { Globe } from "lucide-react"
import { BufferGeometry, Vector3, QuadraticBezierCurve3, LineBasicMaterial } from "three"
import type * as THREE from "three"



// 국가 코드에 따른 위도와 경도를 반환하는 함수
const getCoordinates = (countryCode: string) => {
  // 간단한 버전의 데이터셋. 실제 애플리케이션에서는 더 완전한 데이터셋을 사용하는 것이 좋음음
  const coordinates: { [key: string]: { lat: number; lon: number } } = {
    KR: { lat: 37.5665, lon: 126.978 }, // 대한민국 서울
    US: { lat: 37.0902, lon: -95.7129 }, // 미국
    CN: { lat: 35.8617, lon: 104.1954 }, // 중국
    JP: { lat: 36.2048, lon: 138.2529 }, // 일본
    UK: { lat: 55.3781, lon: -3.436 }, // 영국
    DE: { lat: 51.1657, lon: 10.4515 }, // 독일
    FR: { lat: 46.2276, lon: 2.2137 }, // 프랑스
    IN: { lat: 20.5937, lon: 78.9629 }, // 인도
    BR: { lat: -14.235, lon: -51.9253 }, // 브라질
    AU: { lat: -25.2744, lon: 133.7751 }, // 호주
  }
  // 주어진 국가 코드에 해당하는 위도와 경도를 반환
  // 만약 국가 코드가 데이터셋에 없으면 기본값 { lat: 0, lon: 0 } 반환
  return coordinates[countryCode] || { lat: 0, lon: 0 }
}

// 지구본 컴포넌트
const Earth = () => {
  const earthRef = useRef<THREE.Group>(null) // 지구본을 참조하기 위한 ref
  const [flowData, setFlowData] = useState<Array<{ start: string; end: string } | null>>([]) // 흐름 데이터를 저장하는 상태
  const texture = useLoader(
    TextureLoader,
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/texture_earth.jpg-TvjarqIZVmH1Iq48yvbG8D6acPBTwt.jpeg",
  ) // 지구본 텍스처 로드

  // 지구본을 회전시키는 애니메이션 프레임
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }
  })

  // 5초마다 새로운 흐름 데이터를 생성하는 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      const newFlowData = generateFlowData()
      setFlowData(newFlowData || [])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 위도와 경도를 3D 벡터로 변환하는 함수
  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    // 위도(lat)와 경도(lon)를 3D 벡터로 변환하는 함수
    // 위도와 경도를 라디안으로 변환
    const phi = (90 - lat) * (Math.PI / 180) // 위도 변환
    const theta = (lon + 180) * (Math.PI / 180) // 경도 변환

    // 구의 표면 위의 점을 계산
    const x = -(radius * Math.sin(phi) * Math.cos(theta)) // x 좌표
    const z = radius * Math.sin(phi) * Math.sin(theta) // z 좌표
    const y = radius * Math.cos(phi) // y 좌표

    // 계산된 좌표를 사용하여 새로운 3D 벡터를 반환
    return new Vector3(x, y, z)
  }

  return (
    <group ref={earthRef}>
      {/* 지구본 메쉬 */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} /> {/* 지구본의 구형 지오메트리, 반지름 3, 세그먼트 64 */}
        <meshStandardMaterial map={texture} /> {/* 지구본의 텍스처를 적용 */}
      </mesh>
      {/* 흐름 데이터를 기반으로 선을 그리는 부분 */}
      {flowData.map((flow, index) => {
        if (!flow || !flow.start || !flow.end) return null // 흐름 데이터가 유효하지 않으면 null 반환

        const start = getCoordinates(flow.start) // 시작 지점의 위도와 경도 가져오기
        const end = getCoordinates(flow.end) // 끝 지점의 위도와 경도 가져오기
        const startVec = latLonToVector3(start.lat, start.lon, 3) // 시작 지점을 3D 벡터로 변환
        const endVec = latLonToVector3(end.lat, end.lon, 3) // 끝 지점을 3D 벡터로 변환
        const midVec = new Vector3().copy(startVec).lerp(endVec, 0.5).normalize().multiplyScalar(4) // 시작과 끝의 중간 지점을 계산
        const curve = new QuadraticBezierCurve3(startVec, midVec, endVec) // 시작, 중간, 끝 지점을 사용하여 곡선 생성
        const points = curve.getPoints(50) // 곡선을 따라 50개의 점을 생성
        const geometry = new BufferGeometry().setFromPoints(points) // 생성된 점들을 사용하여 지오메트리 생성
        const material = new LineBasicMaterial({ color: 0x3b82f6 }) // 선의 재질 설정

        return (
          <group key={index}>
            <lineSegments geometry={geometry} material={material} /> {/* 흐름을 나타내는 선 */}
            <mesh position={endVec}>
              <sphereGeometry args={[0.05, 16, 16]} /> {/* 도착 지점을 나타내는 작은 구 */}
              <meshBasicMaterial color={0x3b82f6} /> {/* 구의 색상 설정 */}
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// 전체 컴포넌트
const GlobeTrafficFlow = () => {
  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700">
        <CardTitle className="text-lg text-white flex items-center">
          <Globe className="mr-2" /> 트래픽 흐름도 {/* 카드 제목 */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 bg-gray-50">
        <div className="h-[600px]">
          <Canvas camera={{ position: [0, 0, 9] }}>
            <ambientLight intensity={0.5} /> {/* 주변 조명 */}
            <pointLight position={[10, 10, 10]} /> {/* 포인트 조명 */}
            <Suspense fallback={null}>
              <Earth /> {/* 지구본 컴포넌트 */}
            </Suspense>
            <OrbitControls enableZoom={false} /> {/* 궤도 컨트롤 */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> {/* 별 효과 */}
          </Canvas>
        </div>
      </CardContent>
    </Card>
  )
}

export default GlobeTrafficFlow
