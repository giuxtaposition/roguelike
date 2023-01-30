import { get, writable } from "svelte/store"

export const localStore = (key: string, initial: any) => {
    const toString = (value: any) => JSON.stringify(value, null, 2)
    const toObj = JSON.parse

    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, toString(initial))
    }

    const saved = toObj(localStorage.getItem(key))

    const store = writable(saved)

    return {
        subscribe: store.subscribe,
        set: (value: any) => {
            localStorage.setItem(key, toString(value))
            return store.set(value)
        },
        update: store.update,
        get: () => get(store),
    }
}
