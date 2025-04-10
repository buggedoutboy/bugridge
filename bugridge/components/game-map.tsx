"use client"

import { useGame } from "./game-context"
import { useEffect, useState, useMemo, useRef } from "react"
import { Bug, FlowerIcon as Butterfly, Flower } from "lucide-react"

// Character sprites using CSS - Updated John with purple clothes and darker hair
// Removed name labels above characters
const JohnSprite = ({ direction }: { direction: string }) => (
  <div className="relative">
    <div className="relative w-8 h-10 overflow-hidden">
      {/* Body - Changed to purple */}
      <div className="absolute w-6 h-7 bg-purple-600 rounded-md left-1 top-3"></div>
      {/* Head */}
      <div className="absolute w-6 h-6 bg-[#f8d5a8] rounded-full left-1 top-0"></div>
      {/* Hair - Darker now */}
      <div className="absolute w-6 h-2 bg-amber-900 rounded-t-md left-1 top-0"></div>
      {/* Eyes - Now has two eyes */}
      <div className="absolute w-1 h-1 bg-black rounded-full left-2 top-2"></div>
      <div className="absolute w-1 h-1 bg-black rounded-full left-4 top-2"></div>
      {/* Mouth */}
      <div className="absolute w-2 h-1 bg-red-400 rounded-full left-3 top-4"></div>
      {/* Arms - Changed to purple */}
      <div
        className={`absolute w-2 h-4 bg-purple-600 rounded-full ${direction === "left" ? "left-0" : "left-6"} top-4 ${direction === "up" ? "animate-wave" : ""}`}
      ></div>
      {/* Legs */}
      <div className="absolute w-2 h-3 bg-gray-700 rounded-b-md left-1  top-7"></div>
      <div className="absolute w-2 h-3 bg-gray-700 rounded-b-md left-5 top-7"></div>
    </div>
  </div>
)

const CharlieSprite = ({ direction }: { direction: string }) => (
  <div className="relative">
    <div className="relative w-10 h-6">
      {/* Body - now white */}
      <div className="absolute w-8 h-4 bg-white rounded-md left-1 top-2"></div>
      {/* Head - white with brown ear patches */}
      <div className="absolute w-4 h-4 bg-white rounded-full left-0 top-0"></div>
      {/* Brown patches */}
      <div className="absolute w-3 h-2 bg-amber-700 rounded-full left-5 top-3"></div>
      <div className="absolute w-2 h-2 bg-amber-700 rounded-full left-2 top-4"></div>
      {/* Ears */}
      <div className="absolute w-2 h-3 bg-amber-800 rounded-md -left-1 -top-1 rotate-45"></div>
      <div className="absolute w-2 h-3 bg-white rounded-md left-2 -top-2 -rotate-12"></div>
      {/* Eyes */}
      <div
        className={`absolute w-1 h-1 bg-black rounded-full ${direction === "left" ? "left-0" : "left-2"} top-1`}
      ></div>
      {/* Nose */}
      <div className="absolute w-1.5 h-1.5 bg-black rounded-full left-0 top-2"></div>
      {/* Tail - brown patch */}
      <div className="absolute w-3 h-2 bg-amber-700 rounded-md left-8 top-2 animate-slow-wag"></div>
      {/* Legs */}
      <div className="absolute w-1 h-2 bg-white rounded-b-md left-2 top-4"></div>
      <div className="absolute w-1 h-2 bg-white rounded-b-md left-4 top-4"></div>
      <div className="absolute w-1 h-2 bg-white rounded-b-md left-6 top-4"></div>
      <div className="absolute w-1 h-2 bg-amber-800 rounded-b-md left-8 top-4"></div>
    </div>
  </div>
)

