import type { Tile } from "../../Tile"
import { Entity } from "../Entity"

export class CoolDuck extends Entity {
    constructor(tile: Tile) {
        super(tile, 4, 3)
    }
}
