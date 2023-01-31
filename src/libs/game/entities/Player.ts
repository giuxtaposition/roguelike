import { playSound } from "../../stores/sounds"
import { shuffle } from "../../utils/utils"

import { SpellFactory, SpellName, type Spell } from "../Spell"
import type { Tile } from "../Tile"
import { Entity } from "./Entity"
import type Game from "../Game"

export class Player extends Entity {
    protected _isPlayer = true
    private _spells: Spell[] = []
    private _numberOfSpells: number = 1

    constructor(tile: Tile, health: number) {
        super(tile, 0, health)

        const spellNames = shuffle(Object.values(SpellName)).splice(
            0,
            this._numberOfSpells
        )
        this.addSpells(spellNames)
    }

    public castSpell(index: number, game: Game) {
        let spellName = this._spells[index]
        if (spellName) {
            this._spells[index].castSpell(game)
            delete this._spells[index]
            playSound("spell")
        }
    }

    public addRandomSpell() {
        this.addSpells(shuffle(Object.values(SpellName)).slice(0, 1))
    }

    public set numberOfSpells(numberOfSpells: number) {
        this._numberOfSpells = numberOfSpells
    }

    public get numberOfSpells() {
        return this._numberOfSpells
    }

    public get spells() {
        return this._spells
    }

    public get spellNames() {
        return this._spells.map(spell => spell.spellName)
    }

    private addSpells(spellNames: SpellName[]) {
        spellNames.forEach(spellName => {
            this._spells.push(SpellFactory.newSpell(spellName))
        })
    }
}
