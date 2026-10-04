"use client"

import { Book, BookOpenCheck, LogOut, Menu, School, X } from 'lucide-react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { supabase } from '../lib/supabase/client';

interface Function {
  onToggle: () => void,
  isOpen: boolean
}

function Sidebar({ isOpen, onToggle }: Function) {
  const navigate = useRouter()
  const pathname = usePathname();

  const pages = [
    { icon: <Book />, link: "/courses" },
    { icon: <BookOpenCheck />, link: "/my-courses" }
  ]

  const logOut = async () => {
    await supabase.auth.signOut()
    navigate.push("/login")
  }

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-primary text-white shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay غامق خلف الـSidebar على الموبايل بس، بيقفلها لو ضغطت برة */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <div
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          flex flex-col items-start justify-between
          transition-all duration-300 overflow-hidden
          shadow-md shadow-primary bg-primary text-white
          ${isOpen ? "min-w-25 p-4" : "w-0 p-0"}
        `}
      >
        <div>
          <div className='flex flex-wrap items-center justify-center gap-3 border-b pb-4 border-b-white mt-12'>
            <span className='rounded-2xl bg-white text-primary p-3.5 scale-90'>
              <School strokeWidth={1.3} size={30} />
            </span>
            <span className='font-bold'>LMS</span>
          </div>

          <div className="flex flex-col gap-2 mt-10">
            {pages.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                onClick={() => { if (window.innerWidth < 1024) onToggle() }}
                className={`flex items-center gap-3 p-4 justify-center lg:justify-center ${
                  pathname === item.link ? "bg-white text-primary" : "text-white hover:bg-white hover:text-primary"
                } rounded-2xl transition-all whitespace-nowrap`}
              >
                {item.icon}
                <span className="lg:hidden">{item.link.replace("/", "")}</span>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={logOut}
          className='flex items-center gap-3 rounded-2xl p-4 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-400 cursor-pointer hover:-translate-y-1'
        >
          <LogOut size={20} />
        </button>
      </div>
    </>
  )
}

export default Sidebar