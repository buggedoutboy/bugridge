"use client"

import { useGame } from "./game-context"
import {
  Bug,
  FlowerIcon as Butterfly,
  Save,
  RotateCcw,
  Download,
  Sun,
  Moon,
  Clock,
  Map,
  Coins,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GameHUD() {
  const { gameState, saveGame, loadGame, resetGame, changeBiome, advanceTime } = useGame()
  const { inventory, score, level, experience, worldTime, dayCount, currentBiome, questProgress } = gameState

  // Calculate total catches
  const totalButterflies = inventory.butterflies.common + inventory.butterflies.uncommon + inventory.butterflies.rare
  const totalBugs = inventory.bugs.common + inventory.bugs.uncommon + inventory.bugs.rare

  // Calculate experience to next level
  const expToNextLevel = level * 100
  const expPercentage = (experience / expToNextLevel) * 100

  return (
    <div className="w-full max-w-md bg-green-700 p-4 rounded-lg text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Level {level}</h2>
          <Progress value={expPercentage} className="w-24 h-2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">Score: {score}</div>
          <div className="flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded">
            <Coins size={16} className="text-yellow-300" />
            <span>{inventory.coins}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="quests">Quests</TabsTrigger>
          <TabsTrigger value="world">World</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-800 p-2 rounded">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Butterfly className="text-purple-300" />
                <span>{totalButterflies} Butterflies</span>
              </div>
              <div className="text-xs space-y-1 pl-6">
                <div className="flex justify-between">
                  <span>Common:</span>
                  <span>{inventory.butterflies.common}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Uncommon:</span>
                  <span>{inventory.butterflies.uncommon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-300">Rare:</span>
                  <span>{inventory.butterflies.rare}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-800 p-2 rounded">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Bug className="text-amber-300" />
                <span>{totalBugs} Bugs</span>
              </div>
              <div className="text-xs space-y-1 pl-6">
                <div className="flex justify-between">
                  <span>Common:</span>
                  <span>{inventory.bugs.common}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Uncommon:</span>
                  <span>{inventory.bugs.uncommon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-300">Rare:</span>
                  <span>{inventory.bugs.rare}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collection" className="space-y-2">
          <div className="bg-green-800 p-2 rounded">
            <div className="flex items-center gap-2 font-bold mb-1">
              <BookOpen className="text-yellow-300" />
              <span>Colorado Species Collection ({inventory.collection.length}/16)</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-2">
              {inventory.collection.length === 0 ? (
                <div className="col-span-2 text-center text-gray-300">No species collected yet</div>
              ) : (
                inventory.collection.map((species, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> {species}
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quests">
          <div className="bg-green-800 p-2 rounded">
            <h3 className="font-bold mb-1">Current Quest:</h3>
            <div className="flex items-center gap-2 mb-2">
              <div>{questProgress.currentQuest}</div>
              <Progress
                value={(questProgress.progress / getQuestTarget(questProgress.currentQuest)) * 100}
                className="w-24 h-2"
              />
              <div className="text-xs">
                {questProgress.progress}/{getQuestTarget(questProgress.currentQuest)}
              </div>
            </div>

            <h3 className="font-bold mb-1">Completed Quests:</h3>
            <ul className="text-sm space-y-1">
              {questProgress.completed.length === 0 && <li className="text-gray-300">No completed quests yet</li>}
              {questProgress.completed.map((quest, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="text-green-300">✓</span> {quest}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="world">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-800 p-2 rounded">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Clock className="text-blue-300" />
                <span>Day {dayCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>Time:</span>
                {worldTime === "morning" && <Sun className="text-yellow-300" size={16} />}
                {worldTime === "day" && <Sun className="text-yellow-500" size={16} />}
                {worldTime === "evening" && <Sun className="text-orange-500" size={16} />}
                {worldTime === "night" && <Moon className="text-blue-300" size={16} />}
                <span>{worldTime}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white"
                onClick={advanceTime}
              >
                Skip Time
              </Button>
            </div>

            <div className="bg-green-800 p-2 rounded">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Map className="text-amber-300" />
                <span>Biome: {currentBiome}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${currentBiome === "meadow" ? "bg-yellow-600" : "bg-green-600"} hover:bg-green-500 text-white text-xs`}
                  onClick={() => changeBiome("meadow")}
                >
                  Meadow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${currentBiome === "forest" ? "bg-yellow-600" : "bg-green-600"} hover:bg-green-500 text-white text-xs`}
                  onClick={() => changeBiome("forest")}
                >
                  Forest
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${currentBiome === "pond" ? "bg-yellow-600" : "bg-green-600"} hover:bg-green-500 text-white text-xs`}
                  onClick={() => changeBiome("pond")}
                >
                  Pond
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${currentBiome === "village" ? "bg-yellow-600" : "bg-green-600"} hover:bg-green-500 text-white text-xs`}
                  onClick={() => changeBiome("village")}
                >
                  Village
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white"
          onClick={saveGame}
        >
          <Save size={16} />
          Save (S)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white"
          onClick={loadGame}
        >
          <Download size={16} />
          Load (L)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white"
          onClick={resetGame}
        >
          <RotateCcw size={16} />
          Reset (R)
        </Button>
      </div>
    </div>
  )
}

// Helper function to get the target number for a quest
function getQuestTarget(quest: string): number {
  if (quest.includes("5 butterflies")) return 5
  if (quest.includes("3 rare bugs")) return 3
  if (quest.includes("Explore all biomes")) return 4
  if (quest.includes("10 rare creatures")) return 10
  return 1
}
