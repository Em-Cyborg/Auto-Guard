/**
 * 주요 기능:
 * - 메뉴 아이템을 클릭하여 서브 메뉴를 열고 닫을 수 있음음
 * - 각 메뉴 아이템은 아이콘과 라벨을 포함하며, 서브 메뉴가 있는 경우 토글 기능을 제공
 * - 서브 메뉴 아이템은 클릭 시 배경색이 변경되는 효과를 가짐짐
 * 
 * 사용된 주요 라이브러리:
 * - React: 컴포넌트 상태 관리 및 렌더링
 * - lucide-react: 아이콘 사용
 * 
 * 컴포넌트 구조:
 * - Sidebar: 사이드바 전체를 감싸는 컴포넌트
 * - MenuItem: 개별 메뉴 아이템을 정의하는 컴포넌트
 * 
 * 상태 관리:
 * - openMenus: 현재 열려 있는 메뉴의 라벨을 배열로 관리
 * 
 * 주요 함수:
 * - toggleMenu: 특정 메뉴의 열림/닫힘 상태를 토글
 * 
 * 스타일링:
 * - Tailwind CSS를 사용하여 스타일링
 * - 메뉴 아이템과 서브 메뉴 아이템에 대한 다양한 상태(호버, 클릭 등)에 따른 스타일 적용
 */
import { useState } from "react"
import {
  Home,
  BarChart2,
  Shield,
  Settings,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Users,
  Server,
  FileText,
  Database,
} from "lucide-react"

// Sidebar 컴포넌트 정의
const Sidebar = () => {
  // 메뉴의 열림/닫힘 상태를 관리하는 상태 변수
  const [openMenus, setOpenMenus] = useState<string[]>([])

  // 메뉴를 토글하는 함수
  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => (prev.includes(menu) ? prev.filter((item) => item !== menu) : [...prev, menu]))
  }

  // 개별 메뉴 아이템 컴포넌트
  const MenuItem = ({ icon: Icon, label, subItems = [] }: { icon: any; label: string; subItems?: string[] }) => {
    const hasSubItems = subItems.length > 0 // 서브 아이템이 있는지 여부
    const isOpen = openMenus.includes(label) // 현재 메뉴가 열려 있는지 여부

    return (
      <li>
        <div
          className={`flex items-center justify-between p-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors ${
            isOpen ? "bg-blue-100" : ""
          }`}
          onClick={() => hasSubItems && toggleMenu(label)} // 서브 아이템이 있는 경우에만 토글
        >
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-600" /> {/* 메뉴 아이콘 */}
            <span className="text-gray-700">{label}</span> {/* 메뉴 라벨 */}
          </div>
          {hasSubItems &&
            (isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" /> // 메뉴가 열려 있을 때 아이콘
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" /> // 메뉴가 닫혀 있을 때 아이콘
            ))}
        </div>
        {isOpen && hasSubItems && (
          <ul className="ml-6 mt-2 space-y-1">
            {subItems.map((item, index) => (
              <li key={index}>
                <a href="#" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-600 transition-colors">
                  {item} {/* 서브 아이템 */}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className="bg-white text-gray-800 w-64 min-h-screen p-4 shadow-lg">
      <div className="text-2xl font-bold mb-8 text-blue-600">Auto Guard</div> {/* 사이드바 제목 */}
      <nav>
        <ul className="space-y-2">
          {/* 각 메뉴 아이템 */}
          <MenuItem icon={Home} label="홈" />
          <MenuItem icon={BarChart2} label="트래픽 분석" subItems={["실시간 트래픽", "트래픽 보고서"]} />
          <MenuItem icon={Shield} label="보안 관리" subItems={["방화벽 규칙", "위협 탐지", "취약점 스캔"]} />
          <MenuItem icon={AlertTriangle} label="인시던트 관리" subItems={["알림 센터", "인시던트 로그"]} />
          <MenuItem icon={Users} label="사용자 관리" subItems={["사용자 목록", "권한 설정"]} />
          <MenuItem icon={Server} label="자산 관리" subItems={["네트워크 장비", "서버", "엔드포인트"]} />
          <MenuItem icon={FileText} label="보고서" subItems={["보안 보고서", "감사 로그"]} />
          <MenuItem icon={Database} label="백업" />
          <MenuItem icon={Settings} label="설정" />
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
