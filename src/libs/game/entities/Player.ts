import type { Tile } from "../Tile"
import { Entity } from "./Entity"

export class Player extends Entity {
    constructor(tile: Tile, health: number) {
        super(tile, 0, health)
        this.isPlayer = true
    }
}
