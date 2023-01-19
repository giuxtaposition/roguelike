export class Tile {
    x: number
    y: number
    sprite: number
    passable: boolean

    constructor(x: number, y: number, sprite: number, passable: boolean) {
        this.x = x
        this.y = y
        this.sprite = sprite
        this.passable = passable
    }
}

export class Floor extends Tile {
    constructor(x: number, y: number) {
        super(x, y, 2, true)
    }
}

export class Wall extends Tile {
    constructor(x: number, y: number) {
        super(x, y, 3, false)
    }
}
