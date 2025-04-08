"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FuturisticHero() {
  const [activeSection, setActiveSection] = useState(0)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const router = useRouter()

  // Simulate section change on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Change active section based on scroll position
      if (scrollPosition < 300) {
        setActiveSection(0)
      } else if (scrollPosition < 600) {
        setActiveSection(1)
      } else {
        setActiveSection(2)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#111111]">
      {/* Background image - explicitly included */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url('/images/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: "0.7",
          }}
        ></div>
      </div>

      {/* Grid divider lines */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          <div className="absolute left-1/4 h-full w-[1px] bg-[#1A1A1A] opacity-60"></div>
          <div className="absolute left-2/4 h-full w-[1px] bg-[#1A1A1A] opacity-60"></div>
          <div className="absolute left-3/4 h-full w-[1px] bg-[#1A1A1A] opacity-60"></div>
        </div>
      </div>

      {/* Header with navigation */}
      <header className="relative z-10 flex items-center px-10 py-8">
        <div className="logo-container">
          <h1 className="font-sora text-xl font-medium tracking-[0.2em] text-white">SYNTHETICA</h1>
        </div>

        {/* Centered navigation */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-10">
            {["HOME", "ABOUT", "WORKS", "SERVICES", "CONTACTS"].map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="font-space-mono text-sm tracking-wide text-[#CCCCCC] transition-colors hover:text-white"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Empty div to balance the header */}
        <div className="invisible">
          <h1 className="font-sora text-xl font-medium tracking-[0.2em] text-white">SYNTHETICA</h1>
        </div>
      </header>

      {/* Main hero content */}
      <main className="relative z-10 grid h-[calc(100vh-120px)] grid-cols-1 md:grid-cols-2 px-10">
        <div className="flex flex-col justify-center">
          <span className="font-space-mono text-sm text-[#888888] tracking-tight">HERE AND NOW —</span>
          <h2 className="mt-2 text-7xl sm:text-8xl font-orbitron font-semibold tracking-tight text-white -ml-[5px]">
            <span className="text-white">FUTURE</span>
          </h2>
          <p className="mt-6 max-w-[90%] md:max-w-[80%] font-space-mono text-base leading-relaxed text-[#AAAAAA]">
            People who think about the future, about how to improve their lives, and who move in this direction, have a
            plan of action.
          </p>
          <button
            className={`mt-10 w-fit border-[0.5px] border-white px-8 py-3 font-space-mono font-bold text-sm transition-colors duration-300 ${
              isMenuHovered ? "bg-white text-black" : "bg-transparent text-white"
            }`}
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
            onClick={() => router.push('/model-viewer')}
          >
            LET&apos;S GO
          </button>
        </div>

        <div className="relative hidden md:flex items-center justify-center">{/* Empty right side */}</div>

        {/* Section dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-4">
            {[0, 1, 2].map((dot, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${activeSection === index ? "bg-white" : "bg-white/30"}`}
              ></div>
            ))}
          </div>
        </div>
      </main>

      {/* Additional UI elements */}
      <div className="absolute bottom-8 right-10 z-10">
        <p className="font-space-mono text-xs text-[#888888]">AI TECHNOLOGY</p>
      </div>

      {/* 9 Dots icon */}
      <div className="absolute right-10 top-8 z-10 text-white grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
        ))}
      </div>
    </div>
  )
}

