"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Update entity types to include plants
export type EntityType = "butterfly" | "bug" | "plant"
export type EntityRarity = "common" | "uncommon" | "rare"
export type TimeOfDay = "morning" | "day" | "evening" | "night"
export type BuildingType = "house" | "shop"
export type NPCType = "mayor" | "merchant" | "farmer" | "guard" | "child"

// Update the Entity interface to include season and visibility
export interface Entity {
  id: string // Changed to string to ensure uniqueness
  type: EntityType
  rarity: EntityRarity
  x: number
  y: number
  caught?: boolean
  season: string
  visible: boolean
  opacity: number
}

export interface Building {
  id: number
  type: BuildingType
  x: number
  y: number
  size?: "sm" | "md" | "lg"
  color?: string
  shopType?: "general" | "food" | "tools" | "bait"
}

export interface NPC {
  id: number
  type: NPCType
  name: string
  x: number
  y: number
  direction: string
  dialog: string[]
}

export interface DialogState {
  active: boolean
  npc: NPC | null
  currentLine: number
}

export interface GameState {
  playerPosition: { x: number; y: number }
  dogPosition: { x: number; y: number }
  globalPosition: { x: number; y: number } // Global position for endless map
  entities: Entity[]
  buildings: Building[]
  npcs: NPC[]
  inventory: {
    butterflies: { common: number; uncommon: number; rare: number }
    bugs: { common: number; uncommon: number; rare: number }
    plants: { common: number; uncommon: number; rare: number }
    coins: number
    collection: string[] // Names of caught species
  }
  score: number
  worldTime: TimeOfDay
  dayCount: number
  dialog: DialogState
  dogTransitioning: boolean
}

interface GameContextType {
  gameState: GameState
  movePlayer: (dx: number, dy: number) => void
  moveDog: () => void
  catchEntity: (entityId: string) => void
  saveGame: () => void
  loadGame: () => void
  resetGame: () => void
  advanceTime: () => void
  interactWithNPC: (npcId: number) => void
  advanceDialog: () => void
  closeDialog: () => void
  cleanupEntities: () => void
}

// Function to generate unique IDs - ADDED
let entityCounter = 0
function generateUniqueId(prefix = "") {
  entityCounter++
  return `${prefix}${Date.now()}-${entityCounter}-${Math.random().toString(36).substring(2, 9)}`
}