// Update the ColoradoSpecies object to match the expanded database in game-context.tsx
const ColoradoSpecies = {
  butterfly: [
    { name: "Monarch", color: "text-orange-500", size: 20, season: "summer" },
    { name: "Painted Lady", color: "text-orange-300", size: 18, season: "spring" },
    { name: "Swallowtail", color: "text-yellow-400", size: 22, season: "summer" },
    { name: "CO Hairstreak", color: "text-purple-500", size: 16, season: "summer" },
    { name: "Blue Melissa", color: "text-blue-400", size: 14, season: "spring" },
    { name: "Mountain Parnassian", color: "text-white", size: 20, season: "fall" },
    { name: "Cabbage White", color: "text-gray-100", size: 16, season: "spring" },
    { name: "Mourning Cloak", color: "text-purple-900", size: 22, season: "winter" },
    { name: "Red Admiral", color: "text-red-600", size: 20, season: "summer" },
    { name: "Comma", color: "text-amber-600", size: 16, season: "fall" },
    { name: "Fritillary", color: "text-orange-400", size: 18, season: "summer" },
    { name: "Sulphur", color: "text-yellow-300", size: 16, season: "spring" },
    { name: "Copper", color: "text-amber-500", size: 14, season: "summer" },
    { name: "Skipper", color: "text-gray-500", size: 14, season: "fall" },
    { name: "Checkerspot", color: "text-orange-600", size: 16, season: "spring" },
    { name: "Hoary Comma", color: "text-amber-700", size: 16, season: "summer" },
    { name: "Weidemeyer's Admiral", color: "text-blue-900", size: 22, season: "summer" },
    { name: "Rocky Mountain Parnassian", color: "text-gray-200", size: 20, season: "summer" },
    { name: "Milbert's Tortoiseshell", color: "text-amber-800", size: 18, season: "fall" },
    { name: "Silvery Blue", color: "text-blue-200", size: 14, season: "spring" },
  ],
  bug: [
    { name: "Potato Beetle", color: "text-yellow-600", size: 14, season: "summer" },
    { name: "Boxelder Bug", color: "text-red-700", size: 16, season: "fall" },
    { name: "Lady Beetle", color: "text-red-500", size: 12, season: "spring" },
    { name: "Mountain Tick", color: "text-amber-800", size: 10, season: "summer" },
    { name: "Miller Moth", color: "text-gray-400", size: 18, season: "spring" },
    { name: "Grasshopper", color: "text-green-700", size: 16, season: "summer" },
    { name: "Cicada", color: "text-green-600", size: 20, season: "summer" },
    { name: "Stink Bug", color: "text-green-800", size: 14, season: "fall" },
    { name: "Ant", color: "text-black", size: 8, season: "spring" },
    { name: "Earwig", color: "text-amber-900", size: 12, season: "summer" },
    { name: "Firefly", color: "text-yellow-300", size: 10, season: "summer" },
    { name: "Dragonfly", color: "text-blue-500", size: 22, season: "summer" },
    { name: "Damselfly", color: "text-blue-300", size: 18, season: "spring" },
    { name: "Mantis", color: "text-green-500", size: 24, season: "fall" },
    { name: "Bee", color: "text-yellow-500", size: 12, season: "spring" },
    { name: "Wasp", color: "text-yellow-600", size: 14, season: "summer" },
    { name: "Mosquito", color: "text-gray-600", size: 8, season: "summer" },
    { name: "Fly", color: "text-gray-700", size: 10, season: "spring" },
    { name: "Beetle", color: "text-black", size: 12, season: "summer" },
    { name: "Weevil", color: "text-amber-700", size: 10, season: "fall" },
    { name: "Termite", color: "text-amber-200", size: 8, season: "summer" },
    { name: "Cricket", color: "text-green-900", size: 14, season: "fall" },
    { name: "Katydid", color: "text-green-400", size: 16, season: "summer" },
    { name: "Aphid", color: "text-green-300", size: 6, season: "spring" },
    { name: "Mite", color: "text-red-300", size: 4, season: "winter" },
    { name: "Springtail", color: "text-blue-200", size: 6, season: "winter" },
    { name: "Snow Flea", color: "text-blue-100", size: 6, season: "winter" },
    { name: "Winter Crane Fly", color: "text-gray-300", size: 16, season: "winter" },
    { name: "Winter Stonefly", color: "text-gray-400", size: 14, season: "winter" },
    { name: "Rocky Mountain Wood Tick", color: "text-red-800", size: 10, season: "spring" },
  ],
  plant: [
    { name: "Colorado Blue Columbine", color: "text-blue-400", size: 18, season: "summer" },
    { name: "Rocky Mountain Iris", color: "text-purple-400", size: 16, season: "spring" },
    { name: "Pasqueflower", color: "text-purple-300", size: 14, season: "spring" },
    { name: "Indian Paintbrush", color: "text-red-500", size: 16, season: "summer" },
    { name: "Fairy Slipper Orchid", color: "text-pink-300", size: 12, season: "spring" },
    { name: "Fireweed", color: "text-pink-500", size: 20, season: "summer" },
    { name: "Alpine Sunflower", color: "text-yellow-400", size: 18, season: "summer" },
    { name: "Elephant's Head", color: "text-pink-600", size: 14, season: "summer" },
    { name: "Mountain Harebell", color: "text-blue-300", size: 12, season: "summer" },
    { name: "Penstemon", color: "text-blue-600", size: 16, season: "summer" },
    { name: "Lupine", color: "text-indigo-400", size: 18, season: "summer" },
    { name: "Mariposa Lily", color: "text-white", size: 16, season: "summer" },
    { name: "Shooting Star", color: "text-pink-400", size: 14, season: "spring" },
    { name: "Marsh Marigold", color: "text-yellow-500", size: 16, season: "spring" },
    { name: "Globeflower", color: "text-yellow-300", size: 14, season: "spring" },
  ],
}

