import type Game from "./Game"

export enum SpellName {
    HEALING_AURA = "Healing Aura",
    TELEPORT = "Teleport",
}

export abstract class Spell {
    protected _spellName: SpellName

    public castSpell(game: Game) {}

    public get spellName(): string {
        return this._spellName
    }
}

export class SpellFactory {
    public static newSpell(spellName: SpellName) {
        switch (spellName) {
            case SpellName.HEALING_AURA:
                return new HealingAura()
            case SpellName.TELEPORT:
                return new Teleport()
            default:
                break
        }
    }
}

export class HealingAura extends Spell {
    protected _spellName = SpellName.HEALING_AURA

    public castSpell(game: Game) {
        game.map.getAdjacentTiles(game.player.tile).forEach(tile => {
            tile.effect = 13
            if (tile.entity) {
                tile.entity.receiveHealth(1)
            }
        })

        game.player.tile.effect = 13
        game.player.receiveHealth(1)
    }
}

export class Teleport extends Spell {
    protected _spellName = SpellName.TELEPORT

    public castSpell(game: Game) {
        game.tryToMovePlayer(game.map.getRandomPassableTile())
    }
}
