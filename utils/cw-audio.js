const { MORSE } = require('./morse.js')

let audioContext = null
let activeNodes = []
let playbackId = 0

function getContext() {
  if (!audioContext && wx.createWebAudioContext) {
    audioContext = wx.createWebAudioContext()
  }
  return audioContext
}

function stop() {
  playbackId += 1
  activeNodes.forEach(node => {
    try { node.stop() } catch (error) {}
  })
  activeNodes = []
}

function play(text, options = {}) {
  const context = getContext()
  if (!context) {
    wx.showToast({ title: '当前基础库不支持音频', icon: 'none' })
    return 0
  }

  stop()
  const currentPlaybackId = playbackId
  if (context.state === 'suspended' && context.resume) context.resume()

  const wpm = Number(options.wpm) || 15
  const frequency = Number(options.frequency) || 650
  const unit = 1.2 / wpm
  const content = text.toUpperCase().trim()
  let cursor = context.currentTime + 0.08

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index]
    if (char === ' ') continue
    const code = MORSE[char]
    if (!code) continue

    code.split('').forEach((symbol, symbolIndex) => {
      const duration = symbol === '.' ? unit : unit * 3
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0, cursor)
      gain.gain.linearRampToValueAtTime(0.26, cursor + 0.005)
      gain.gain.setValueAtTime(0.26, Math.max(cursor + 0.005, cursor + duration - 0.005))
      gain.gain.linearRampToValueAtTime(0, cursor + duration)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(cursor)
      oscillator.stop(cursor + duration + 0.01)
      activeNodes.push(oscillator)
      cursor += duration
      if (symbolIndex < code.length - 1) cursor += unit
    })

    let nextIndex = index + 1
    let hasWordGap = false
    while (content[nextIndex] === ' ') {
      hasWordGap = true
      nextIndex += 1
    }
    if (nextIndex < content.length) cursor += unit * (hasWordGap ? 7 : 3)
  }

  const durationMs = Math.max(0, (cursor - context.currentTime) * 1000)
  setTimeout(() => {
    if (playbackId === currentPlaybackId) activeNodes = []
  }, durationMs + 100)
  return durationMs
}

module.exports = { play, stop }