// Add a clock component at the top of the GameMap component
const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format date and time in Colorado time zone
  const formatColoradoTime = () => {
    const options = { timeZone: "America/Denver" }
    return new Date().toLocaleTimeString("en-US", options)
  }

  const formatColoradoDate = () => {
    const options = {
      timeZone: "America/Denver",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date().toLocaleDateString("en-US", options)
  }

  // Get current season in Colorado
  const getCurrentSeason = () => {
    const now = new Date()
    const options = { timeZone: "America/Denver" }
    const coloradoTime = new Date(now.toLocaleString("en-US", options))
    const month = coloradoTime.getMonth()

    if (month >= 2 && month <= 4) return "Spring"
    if (month >= 5 && month <= 7) return "Summer"
    if (month >= 8 && month <= 10) return "Fall"
    return "Winter"
  }

  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-lg z-40 text-right">
      <div className="text-sm font-bold">{formatColoradoTime()}</div>
      <div className="text-xs">{formatColoradoDate()}</div>
      <div className="text-xs text-yellow-300">Season: {getCurrentSeason()}</div>
    </div>
  )
}

// Simple noise function for terrain features
function noise2D(x: number, y: number): number {
  // Simple implementation of a 2D noise function
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255

  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)

  const topRight = (X + Y * 57) * 8.7
  const topLeft = (X + 1 + Y * 57) * 8.7
  const bottomRight = (X + (Y + 1) * 57) * 8.7
  const bottomLeft = (X + 1 + (Y + 1) * 57) * 8.7

  const u = fade(xf)
  const v = fade(yf)

  const result = lerp(
    lerp(Math.sin(topRight), Math.sin(topLeft), u),
    lerp(Math.sin(bottomRight), Math.sin(bottomLeft), u),
    v,
  )

  return (result + 1) / 2 // Normalize to 0-1
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

