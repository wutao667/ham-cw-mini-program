const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const morse = require('../utils/morse.js')

function harness(supported = true) {
  const oscillators = []
  const gains = []
  const timers = new Map()
  const toasts = []
  let nextTimer = 1
  const context = {
    currentTime: 10,
    destination: {},
    state: 'running',
    resume() { this.state = 'running' },
    createOscillator() {
      const node = {
        frequency: {}, stops: [], disconnected: 0,
        connect(destination) { this.destination = destination },
        disconnect() { this.disconnected += 1 },
        start(time) { this.started = time },
        stop(time) { this.stops.push(time) },
      }
      oscillators.push(node)
      return node
    },
    createGain() {
      const events = []
      const node = {
        events, disconnected: 0,
        connect(destination) { this.destination = destination },
        disconnect() { this.disconnected += 1 },
        gain: {
          setValueAtTime(value, time) { events.push({ kind: 'set', value, time }) },
          linearRampToValueAtTime(value, time) { events.push({ kind: 'ramp', value, time }) },
          cancelScheduledValues(time) { events.push({ kind: 'cancel', time }) },
        },
      }
      gains.push(node)
      return node
    },
  }
  const sandbox = {
    module: { exports: {} },
    require: () => morse,
    wx: {
      createWebAudioContext: supported ? () => context : undefined,
      showToast: toast => toasts.push(toast),
    },
    setTimeout(fn, delay) { const id = nextTimer++; timers.set(id, { fn, delay }); return id },
    clearTimeout(id) { timers.delete(id) },
  }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../utils/cw-audio.js'), 'utf8'), sandbox)
  return { audio: sandbox.module.exports, context, oscillators, gains, timers, toasts }
}

const close = (actual, expected) => assert(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`)
function pulses(gain) {
  const events = gain.events.slice(1)
  const result = []
  for (let index = 0; index < events.length; index += 4) {
    const envelope = events.slice(index, index + 4)
    assert.deepStrictEqual(envelope.map(event => event.value), [0, 0.26, 0.26, 0])
    assert(envelope.every((event, i) => !i || event.time >= envelope[i - 1].time))
    result.push({ start: envelope[0].time, end: envelope[3].time })
  }
  return result
}

// A E: dot, intra-character gap, dash, word gap, dot; no trailing gap.
for (const wpm of [5, 15, 60]) {
  const test = harness()
  const unit = 1.2 / wpm
  close(test.audio.play('  a \n\t E  ', { wpm, frequency: 750 }), 80 + 13 * unit * 1000)
  assert.strictEqual(test.oscillators.length, 1)
  assert.strictEqual(test.gains.length, 1)
  assert.strictEqual(test.oscillators[0].frequency.value, 750)
  const signal = pulses(test.gains[0])
  close(signal[0].end - signal[0].start, unit)
  close(signal[1].start - signal[0].end, unit)
  close(signal[1].end - signal[1].start, 3 * unit)
  close(signal[2].start - signal[1].end, 7 * unit)
  close(signal[2].end - signal[2].start, unit)
  test.audio.stop()
}
const letters = harness()
close(letters.audio.play('EE', { wpm: 15 }), 480)
const pair = pulses(letters.gains[0])
close(pair[1].start - pair[0].end, 0.24)
letters.audio.stop()

// Published ITU mappings, verified independently of the encoder's lookup table.
const punctuation = { '/': '-..-.', '?': '..--..', '.': '.-.-.-', ',': '--..--', '=': '-...-', '+': '.-.-.', '-': '-....-' }
Object.entries(punctuation).forEach(([character, expected]) => {
  assert.strictEqual(morse.MORSE[character], expected)
  const test = harness()
  test.audio.play(character, { wpm: 15 })
  const durations = pulses(test.gains[0]).map(signal => Math.round((signal.end - signal.start) / 0.08))
  assert.deepStrictEqual(durations, expected.split('').map(symbol => symbol === '.' ? 1 : 3))
  test.audio.stop()
})
assert.strictEqual(morse.CHARACTERS.join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
assert.strictEqual(morse.normalizeMorseText(' cq\n\tde  ba4vws/p '), 'CQ DE BA4VWS/P')
assert.strictEqual(morse.normalizeMorseText('CQ🙂DE'), 'CQ DE')
assert.strictEqual(morse.encode('E\n\t E'), '.     .')

// Long phrases stay at one oscillator/gain pair. Replacement silences and
// disconnects old nodes, even if an old ended/timer callback arrives late.
const long = harness()
const duration = long.audio.play('CQ CQ DE BA4VWS/P QTH NANJING RST 599 TNX FER QSO 73 '.repeat(4), { wpm: 5 })
assert(duration > 60000)
assert.strictEqual(long.oscillators.length, 1)
assert.strictEqual(long.gains.length, 1)
const oldEnded = long.oscillators[0].onended
const oldCleanup = Array.from(long.timers.values())[0].fn
long.context.currentTime += 1
long.audio.play('E')
assert.strictEqual(long.oscillators[0].disconnected, 1)
assert.strictEqual(long.gains[0].disconnected, 1)
assert.deepStrictEqual(long.gains[0].events.slice(-2), [
  { kind: 'cancel', time: 11 }, { kind: 'set', value: 0, time: 11 },
])
oldEnded()
oldCleanup()
assert.strictEqual(long.oscillators[1].disconnected, 0)
assert.strictEqual(long.timers.size, 1)
long.audio.stop()
long.audio.stop()
assert.strictEqual(long.oscillators[1].disconnected, 1)
assert.strictEqual(long.gains[1].disconnected, 1)
assert.strictEqual(long.timers.size, 0)

const ended = harness()
ended.audio.play('T')
ended.oscillators[0].onended()
assert.strictEqual(ended.oscillators[0].disconnected, 1)
assert.strictEqual(ended.gains[0].disconnected, 1)
assert.strictEqual(ended.timers.size, 0)

const fallback = harness()
fallback.audio.play('E')
const runTimer = () => {
  const [id, timer] = Array.from(fallback.timers.entries())[0]
  fallback.timers.delete(id)
  timer.fn()
}
runTimer() // Context has not advanced (for example app audio is suspended).
assert.strictEqual(fallback.oscillators[0].disconnected, 0)
assert.strictEqual(fallback.timers.size, 1)
fallback.context.currentTime = 20
runTimer()
assert.strictEqual(fallback.oscillators[0].disconnected, 1)
assert.strictEqual(fallback.timers.size, 0)

const empty = harness()
assert.strictEqual(empty.audio.play('  \t\n '), 0)
assert.strictEqual(empty.oscillators.length, 0)
const unsupported = harness(false)
assert.strictEqual(unsupported.audio.play('CQ'), 0)
assert.strictEqual(unsupported.toasts.length, 1)
console.log('CW audio: timing, punctuation, whitespace, bounded nodes, stop/replay and cleanup tests passed')
