import { create } from "../promiseQueue.js"

export const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

describe("promise queue", () => {
  it("should run in order", async () => {
    const onPoll = jest.fn()

    const q = create({ onPoll })

    expect(onPoll).not.toHaveBeenCalled()
    onPoll.mockClear()

    const results = await Promise.all([
      q.enqueue(() => "a"),
      q.enqueue(() => "b"),
      q.enqueue(() => "c"),
    ])

    expect(onPoll).toHaveBeenCalledTimes(3)
    onPoll.mockClear()

    expect(results[0]).toBe("a")
    expect(results[1]).toBe("b")
    expect(results[2]).toBe("c")

    // Should not be polling when done
    await wait(200)
    expect(onPoll).not.toHaveBeenCalled()
  })
})