// Simplify the fade animation logic
export default function GameMap() {
  const { gameState, catchEntity, cleanupEntities } = useGame()
  const { playerPosition, dogPosition, entities, worldTime, globalPosition } = gameState
  const [playerDirection, setPlayerDirection] = useState("right")
  const [dogDirection, setDogDirection] = useState("right")
  const [lastPlayerPos, setLastPlayerPos] = useState(playerPosition)
  const [lastDogPos, setLastDogPos] = useState(dogPosition)
  const [notification, setNotification] = useState(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const lastCaughtRef = useRef(null)

  // Run cleanup more frequently
  useEffect(() => {
    // Run cleanup every 2 seconds
    const cleanupInterval = setInterval(() => {
      cleanupEntities()
    }, 2000)

    return () => clearInterval(cleanupInterval)
  }, [cleanupEntities])

  // Update character directions based on movement
  useEffect(() => {
    if (playerPosition.x > lastPlayerPos.x) setPlayerDirection("right")
    else if (playerPosition.x < lastPlayerPos.x) setPlayerDirection("left")
    else if (playerPosition.y < lastPlayerPos.y) setPlayerDirection("up")
    else if (playerPosition.y > lastPlayerPos.y) setPlayerDirection("down")

    setLastPlayerPos(playerPosition)

    if (dogPosition.x > lastDogPos.x) setDogDirection("right")
    else if (dogPosition.x < lastDogPos.x) setDogDirection("left")
    else if (dogPosition.y < lastDogPos.y) setDogDirection("up")
    else if (dogPosition.y > lastDogPos.y) setDogDirection("down")

    setLastDogPos(dogPosition)

    // Clean up entities when player moves
    cleanupEntities()
  }, [playerPosition, dogPosition, lastPlayerPos, lastDogPos, cleanupEntities])

  // Map size in tiles
  const mapWidth = 40
  const mapHeight = 20
  const tileSize = 20

  // Get time-of-day overlay
  const getTimeOverlay = () => {
    switch (worldTime) {
      case "morning":
        return "bg-yellow-500/10"
      case "day":
        return ""
      case "evening":
        return "bg-orange-500/20"
      case "night":
        return "bg-blue-900/40"
      default:
        return ""
    }
  }

  // Generate grass tufts for texture - REDUCED for better performance
  const generateGrassTufts = () => {
    const tufts = []
    const scale = 0.1
    const density = 0.05 // Reduced from 0.1
    const maxTufts = 30 // Added a maximum limit

    // Generate a grid of potential tuft locations
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        // Calculate world position
        const worldX = Math.floor(globalPosition.x) + x * 10
        const worldY = Math.floor(globalPosition.y) + y * 10

        // Use noise to determine if we should place a tuft here
        for (let i = 0; i < 3; i++) {
          // Reduced from 5
          if (tufts.length >= maxTufts) break

          const offsetX = Math.random() * 10
          const offsetY = Math.random() * 10
          const noiseValue = noise2D((worldX + offsetX) * scale, (worldY + offsetY) * scale)

          if (noiseValue > 1 - density) {
            // Calculate screen position
            const screenX = worldX + offsetX - globalPosition.x + mapWidth / 2
            const screenY = worldY + offsetY - globalPosition.y + mapHeight / 2

            // Only add if on screen
            if (screenX >= -2 && screenX <= mapWidth + 2 && screenY >= -2 && screenY <= mapHeight + 2) {
              tufts.push({
                id: `tuft-${worldX}-${worldY}-${i}`,
                x: screenX,
                y: screenY,
                size: Math.floor(noiseValue * 2) + 1, // Size 1-2
                shade: Math.random() > 0.5 ? "bg-green-600" : "bg-green-700", // Vary the shade
              })
            }
          }
        }
      }
    }

    return tufts
  }

  // Update the getSpeciesDetails function to handle the expanded database
  const getSpeciesDetails = (entity) => {
    const collection = ColoradoSpecies[entity.type] || ColoradoSpecies.bug

    // Find the species by name using the season property
    const speciesIndex = collection.findIndex((s) => s.season === entity.season)
    const adjustedIndex = speciesIndex !== -1 ? speciesIndex : 0

    // Apply rarity adjustments
    const rarityIndex = entity.rarity === "common" ? 0 : entity.rarity === "uncommon" ? 1 : 2
    const finalIndex = (adjustedIndex + rarityIndex) % collection.length

    return {
      ...collection[finalIndex],
      // Make rare species bigger
      size: collection[finalIndex].size * (entity.rarity === "rare" ? 1.3 : 1),
    }
  }

  // Generate grass tufts
  const grassTufts = useMemo(() => {
    return generateGrassTufts()
  }, [globalPosition.x, globalPosition.y])

  return (
    <div
      ref={mapRef}
      className="relative overflow-hidden bg-green-500"
      style={{
        width: `${mapWidth * tileSize}px`,
        height: `${mapHeight * tileSize}px`,
        backgroundImage: "radial-gradient(circle, rgba(74, 222, 128, 0.2) 10%, transparent 10%)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Time of day overlay */}
      <div className={`absolute inset-0 z-20 pointer-events-none ${getTimeOverlay()}`}></div>

      {/* Clock display */}
      <Clock />

      {/* Grass tufts for texture */}
      {grassTufts.map((tuft) => (
        <div
          key={tuft.id}
          className={`absolute z-10 rounded-full ${tuft.shade}`}
          style={{
            left: `${tuft.x * tileSize}px`,
            top: `${tuft.y * tileSize}px`,
            width: `${tuft.size * 3}px`,
            height: `${tuft.size * 2}px`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Render entities with animations - IMPROVED to prevent sticking */}
      {entities.map((entity) => {
        // Skip rendering caught entities completely
        if (entity.caught) return null

        // Skip non-visible entities completely
        if (!entity.visible) return null

        // Calculate screen position from global position
        const screenX = entity.x - globalPosition.x + mapWidth / 2
        const screenY = entity.y - globalPosition.y + mapHeight / 2

        // Only render if on screen with a larger buffer zone
        if (screenX < -5 || screenX > mapWidth + 5 || screenY < -5 || screenY > mapHeight + 5) {
          return null
        }

        // Add animations based on entity type
        let animationClass = ""
        if (entity.type === "butterfly") animationClass = "animate-float"
        if (entity.type === "bug") animationClass = "animate-wiggle"
        if (entity.type === "plant") animationClass = "animate-pulse"

        // Get species details
        const species = getSpeciesDetails(entity)

        return (
          <div
            key={entity.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${animationClass} z-10 cursor-pointer`}
            style={{
              left: `${screenX * tileSize}px`,
              top: `${screenY * tileSize}px`,
              opacity: entity.opacity || 1,
              transition: "opacity 0.5s ease-in-out",
            }}
            onClick={() => catchEntity(entity.id)}
          >
            {entity.type === "butterfly" && (
              <>
                <Butterfly className={species.color} size={species.size} />
                {entity.rarity === "rare" && (
                  <div className="absolute inset-0 animate-ping opacity-70">
                    <Butterfly className={species.color} size={species.size} />
                  </div>
                )}
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-white whitespace-nowrap bg-black/50 px-1 rounded"
                  style={{ pointerEvents: "none" }}
                >
                  {species.name}
                </div>
              </>
            )}
            {entity.type === "bug" && (
              <>
                <Bug className={species.color} size={species.size} />
                {entity.rarity === "rare" && (
                  <div className="absolute inset-0 animate-ping opacity-70">
                    <Bug className={species.color} size={species.size} />
                  </div>
                )}
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-white whitespace-nowrap bg-black/50 px-1 rounded"
                  style={{ pointerEvents: "none" }}
                >
                  {species.name}
                </div>
              </>
            )}
            {entity.type === "plant" && (
              <>
                <Flower className={species.color} size={species.size} />
                {entity.rarity === "rare" && (
                  <div className="absolute inset-0 animate-ping opacity-70">
                    <Flower className={species.color} size={species.size} />
                  </div>
                )}
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-white whitespace-nowrap bg-black/50 px-1 rounded"
                  style={{ pointerEvents: "none" }}
                >
                  {species.name}
                </div>
              </>
            )}
          </div>
        )
      })}

      {/* Render player (John) with sprite */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{
          left: `${(mapWidth / 2) * tileSize}px`, // Player is always centered
          top: `${(mapHeight / 2) * tileSize}px`,
        }}
      >
        <JohnSprite direction={playerDirection} />
      </div>

      {/* Render dog (Charlie) with sprite */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{
          // Calculate dog's position relative to player
          left: `${(dogPosition.x - playerPosition.x + mapWidth / 2) * tileSize}px`,
          top: `${(dogPosition.y - playerPosition.y + mapHeight / 2) * tileSize}px`,
        }}
      >
        <CharlieSprite direction={dogDirection} />
      </div>

      {/* Score Display */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg z-40 font-bold text-xl">
        Score: {gameState.score}
      </div>

      {/* Random score change indicator */}
      <div className="absolute bottom-2 left-2 text-white text-xs z-40 opacity-70">
        Bugridge - Catch bugs, watch the score go wild!
      </div>
    </div>
  )
}
