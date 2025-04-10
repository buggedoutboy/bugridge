"use client"

import { useGame } from "./game-context"
import { Button } from "@/components/ui/button"
import { ChevronRight, X } from "lucide-react"

export default function DialogBox() {
  const { gameState, advanceDialog, closeDialog } = useGame()
  const { dialog } = gameState

  if (!dialog.active || !dialog.npc) return null

  const currentLine = dialog.npc.dialog[dialog.currentLine]
  const isLastLine = dialog.currentLine === dialog.npc.dialog.length - 1

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 z-50">
      <div className="flex justify-between items-start mb-2">
        <div className="font-bold text-yellow-300">{dialog.npc.name}</div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-white" onClick={closeDialog}>
          <X size={16} />
        </Button>
      </div>

      <div className="mb-4">{currentLine}</div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="bg-green-700 hover:bg-green-600 text-white flex items-center gap-1"
          onClick={advanceDialog}
        >
          {isLastLine && dialog.npc.quest?.available ? "Accept Quest" : isLastLine ? "Goodbye" : "Continue"}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
