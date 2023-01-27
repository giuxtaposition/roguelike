import type { Black } from "./Black"
import type { CoolDuck } from "./CoolDuck"
import type { DogWithMustache } from "./DogWithMustache"
import type { OneEyedDemon } from "./OneEyedDemon"
import type { Slime } from "./Slime"

export * from "./CoolDuck"
export * from "./DogWithMustache"
export * from "./Black"
export * from "./Slime"
export * from "./OneEyedDemon"

export type Enemy =
    | typeof CoolDuck
    | typeof DogWithMustache
    | typeof Black
    | typeof Slime
    | typeof OneEyedDemon
