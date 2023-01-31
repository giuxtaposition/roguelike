import { vi } from "vitest"

beforeAll(() => {
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(
        async () => {}
    )
})

afterAll(() => {
    vi.resetAllMocks()
})
