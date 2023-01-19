export function tryTo(description: string, callback: () => any) {
    for (let timeout = 1000; timeout > 0; timeout--) {
        if (callback()) {
            return
        }
    }

    throw "Timeout while trying to " + description
}

export function randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffle<T>(array: Array<T>) {
    let temp: T, r: number

    for (let i = 1; i < array.length; i++) {
        r = randomRange(0, i)
        temp = array[i]
        array[i] = array[r]
        array[r] = temp
    }

    return array
}
