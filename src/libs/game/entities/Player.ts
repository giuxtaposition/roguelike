import { playSound } from "../../stores/sounds"
import { shuffle } from "../../utils/utils"

import { SpellFactory, SpellName, type Spell } from "../Spell"
import type { Tile } from "../Tile"
import { Entity } from "./Entity"
import type Map from "../Map"

export class Player extends Entity {
    protected _isPlayer = true
    private _spells: Spell[] = []
    private numSpells: number = 1

    constructor(tile: Tile, health: number) {
        super(tile, 0, health)

        const spellNames = shuffle(Object.values(SpellName)).splice(
            0,
            this.numSpells
        )
        this.addSpells(spellNames)
    }

    public castSpell(index: number, map: Map, player: Player) {
        let spellName = this._spells[index]
        if (spellName) {
            this._spells[index].castSpell(map, player)
            delete this._spells[index]
            playSound("spell")
        }
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
