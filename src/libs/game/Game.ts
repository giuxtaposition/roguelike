import { shuffle } from "../utils/utils"
import {
    type Enemy,
    CoolDuck,
    DogWithMustache,
    Black,
    Slime,
    OneEyedDemon,
} from "./entities/enemies"
import type { Entity } from "./entities/Entity"
import { Player } from "./entities/Player"

import Map from "./Map"

export default class Game {
    private level = 1
    private startingHealth = 3
    private maxHealth = 10
    private maxLevel = 6
    private map: Map
    private enemies: Entity[] = []
    private player: Player
    private spawnRate: number
    private spawnCounter: number
    private gameState = GameState.Loading

    public start() {
        this.level = 1
        this.startLevel(this.startingHealth)
        this.gameState = GameState.Running
    }

    public movePlayer(direction: Direction) {
        let moved = false
        switch (direction) {
            case Direction.UP:
                moved = this.player.tryToMove(
                    this.map.getTileAtDistanceXY(this.player.getTile(), 0, -1)
                )
                break
            case Direction.DOWN:
                moved = this.player.tryToMove(
                    this.map.getTileAtDistanceXY(this.player.getTile(), 0, 1)
                )
                break
            case Direction.LEFT:
                moved = this.player.tryToMove(
                    this.map.getTileAtDistanceXY(this.player.getTile(), -1, 0)
                )
                break
            case Direction.RIGHT:
                moved = this.player.tryToMove(
                    this.map.getTileAtDistanceXY(this.player.getTile(), 1, 0)
                )
                break
            default:
                break
        }

        if (moved) {
            this.tick()
        }
    }

    public getGameState() {
        return this.gameState
    }

    public setGameState(gameState: GameState) {
        this.gameState = gameState
    }

    public getPlayer() {
        return this.player
    }

    public getMap() {
        return this.map
    }

    public getEnemies() {
        return this.enemies
    }

    public getMaxHealth() {
        return this.maxHealth
    }

    public getLevel() {
        return this.getLevel()
    }

    public updateLevel() {
        this.level += 1
    }

    public getMaxLevel() {
        return this.maxLevel
    }

    public startLevel(playerHealth: number) {
        this.enemies = []
        this.spawnRate = 15
        this.spawnCounter = this.spawnRate
        this.generateLevel()
        this.player = new Player(this.map.getRandomPassableTile(), playerHealth)
    }

    private tick() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const currentEnemy = this.enemies[i]
            if (currentEnemy.getIsAlive()) {
                currentEnemy.update(
                    this.map.getAdjacentTiles(currentEnemy.getTile()),
                    this.player,
                    this.map.getTileAtDistanceXY.bind(this.map)
                )
            } else {
                this.removeEnemy(i)
            }
        }

        if (!this.player.getIsAlive()) {
            this.gameState = GameState.GameOver
        }

        this.spawnCounter--
        if (this.spawnCounter <= 0) {
            this.spawnEnemies()
            this.spawnCounter = this.spawnRate
            this.spawnRate--
        }
    }

    private removeEnemy(index: number) {
        this.enemies.splice(index, 1)
    }

    private generateLevel() {
        this.map = new Map()

        this.generateEnemies()
    }

    private generateEnemies() {
        let numberOfEnemies = this.level + 1

        for (let i = 0; i < numberOfEnemies; i++) {
            this.spawnEnemies()
        }
    }

    private spawnEnemies() {
        let enemyType = shuffle<Enemy>([
            CoolDuck,
            DogWithMustache,
            Black,
            Slime,
            OneEyedDemon,
        ])[0]

        this.enemies.push(new enemyType(this.map.getRandomPassableTile()))
    }
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export enum GameState {
    Title = "title",
    GameOver = "gameOver",
    Running = "running",
    Loading = "loading",
}
