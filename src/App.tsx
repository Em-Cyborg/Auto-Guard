"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "./components/Sidebar"
import TrafficGraph from "./components/TrafficGraph"
import GlobeTrafficFlow from "./components/GlobeTrafficFlow"
import LogTable from "./components/LogTable"
import ResourceMonitoring from "./components/ResourceMonitoring"
import Statistics from "./components/Statistics"
import SystemInfo from "./components/SystemInfo"
import NetworkPorts from "./components/NetworkPorts"
import { LayoutGrid } from "lucide-react"
import { generateTrafficData } from "./utils/dataGenerators"

function App() {
  const [trafficData, setTrafficData] = useState<{ inbound: number; outbound: number; time: Date }[]>([])

  const updateTrafficData = useCallback(() => {
    const newData = generateTrafficData()[0]
    if (newData) {
      setTrafficData((prevData) => {
        const updatedData = [...(prevData || []).slice(-29), newData]
        return updatedData.filter(
          (data): data is { inbound: number; outbound: number; time: Date } =>
            data !== null &&
            data !== undefined &&
            typeof data.inbound === "number" &&
            typeof data.outbound === "number" &&
            data.time instanceof Date,
        )
      })
    }
  }, [])

  useEffect(() => {
    updateTrafficData()
    const interval = setInterval(updateTrafficData, 2000)
    return () => clearInterval(interval)
  }, [updateTrafficData])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1920px] mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
            <LayoutGrid className="mr-2 text-blue-600" /> 대시보드
          </h1>
          <LogTable trafficData={trafficData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResourceMonitoring />
            <Statistics />
          </div>
          <TrafficGraph trafficData={trafficData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlobeTrafficFlow />
            <div className="grid grid-cols-1 gap-6">
              <SystemInfo />
              <NetworkPorts />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;