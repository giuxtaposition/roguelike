import { get, writable } from "svelte/store"

export const sounds = writable({
    hit1: new Audio("sounds/hit1.wav"),
    hit2: new Audio("sounds/hit2.mp3"),
    treasure: new Audio("sounds/treasure.wav"),
    newLevel: new Audio("sounds/newLevel.wav"),
    spell: new Audio("sounds/spell.wav"),
})

export function playSound(soundName: string) {
    const sound = get(sounds)[soundName]
    sound.currentTime = 0
    sound.play()
}
