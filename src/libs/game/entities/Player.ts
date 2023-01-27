import type { Tile } from "../Tile"
import { Entity } from "./Entity"

export class Player extends Entity {
    constructor(tile: Tile) {
        super(tile, 0, 3)
        this.isPlayer = true
    }
}
