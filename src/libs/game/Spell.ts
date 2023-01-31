import type { Player } from "./entities/Player"
import type Map from "./Map"

export enum SpellName {
    HEALING_AURA = "Healing Aura",
}

export abstract class Spell {
    protected _spellName: SpellName

    public castSpell(map: Map, player: Player) {}

    public get spellName(): string {
        return this._spellName
    }
}

export class SpellFactory {
    public static newSpell(spellName: SpellName) {
        switch (spellName) {
            case SpellName.HEALING_AURA:
                return new HealingAura()
            default:
                break
        }
    }
}

export class HealingAura extends Spell {
    protected _spellName = SpellName.HEALING_AURA

    public castSpell(map: Map, player: Player) {
        map.getAdjacentTiles(player.tile).forEach(tile => {
            tile.effect = 13
            if (tile.entity) {
                tile.entity.receiveHealth(1)
            }
        })

        player.tile.effect = 13
        player.receiveHealth(1)
    }
}
