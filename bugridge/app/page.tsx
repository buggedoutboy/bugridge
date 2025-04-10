"use client"

import { useEffect, useState } from "react"
import Game from "@/components/game"
import StartScreen from "@/components/start-screen"
import { GameProvider } from "@/components/game-context"

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a saved game
    const savedGame = localStorage.getItem("bugridge-save")
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-700">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-700">
      <GameProvider>{!gameStarted ? <StartScreen onStart={() => setGameStarted(true)} /> : <Game />}</GameProvider>
    </main>
  )
}
