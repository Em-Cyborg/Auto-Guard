/**
 * 이 모듈은 트래픽 데이터, 로그 데이터, 플로우 데이터를 생성하는 유틸리티 함수들을 포함하고 있음음
 * 
 * @module dataGenerators
 */

/**
 * 트래픽 데이터를 생성하는 함수
 * 
 * @param {number} [count=30] - 생성할 트래픽 데이터의 개수
 * @returns {{ inbound: number; outbound: number; time: Date }[]} 생성된 트래픽 데이터 배열을 반환
 */

/**
 * 로그 데이터를 생성하는 함수
 * 
 * @param {{ inbound: number; outbound: number; time: Date }[]} trafficData - 트래픽 데이터 배열
 * @param {any[]} [existingLogs=[]] - 기존 로그 데이터 배열
 * @returns {any[]} 생성된 로그 데이터 배열을 반환
 */

/**
 * 플로우 데이터를 생성하는 함수
 * 
 * @returns {{ start: string; end: string }[]} 생성된 플로우 데이터 배열을 반환
 */

// 트래픽 데이터를 생성하는 함수
export function generateTrafficData(count = 30): { inbound: number; outbound: number; time: Date }[] {
  const data = [] // 데이터를 저장할 배열
  const now = new Date() // 현재 시간을 기준으로 데이터 생성
  for (let i = 0; i < count; i++) {
    // count 만큼 반복
    const time = new Date(now.getTime() - (count - 1 - i) * 2000) // 2초 간격으로 시간 설정
    data.push({
      time: time, // 생성된 시간
      inbound: Math.floor(Math.random() * 30), // 랜덤한 inbound 값
      outbound: Math.floor(Math.random() * 30), // 랜덤한 outbound 값
    })
  }
  return data // 생성된 데이터 반환
}

// 로그 데이터를 생성하는 함수
export function generateLogData(
  trafficData: { inbound: number; outbound: number; time: Date }[],
  existingLogs: any[] = [],
): any[] {
  const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "FTP", "SMTP", "DNS"] // 프로토콜 목록
  const maliciousTypes = [
    "악성(DDoS)",
    "악성(SQL Injection)",
    "악성(XSS)",
    "악성(Port Scan)",
    "악성(Brute Force)",
    "악성(Malware)",
    "악성(Phishing)",
    "악성(Command Injection)",
    "악성(File Inclusion)",
  ] // 악성 유형 목록

  const newLogs = trafficData.reduce((acc: any[], traffic) => {
    if (!traffic) return acc // 트래픽 데이터가 없으면 건너뜀

    const totalTraffic = (traffic.inbound || 0) + (traffic.outbound || 0) // 총 트래픽 계산
    const logs = []

    for (let i = 0; i < totalTraffic; i++) {
      // 총 트래픽 수만큼 로그 생성
      const randomValue = Math.random()
      let type
      if (randomValue < 0.6) {
        type = "정상" // 60% 확률로 정상
      } else if (randomValue < 0.9) {
        type = maliciousTypes[Math.floor(Math.random() * maliciousTypes.length)] // 30% 확률로 악성
      } else {
        type = "새로운 패턴" // 10% 확률로 새로운 패턴
      }

      logs.push({
        timestamp: traffic.time || new Date(), // 트래픽 시간 또는 현재 시간
        sourceIP: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(
          Math.random() * 256,
        )}.${Math.floor(Math.random() * 256)}`, // 랜덤한 소스 IP
        sourcePort: Math.floor(Math.random() * 65536), // 랜덤한 소스 포트
        destinationIP: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(
          Math.random() * 256,
        )}.${Math.floor(Math.random() * 256)}`, // 랜덤한 목적지 IP
        destinationPort: Math.floor(Math.random() * 65536), // 랜덤한 목적지 포트
        protocol: protocols[Math.floor(Math.random() * protocols.length)], // 랜덤한 프로토콜
        type: type, // 로그 유형
        trafficVolume: Math.floor(Math.random() * 1000), // 랜덤한 트래픽 볼륨
      })
    }

    return [...acc, ...logs] // 생성된 로그를 누적
  }, [] as any[])

  return [...(existingLogs || []), ...newLogs] // 기존 로그와 새로운 로그를 합쳐서 반환
}

// 플로우 데이터를 생성하는 함수
export function generateFlowData(): { start: string; end: string }[] {
  const countries = ["KR", "US", "CN", "JP", "UK", "DE", "FR", "IN", "BR", "AU"] // 국가 목록
  const flows = []
  for (let i = 0; i < 50; i++) {
    // 50개의 플로우 데이터 생성
    flows.push({
      start: countries[Math.floor(Math.random() * countries.length)], // 랜덤한 시작 국가
      end: countries[Math.floor(Math.random() * countries.length)], // 랜덤한 도착 국가
    })
  }
  return flows // 생성된 플로우 데이터 반환
}
