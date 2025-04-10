"use client"

import { useGame } from "./game-context"
import { Bug, FlowerIcon as Butterfly, Flower } from "lucide-react"

export default function InventoryPanel() {
  const { gameState } = useGame()
  const { inventory } = gameState

  // Calculate total catches
  const totalButterflies = inventory.butterflies.common + inventory.butterflies.uncommon + inventory.butterflies.rare
  const totalBugs = inventory.bugs.common + inventory.bugs.uncommon + inventory.bugs.rare
  const totalPlants = inventory.plants.common + inventory.plants.uncommon + inventory.plants.rare

  return (
    <div className="absolute top-4 right-4 bg-black/70 p-3 rounded-lg z-50 text-white w-64 max-h-[80%] overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Collection</h3>
      </div>

      <div className="space-y-3">
        {/* Butterflies */}
        <div className="bg-green-900/50 p-2 rounded">
          <div className="flex items-center gap-2 font-bold mb-1 text-xs">
            <Butterfly className="text-purple-300" size={16} />
            <span>{totalButterflies} Butterflies</span>
          </div>
          <div className="text-xs space-y-1 pl-4">
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

        {/* Bugs */}
        <div className="bg-green-900/50 p-2 rounded">
          <div className="flex items-center gap-2 font-bold mb-1 text-xs">
            <Bug className="text-amber-300" size={16} />
            <span>{totalBugs} Bugs</span>
          </div>
          <div className="text-xs space-y-1 pl-4">
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

        {/* Plants */}
        <div className="bg-green-900/50 p-2 rounded">
          <div className="flex items-center gap-2 font-bold mb-1 text-xs">
            <Flower className="text-pink-300" size={16} />
            <span>{totalPlants} Plants</span>
          </div>
          <div className="text-xs space-y-1 pl-4">
            <div className="flex justify-between">
              <span>Common:</span>
              <span>{inventory.plants.common}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-300">Uncommon:</span>
              <span>{inventory.plants.uncommon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-300">Rare:</span>
              <span>{inventory.plants.rare}</span>
            </div>
          </div>
        </div>

        {/* Species Collection */}
        <div className="bg-green-900/50 p-2 rounded">
          <h4 className="text-xs font-bold mb-1">Colorado Species ({inventory.collection.length}/120)</h4>

          {/* Group by season */}
          <div className="mt-2">
            <h5 className="text-xs font-semibold text-green-300">Spring Species</h5>
            <div className="grid grid-cols-1 gap-1 text-xs mb-2">
              {inventory.collection
                .filter((species) => species.includes("spring"))
                .map((species, index) => (
                  <div key={`spring-${index}`} className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> {species.replace(" (spring)", "")}
                  </div>
                ))}
              {inventory.collection.filter((species) => species.includes("spring")).length === 0 && (
                <div className="text-gray-400">No spring species collected yet</div>
              )}
            </div>

            <h5 className="text-xs font-semibold text-yellow-300">Summer Species</h5>
            <div className="grid grid-cols-1 gap-1 text-xs mb-2">
              {inventory.collection
                .filter((species) => species.includes("summer"))
                .map((species, index) => (
                  <div key={`summer-${index}`} className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> {species.replace(" (summer)", "")}
                  </div>
                ))}
              {inventory.collection.filter((species) => species.includes("summer")).length === 0 && (
                <div className="text-gray-400">No summer species collected yet</div>
              )}
            </div>

            <h5 className="text-xs font-semibold text-orange-300">Fall Species</h5>
            <div className="grid grid-cols-1 gap-1 text-xs mb-2">
              {inventory.collection
                .filter((species) => species.includes("fall"))
                .map((species, index) => (
                  <div key={`fall-${index}`} className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> {species.replace(" (fall)", "")}
                  </div>
                ))}
              {inventory.collection.filter((species) => species.includes("fall")).length === 0 && (
                <div className="text-gray-400">No fall species collected yet</div>
              )}
            </div>

            <h5 className="text-xs font-semibold text-blue-300">Winter Species</h5>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {inventory.collection
                .filter((species) => species.includes("winter"))
                .map((species, index) => (
                  <div key={`winter-${index}`} className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> {species.replace(" (winter)", "")}
                  </div>
                ))}
              {inventory.collection.filter((species) => species.includes("winter")).length === 0 && (
                <div className="text-gray-400">No winter species collected yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-2 text-center">Press I to close</div>
    </div>
  )
}
