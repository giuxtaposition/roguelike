import type { Subscriber, Unsubscriber } from "svelte/store"
import { localStore } from "./localStorage"

export interface ScoreObject {
    score: number
    run: number
    totalScore: number
    active: boolean
}

export interface scoreStore {
    set: (scoreObjList: ScoreObject[]) => void
    get: () => ScoreObject[]
    subscribe: (this: void, run: Subscriber<any>) => Unsubscriber
}

export const scores: scoreStore = localStore("scores", [])