// Expanded Colorado species database
const ColoradoSpecies = {
  butterfly: [
    { name: "Monarch", season: "summer" },
    { name: "Painted Lady", season: "spring" },
    { name: "Swallowtail", season: "summer" },
    { name: "CO Hairstreak", season: "summer" },
    { name: "Blue Melissa", season: "spring" },
    { name: "Mountain Parnassian", season: "fall" },
    { name: "Cabbage White", season: "spring" },
    { name: "Mourning Cloak", season: "winter" },
    { name: "Red Admiral", season: "summer" },
    { name: "Comma", season: "fall" },
    { name: "Fritillary", season: "summer" },
    { name: "Sulphur", season: "spring" },
    { name: "Copper", season: "summer" },
    { name: "Skipper", season: "fall" },
    { name: "Checkerspot", season: "spring" },
    { name: "Hoary Comma", season: "summer" },
    { name: "Weidemeyer's Admiral", season: "summer" },
    { name: "Rocky Mountain Parnassian", season: "summer" },
    { name: "Milbert's Tortoiseshell", season: "fall" },
    { name: "Silvery Blue", season: "spring" },
    { name: "Melissa Blue", season: "summer" },
    { name: "Boisduval's Blue", season: "summer" },
    { name: "Western Pygmy Blue", season: "summer" },
    { name: "Tailed Blue", season: "spring" },
    { name: "Juniper Hairstreak", season: "spring" },
    { name: "Hoary Elfin", season: "spring" },
    { name: "Pine Elfin", season: "spring" },
    { name: "Western Pine Elfin", season: "spring" },
    { name: "Brown Elfin", season: "spring" },
    { name: "Gray Hairstreak", season: "summer" },
    { name: "Ruddy Copper", season: "summer" },
    { name: "Purplish Copper", season: "summer" },
    { name: "Lustrous Copper", season: "summer" },
    { name: "Dione Copper", season: "summer" },
    { name: "Zerene Fritillary", season: "summer" },
    { name: "Atlantis Fritillary", season: "summer" },
    { name: "Great Spangled Fritillary", season: "summer" },
    { name: "Aphrodite Fritillary", season: "summer" },
    { name: "Edwards' Fritillary", season: "summer" },
    { name: "Callippe Fritillary", season: "summer" },
  ],
  bug: [
    { name: "Potato Beetle", season: "summer" },
    { name: "Boxelder Bug", season: "fall" },
    { name: "Lady Beetle", season: "spring" },
    { name: "Mountain Tick", season: "summer" },
    { name: "Miller Moth", season: "spring" },
    { name: "Grasshopper", season: "summer" },
    { name: "Cicada", season: "summer" },
    { name: "Stink Bug", season: "fall" },
    { name: "Ant", season: "spring" },
    { name: "Earwig", season: "summer" },
    { name: "Firefly", season: "summer" },
    { name: "Dragonfly", season: "summer" },
    { name: "Damselfly", season: "spring" },
    { name: "Mantis", season: "fall" },
    { name: "Bee", season: "spring" },
    { name: "Wasp", season: "summer" },
    { name: "Mosquito", season: "summer" },
    { name: "Fly", season: "spring" },
    { name: "Beetle", season: "summer" },
    { name: "Weevil", season: "fall" },
    { name: "Termite", season: "summer" },
    { name: "Cricket", season: "fall" },
    { name: "Katydid", season: "summer" },
    { name: "Aphid", season: "spring" },
    { name: "Mite", season: "winter" },
    { name: "Springtail", season: "winter" },
    { name: "Snow Flea", season: "winter" },
    { name: "Winter Crane Fly", season: "winter" },
    { name: "Winter Stonefly", season: "winter" },
    { name: "Rocky Mountain Wood Tick", season: "spring" },
    { name: "Colorado Potato Beetle", season: "summer" },
    { name: "Western Corn Rootworm", season: "summer" },
    { name: "Mountain Pine Beetle", season: "summer" },
    { name: "Spruce Beetle", season: "summer" },
    { name: "Emerald Ash Borer", season: "summer" },
    { name: "Japanese Beetle", season: "summer" },
    { name: "Elm Leaf Beetle", season: "summer" },
    { name: "Convergent Lady Beetle", season: "spring" },
    { name: "Seven-spotted Lady Beetle", season: "spring" },
    { name: "Multicolored Asian Lady Beetle", season: "fall" },
    { name: "Western Honey Bee", season: "spring" },
    { name: "Bumble Bee", season: "summer" },
    { name: "Leafcutter Bee", season: "summer" },
    { name: "Yellow Jacket", season: "summer" },
    { name: "Paper Wasp", season: "summer" },
    { name: "Mud Dauber", season: "summer" },
    { name: "Tarantula Hawk", season: "summer" },
    { name: "Robber Fly", season: "summer" },
    { name: "Deer Fly", season: "summer" },
    { name: "Horse Fly", season: "summer" },
  ],
  plant: [
    { name: "Colorado Blue Columbine", season: "summer" },
    { name: "Rocky Mountain Iris", season: "spring" },
    { name: "Pasqueflower", season: "spring" },
    { name: "Indian Paintbrush", season: "summer" },
    { name: "Fairy Slipper Orchid", season: "spring" },
    { name: "Fireweed", season: "summer" },
    { name: "Alpine Sunflower", season: "summer" },
    { name: "Elephant's Head", season: "summer" },
    { name: "Mountain Harebell", season: "summer" },
    { name: "Penstemon", season: "summer" },
    { name: "Lupine", season: "summer" },
    { name: "Mariposa Lily", season: "summer" },
    { name: "Shooting Star", season: "spring" },
    { name: "Marsh Marigold", season: "spring" },
    { name: "Globeflower", season: "spring" },
    { name: "Alpine Forget-Me-Not", season: "summer" },
    { name: "Yarrow", season: "summer" },
    { name: "Blanketflower", season: "summer" },
    { name: "Scarlet Gilia", season: "summer" },
    { name: "Aspen Daisy", season: "summer" },
    { name: "Subalpine Larkspur", season: "summer" },
    { name: "Monkshood", season: "summer" },
    { name: "Parry's Primrose", season: "spring" },
    { name: "Chiming Bells", season: "spring" },
    { name: "Snowlover", season: "summer" },
    { name: "Alpine Avens", season: "summer" },
    { name: "Sky Pilot", season: "summer" },
    { name: "Moss Campion", season: "summer" },
    { name: "Alpine Bistort", season: "summer" },
    { name: "King's Crown", season: "summer" },
    { name: "Queen's Crown", season: "summer" },
    { name: "Alpine Buttercup", season: "summer" },
    { name: "Stonecrop", season: "summer" },
    { name: "Prickly Pear Cactus", season: "summer" },
    { name: "Yucca", season: "summer" },
    { name: "Sagebrush", season: "fall" },
    { name: "Rabbitbrush", season: "fall" },
    { name: "Serviceberry", season: "spring" },
    { name: "Chokecherry", season: "spring" },
    { name: "Wild Rose", season: "summer" },
  ],
}

