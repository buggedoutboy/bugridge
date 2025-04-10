"use client"

import { useEffect, useRef, useState } from "react"
import { useGame } from "./game-context"
import GameMap from "./game-map"
import InventoryPanel from "./inventory-panel"

export default function Game() {
  const { gameState, movePlayer, moveDog, catchEntity, saveGame, loadGame, resetGame, advanceTime } = useGame()
  const keyPressRef = useRef<Record<string, boolean>>({})
  const [showInventory, setShowInventory] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyPressRef.current[e.key] = true

      // Game controls
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault()
        saveGame()
      }
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault()
        loadGame()
      }
      if (e.key === "r" && e.ctrlKey) {
        e.preventDefault()
        resetGame()
      }
      if (e.key === "t" && e.ctrlKey) {
        e.preventDefault()
        advanceTime()
      }

      // Toggle inventory with I key
      if (e.key === "i") {
        e.preventDefault()
        setShowInventory((prev) => !prev)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keyPressRef.current[e.key] = false
    }

    // Fix for stuck keys - clear all keys when window loses focus
    const handleBlur = () => {
      // Reset all keys when window loses focus
      Object.keys(keyPressRef.current).forEach((key) => {
        keyPressRef.current[key] = false
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    // Game loop - ADJUSTED for better movement feel
    const gameLoop = setInterval(() => {
      // Player movement
      const dx =
        (keyPressRef.current.ArrowRight || keyPressRef.current.d ? 1 : 0) -
        (keyPressRef.current.ArrowLeft || keyPressRef.current.a ? 1 : 0)
      const dy =
        (keyPressRef.current.ArrowDown || keyPressRef.current.s ? 1 : 0) -
        (keyPressRef.current.ArrowUp || keyPressRef.current.w ? 1 : 0)

      if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy)
      }

      // Dog follows player
      moveDog()
    }, 60) // Adjusted from 50ms to 60ms for slightly slower updates

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
      clearInterval(gameLoop)
    }
  }, [movePlayer, moveDog, catchEntity, saveGame, loadGame, resetGame, advanceTime])

  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-green-600 border-4 border-brown-800 rounded-lg overflow-hidden shadow-2xl">
        <GameMap />

        {/* Inventory panel */}
        {showInventory && <InventoryPanel />}
      </div>

      {/* Simple controls reminder */}
      <div className="text-white text-xs mt-2 bg-green-800/80 p-1 rounded-lg">
        WASD/Arrows: Move | I: Inventory | Ctrl+S: Save | Ctrl+L: Load | Ctrl+R: Reset
      </div>
    </div>
  )
}
