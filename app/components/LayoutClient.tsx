// app/components/LayoutClient.tsx
"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { List, Menu } from "lucide-react"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [sideBarOpen, setSideBarOpen] = useState(true)

  return (
    <>
      {
        sideBarOpen ?
        <Sidebar isOpen={sideBarOpen} onToggle={() => setSideBarOpen((prev) => !prev)} /> : <button className="bg-primary p-2.5 text-white m-4 absolute top-0 rounded-xl" onClick={() => setSideBarOpen(true)}><Menu/></button>
      }
      <div className="flex flex-col grow">
        {children}
      </div>
    </>
  )
}