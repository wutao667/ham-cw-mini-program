const { MORSE, normalizeMorseText } = require('./morse.js')

let audioContext = null
let activePlayback = null

function getContext() {
  if (!audioContext && wx.createWebAudioContext) {
    audioContext = wx.createWebAudioContext()
  }
  return audioContext
}

function release(playback, interrupt) {
  if (!playback || playback.released) return
  playback.released = true
  clearTimeout(playback.timer)
  playback.oscillator.onended = null
  if (interrupt) {
    const now = audioContext.currentTime
    playback.gain.gain.cancelScheduledValues(now)
    playback.gain.gain.setValueAtTime(0, now)
    try { playback.oscillator.stop(now) } catch (error) {}
  }
  // A completed old playback must never clear a newly started playback.
  if (activePlayback === playback) activePlayback = null
  try { playback.oscillator.disconnect() } catch (error) {}
  try { playback.gain.disconnect() } catch (error) {}
}

function stop() {
  release(activePlayback, true)
}

function positiveNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function play(text, options = {}) {
  stop()
  const content = normalizeMorseText(text)
  if (!content) return 0
  const context = getContext()
  if (!context) {
    wx.showToast({ title: '当前基础库不支持音频', icon: 'none' })
    return 0
  }

  if (context.state === 'suspended' && context.resume) context.resume()

  const wpm = positiveNumber(options.wpm, 15)
  const frequency = positiveNumber(options.frequency, 650)
  const unit = 1.2 / wpm
  const edge = Math.min(0.005, unit / 4)
  const startTime = context.currentTime
  let cursor = startTime + 0.08

  // One oscillator and one gain node per transmission, including long sentences.
  // Silence between elements is scheduled on the gain, not by allocating nodes.
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const playback = { oscillator, gain, timer: null, released: false }
  activePlayback = playback
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0, startTime)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.onended = () => release(playback, false)

  const words = content.split(' ')
  words.forEach((word, wordIndex) => {
    if (wordIndex > 0) cursor += unit * 7
    word.split('').forEach((char, charIndex) => {
      if (charIndex > 0) cursor += unit * 3
      MORSE[char].split('').forEach((symbol, symbolIndex) => {
        if (symbolIndex > 0) cursor += unit
        const duration = symbol === '.' ? unit : unit * 3
        gain.gain.setValueAtTime(0, cursor)
        gain.gain.linearRampToValueAtTime(0.26, cursor + edge)
        gain.gain.setValueAtTime(0.26, cursor + duration - edge)
        gain.gain.linearRampToValueAtTime(0, cursor + duration)
        cursor += duration
      })
    })
  })

  oscillator.start(startTime + 0.08)
  oscillator.stop(cursor + 0.01)
  const durationMs = (cursor - startTime) * 1000
  // Fallback for platforms that do not dispatch onended reliably. Check audio
  // time as well: wall-clock timers can run while the audio context is suspended.
  const cleanupWhenEnded = () => {
    if (playback.released) return
    if (context.currentTime >= cursor + 0.01) release(playback, false)
    else playback.timer = setTimeout(cleanupWhenEnded, 250)
  }
  playback.timer = setTimeout(cleanupWhenEnded, durationMs + 100)
  return durationMs
}

module.exports = { play, stop }
