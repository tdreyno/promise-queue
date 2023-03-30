type Fn = (...args: any[]) => any

export const create = ({
  pollMs = 32,
  startImmediately = false,
  pauseWhenEmpty = true,
  onPoll = () => void 0,
} = {}) => {
  const queue: Array<[Fn, (result: any) => void]> = []

  const enqueue = <F extends Fn>(fn: F): Promise<ReturnType<F>> => {
    return new Promise(resolve => {
      queue.push([fn, resolve])

      if (!isRunning && queue.length == 1 && pauseWhenEmpty) {
        start()
      }
    })
  }

  let isRunning = false

  const poll = () => {
    if (!isRunning) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      onPoll()

      const item = queue.shift()

      if (item) {
        // execute
        const [fn, resolve] = item

        resolve(await fn())
      }

      if (!isRunning) {
        return
      }

      if (pauseWhenEmpty && queue.length === 0) {
        stop()
        return
      }

      poll()
    }, pollMs)
  }

  const start = () => {
    if (isRunning) {
      return
    }

    isRunning = true

    poll()
  }

  const stop = () => {
    isRunning = false
  }

  if (startImmediately) {
    start()
  }

  return {
    enqueue,
    start,
    stop,
    isRunning: () => isRunning,
  }
}