// Simple noise function for terrain generation
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

const defaultGameState: GameState = {
  playerPosition: { x: 20, y: 10 },
  dogPosition: { x: 22, y: 10 },
  globalPosition: { x: 20, y: 10 }, // Start at the same position
  entities: [],
  buildings: [],
  npcs: [],
  inventory: {
    butterflies: { common: 0, uncommon: 0, rare: 0 },
    bugs: { common: 0, uncommon: 0, rare: 0 },
    plants: { common: 0, uncommon: 0, rare: 0 },
    coins: 50,
    collection: [],
  },
  score: 0,
  worldTime: "day",
  dayCount: 1,
  dialog: {
    active: false,
    npc: null,
    currentLine: 0,
  },
  dogTransitioning: false,
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState)
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout | null>(null)
  const [lastEntityGeneration, setLastEntityGeneration] = useState({ x: 0, y: 0 })
  const [scoreInterval, setScoreInterval] = useState<NodeJS.Timeout | null>(null)

  // Generate random entities when the game starts or biome changes
  useEffect(() => {
    generateEntities()
    // Try to load saved game
    const savedGame = localStorage.getItem("bugridge-save")
    if (savedGame) {
      try {
        setGameState(JSON.parse(savedGame))
      } catch (e) {
        console.error("Failed to load saved game", e)
        generateEntities()
      }
    } else {
      generateEntities()
    }

    // Set up day/night cycle based on real time
    updateTimeOfDay()
    const interval = setInterval(() => {
      updateTimeOfDay()
    }, 60000) // Check time every minute
    setTimeInterval(interval)

    // Set up random score fluctuations
    const scoreInt = setInterval(() => {
      randomScoreChange()
    }, 5000) // Random score changes every 5 seconds
    setScoreInterval(scoreInt)

    return () => {
      if (timeInterval) clearInterval(timeInterval)
      if (scoreInterval) clearInterval(scoreInterval)
    }
  }, [])

  // Update time of day based on real Colorado time
  const updateTimeOfDay = () => {
    // Get current time in Colorado (Mountain Time)
    const now = new Date()
    // Convert to Mountain Time
    const options = { timeZone: "America/Denver" }
    const coloradoTime = new Date(now.toLocaleString("en-US", options))
    const hour = coloradoTime.getHours()

    let newTime: TimeOfDay
    if (hour >= 5 && hour < 9) newTime = "morning"
    else if (hour >= 9 && hour < 17) newTime = "day"
    else if (hour >= 17 && hour < 21) newTime = "evening"
    else newTime = "night"

    setGameState((prev) => ({
      ...prev,
      worldTime: newTime,
    }))
  }

  // Random score changes for nonsensical scoring
  const randomScoreChange = () => {
    setGameState((prev) => {
      // 50% chance of score change
      if (Math.random() > 0.5) {
        const isPositive = Math.random() > 0.4 // 60% chance of positive
        const amount = Math.floor(Math.random() * 500) + 1 // 1-500 points
        const newScore = isPositive ? prev.score + amount : Math.max(0, prev.score - amount)

        return {
          ...prev,
          score: newScore,
        }
      }
      return prev
    })
  }

  // Regenerate entities when player moves far enough
  useEffect(() => {
    const dx = gameState.globalPosition.x - lastEntityGeneration.x
    const dy = gameState.globalPosition.y - lastEntityGeneration.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 15) {
      // Reduced from 20 to 15 for more frequent generation
      generateEntities()
      setLastEntityGeneration(gameState.globalPosition)
    }
  }, [gameState.globalPosition])

  // Generate entities with improved loading to prevent "jumping"
  const generateEntities = () => {
    setGameState((prev) => {
      // Keep existing entities that are still relevant
      const existingEntities = prev.entities.filter((entity) => {
        if (entity.caught) return false

        // Calculate distance from player
        const dx = entity.x - prev.globalPosition.x
        const dy = entity.y - prev.globalPosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Keep entities that are within a reasonable distance
        return distance < 40
      })

      const newEntities: Entity[] = [...existingEntities]
      const centerX = prev.globalPosition.x
      const centerY = prev.globalPosition.y
      const radius = 30 // Generate entities within this radius

      // Get current season
      const currentSeason = getCurrentSeason()

      // Entity generation - INCREASED for more variety
      const butterflyCount = 15 // Increased from 10
      const bugCount = 20 // Increased from 15
      const plantCount = 25 // New plant entities

      // Generate butterflies
      for (let i = 0; i < butterflyCount; i++) {
        const rarity = getRarity()
        const angle = Math.random() * Math.PI * 2

        // Place further from player to prevent "jumping" appearance
        // Use a minimum distance to prevent entities from appearing too close
        const minDistance = 15
        const maxDistance = radius
        const actualDistance = minDistance + Math.random() * (maxDistance - minDistance)

        // Get random species with season info
        const speciesIndex = Math.floor(Math.random() * ColoradoSpecies.butterfly.length)
        const species = ColoradoSpecies.butterfly[speciesIndex]

        // Check if this species is available in the current season
        const isInSeason = species.season === currentSeason

        newEntities.push({
          id: generateUniqueId("butterfly-"), // Use the new ID generator
          type: "butterfly",
          rarity,
          x: centerX + Math.cos(angle) * actualDistance,
          y: centerY + Math.sin(angle) * actualDistance,
          season: species.season,
          visible: isInSeason,
          opacity: isInSeason ? 1 : 0,
        })
      }

      // Generate bugs
      for (let i = 0; i < bugCount; i++) {
        const rarity = getRarity()
        const angle = Math.random() * Math.PI * 2

        // Place further from player to prevent "jumping" appearance
        const minDistance = 15
        const maxDistance = radius
        const actualDistance = minDistance + Math.random() * (maxDistance - minDistance)

        // Get random species with season info
        const speciesIndex = Math.floor(Math.random() * ColoradoSpecies.bug.length)
        const species = ColoradoSpecies.bug[speciesIndex]

        // Check if this species is available in the current season
        const isInSeason = species.season === currentSeason

        newEntities.push({
          id: generateUniqueId("bug-"), // Use the new ID generator
          type: "bug",
          rarity,
          x: centerX + Math.cos(angle) * actualDistance,
          y: centerY + Math.sin(angle) * actualDistance,
          season: species.season,
          visible: isInSeason,
          opacity: isInSeason ? 1 : 0,
        })
      }

      // Generate plants
      for (let i = 0; i < plantCount; i++) {
        const rarity = getRarity()
        const angle = Math.random() * Math.PI * 2

        // Place further from player to prevent "jumping" appearance
        const minDistance = 15
        const maxDistance = radius
        const actualDistance = minDistance + Math.random() * (maxDistance - minDistance)

        // Get random species with season info
        const speciesIndex = Math.floor(Math.random() * ColoradoSpecies.plant.length)
        const species = ColoradoSpecies.plant[speciesIndex]

        // Check if this species is available in the current season
        const isInSeason = species.season === currentSeason

        newEntities.push({
          id: generateUniqueId("plant-"), // Use the new ID generator
          type: "plant",
          rarity,
          x: centerX + Math.cos(angle) * actualDistance,
          y: centerY + Math.sin(angle) * actualDistance,
          season: species.season,
          visible: isInSeason,
          opacity: isInSeason ? 1 : 0,
        })
      }

      return { ...prev, entities: newEntities }
    })
  }

  const getRarity = (): EntityRarity => {
    const rand = Math.random()
    if (rand < 0.1) return "rare"
    if (rand < 0.3) return "uncommon"
    return "common"
  }

  // Improve the movePlayer function to handle entity cleanup during movement
  const movePlayer = (dx: number, dy: number) => {
    setGameState((prev) => {
      // Don't move if dialog is active
      if (prev.dialog.active) return prev

      // Calculate new position - REDUCED MOVEMENT SPEED for better control
      const moveSpeed = 0.4 // Reduced from 0.8 to 0.4
      const newPlayerX = prev.playerPosition.x + dx * moveSpeed
      const newPlayerY = prev.playerPosition.y + dy * moveSpeed

      // Update global position
      const newGlobalX = prev.globalPosition.x + dx * moveSpeed
      const newGlobalY = prev.globalPosition.y + dy * moveSpeed

      // Check for entities to auto-catch
      const newEntities = []
      const entitiesToRemove = new Set<string>()
      const newInventory = { ...prev.inventory }
      let newScore = prev.score

      // Check each entity to see if player is walking over it
      prev.entities.forEach((entity) => {
        if (entity.caught) return
        if (!entity.visible) return // Skip non-visible entities for performance

        // Calculate distance between player and entity
        const distance = Math.sqrt(Math.pow(entity.x - newGlobalX, 2) + Math.pow(entity.y - newGlobalY, 2))

        // If player is close enough, catch the entity
        if (distance < 1) {
          // Mark for removal
          entitiesToRemove.add(entity.id)

          // Update inventory and score with nonsensical values
          const isScorePositive = Math.random() > 0.3 // 70% chance of positive
          const scoreChange = Math.floor(Math.random() * 1000) + 1 // 1-1000 points

          // Get species name for collection
          const collection = ColoradoSpecies[entity.type]
          // Use a hash function instead of modulo for more stable mapping
          const speciesIndex =
            Math.abs(
              entity.id.split("").reduce((a, b) => {
                a = (a << 5) - a + b.charCodeAt(0)
                return a & a
              }, 0),
            ) % collection.length

          const rarity = entity.rarity === "common" ? 0 : entity.rarity === "uncommon" ? 1 : 2
          const adjustedIndex = (speciesIndex + rarity) % collection.length
          const speciesName = collection[adjustedIndex].name + " (" + entity.season + ")"

          // Add to collection if not already there
          if (!newInventory.collection.includes(speciesName)) {
            newInventory.collection.push(speciesName)
          }

          if (entity.type === "butterfly") {
            newInventory.butterflies[entity.rarity] += 1
          } else if (entity.type === "bug") {
            newInventory.bugs[entity.rarity] += 1
          } else if (entity.type === "plant") {
            newInventory.plants[entity.rarity] += 1
          }

          // Apply nonsensical score change
          newScore = isScorePositive ? newScore + scoreChange : Math.max(0, newScore - scoreChange)
        }
      })

      // Filter out caught entities
      const filteredEntities = prev.entities.filter((entity) => !entitiesToRemove.has(entity.id))

      return {
        ...prev,
        playerPosition: { x: newPlayerX, y: newPlayerY },
        globalPosition: { x: newGlobalX, y: newGlobalY },
        entities: filteredEntities,
        inventory: newInventory,
        score: newScore,
      }
    })
  }

  // Add a function to determine the current season based on real date in Colorado
  const getCurrentSeason = (): string => {
    // Get current date in Colorado time
    const now = new Date()
    const options = { timeZone: "America/Denver" }
    const coloradoTime = new Date(now.toLocaleString("en-US", options))
    const month = coloradoTime.getMonth()

    // Colorado seasons
    if (month >= 2 && month <= 4) return "spring"
    if (month >= 5 && month <= 7) return "summer"
    if (month >= 8 && month <= 10) return "fall"
    return "winter"
  }

  // Add a useEffect to update entity visibility based on season
  useEffect(() => {
    // Check season every minute
    const seasonInterval = setInterval(() => {
      updateEntityVisibility()
    }, 60000)

    return () => clearInterval(seasonInterval)
  }, [])

  // Function to update entity visibility based on current season
  const updateEntityVisibility = () => {
    const currentSeason = getCurrentSeason()

    setGameState((prev) => {
      const updatedEntities = prev.entities.map((entity) => {
        const isInSeason = entity.season === currentSeason

        // If already caught, don't change visibility
        if (entity.caught) return entity

        // If visibility status is changing, start fade animation
        if (isInSeason !== entity.visible) {
          return {
            ...entity,
            visible: isInSeason,
            opacity: isInSeason ? 0 : entity.opacity, // Start fade in from 0, or keep current opacity for fade out
          }
        }

        return entity
      })

      return { ...prev, entities: updatedEntities }
    })
  }

  // Completely rewritten dog movement logic to fix the left movement issue
  const moveDog = () => {
    setGameState((prev) => {
      // Don't move if dialog is active
      if (prev.dialog.active) return prev

      // Get the player's position
      const playerX = prev.playerPosition.x
      const playerY = prev.playerPosition.y

      // Get the dog's position
      const dogX = prev.dogPosition.x
      const dogY = prev.dogPosition.y

      // Calculate the distance between dog and player
      const dx = playerX - dogX
      const dy = playerY - dogY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If dog is too far away (more than 10 units), teleport it closer to the player
      // This prevents the "running in from the right" issue
      if (distance > 10) {
        // Place dog at a random position near the player
        const angle = Math.random() * Math.PI * 2
        const newDogX = playerX + Math.cos(angle) * 5 // 5 units away
        const newDogY = playerY + Math.sin(angle) * 5

        return {
          ...prev,
          dogPosition: { x: newDogX, y: newDogY },
        }
      }

      // Normal dog movement logic
      // If dog is too close to player, move away slightly
      if (distance < 2) {
        // Move in a random direction away from player
        const angle = Math.random() * Math.PI * 2
        const moveX = Math.cos(angle) * 0.2
        const moveY = Math.sin(angle) * 0.2

        return {
          ...prev,
          dogPosition: {
            x: dogX + moveX,
            y: dogY + moveY,
          },
        }
      }

      // If dog is at a good distance, follow player normally
      // Use a slower speed for smoother movement
      const moveSpeed = 0.3

      // Calculate normalized direction vector
      const dirX = distance === 0 ? 0 : dx / distance
      const dirY = distance === 0 ? 0 : dy / distance

      // Apply movement with slight randomness
      const randomX = (Math.random() - 0.5) * 0.05
      const randomY = (Math.random() - 0.5) * 0.05

      return {
        ...prev,
        dogPosition: {
          x: dogX + dirX * moveSpeed + randomX,
          y: dogY + dirY * moveSpeed + randomY,
        },
      }
    })
  }

  // Update catchEntity to work with string IDs
  const catchEntity = (entityId: string) => {
    setGameState((prev) => {
      // Don't catch if dialog is active
      if (prev.dialog.active) return prev

      const entityIndex = prev.entities.findIndex((e) => e.id === entityId)
      if (entityIndex === -1) return prev

      const entity = prev.entities[entityIndex]

      // If already caught, don't process again
      if (entity.caught) return prev

      // Check if player is close enough to catch
      const playerGlobalX = prev.globalPosition.x
      const playerGlobalY = prev.globalPosition.y
      const distance = Math.sqrt(Math.pow(entity.x - playerGlobalX, 2) + Math.pow(entity.y - playerGlobalY, 2))

      if (distance > 2) return prev

      // Update inventory and score with nonsensical values
      const newInventory = { ...prev.inventory }
      const isScorePositive = Math.random() > 0.3 // 70% chance of positive
      const scoreChange = Math.floor(Math.random() * 1000) + 1 // 1-1000 points

      // Get species name for collection
      const collection = ColoradoSpecies[entity.type]
      // Use a hash function instead of modulo for more stable mapping
      const speciesIndex =
        Math.abs(
          entity.id.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0)
            return a & a
          }, 0),
        ) % collection.length

      const rarity = entity.rarity === "common" ? 0 : entity.rarity === "uncommon" ? 1 : 2
      const adjustedIndex = (speciesIndex + rarity) % collection.length
      const speciesName = collection[adjustedIndex].name + " (" + entity.season + ")"

      // Add to collection if not already there
      if (!newInventory.collection.includes(speciesName)) {
        newInventory.collection.push(speciesName)
      }

      if (entity.type === "butterfly") {
        newInventory.butterflies[entity.rarity] += 1
      } else if (entity.type === "bug") {
        newInventory.bugs[entity.rarity] += 1
      } else if (entity.type === "plant") {
        newInventory.plants[entity.rarity] += 1
      }

      // IMPROVED: Completely remove the entity from the array instead of just marking it
      const newEntities = prev.entities.filter((e) => e.id !== entityId)

      // Apply nonsensical score change
      const newScore = isScorePositive ? prev.score + scoreChange : Math.max(0, prev.score - scoreChange)

      return {
        ...prev,
        entities: newEntities,
        inventory: newInventory,
        score: newScore,
      }
    })
  }

  const advanceTime = () => {
    // This function now just updates to the current real-world time
    updateTimeOfDay()
  }

  const interactWithNPC = (npcId: number) => {
    setGameState((prev) => {
      const npc = prev.npcs.find((n) => n.id === npcId)
      if (!npc) return prev

      // Check if player is close enough to interact
      const distance = Math.sqrt(
        Math.pow(npc.x - prev.playerPosition.x, 2) + Math.pow(npc.y - prev.playerPosition.y, 2),
      )

      if (distance > 2) return prev

      // Start dialog
      return {
        ...prev,
        dialog: {
          active: true,
          npc: npc,
          currentLine: 0,
        },
      }
    })
  }

  const advanceDialog = () => {
    setGameState((prev) => {
      if (!prev.dialog.active || !prev.dialog.npc) return prev

      const nextLine = prev.dialog.currentLine + 1

      // Check if we've reached the end of dialog
      if (nextLine >= prev.dialog.npc.dialog.length) {
        return {
          ...prev,
          dialog: { active: false, npc: null, currentLine: 0 },
        }
      }

      // Advance to next line
      return {
        ...prev,
        dialog: {
          ...prev.dialog,
          currentLine: nextLine,
        },
      }
    })
  }

  const closeDialog = () => {
    setGameState((prev) => ({
      ...prev,
      dialog: { active: false, npc: null, currentLine: 0 },
    }))
  }

  const saveGame = () => {
    localStorage.setItem("bugridge-save", JSON.stringify(gameState))
    alert("Game saved!")
  }

  const loadGame = () => {
    const savedGame = localStorage.getItem("bugridge-save")
    if (savedGame) {
      try {
        setGameState(JSON.parse(savedGame))
        alert("Game loaded!")
      } catch (e) {
        alert("Failed to load saved game")
      }
    } else {
      alert("No saved game found")
    }
  }

  const resetGame = () => {
    setGameState(defaultGameState)
    generateEntities()
  }

  // Improve the cleanupEntities function to be more aggressive
  const cleanupEntities = () => {
    setGameState((prev) => {
      // Filter out any caught entities or entities that are too far from the player
      const cleanedEntities = prev.entities.filter((entity) => {
        // Remove caught entities
        if (entity.caught) return false

        // Calculate distance from player
        const dx = entity.x - prev.globalPosition.x
        const dy = entity.y - prev.globalPosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Keep entities that are within a reasonable distance (50 units)
        return distance < 50
      })

      // Only update state if we actually removed something
      if (cleanedEntities.length !== prev.entities.length) {
        return {
          ...prev,
          entities: cleanedEntities,
        }
      }
      return prev
    })
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        movePlayer,
        moveDog,
        catchEntity,
        saveGame,
        loadGame,
        resetGame,
        advanceTime,
        interactWithNPC,
        advanceDialog,
        closeDialog,
        cleanupEntities,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
