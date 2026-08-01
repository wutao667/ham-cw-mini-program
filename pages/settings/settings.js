const cwAudio = require('../../utils/cw-audio.js')

const app = getApp()

function timingFor(wpm) {
  const unitMs = Math.round(1200 / wpm)
  return {
    unitMs,
    dashMs: unitMs * 3,
    characterGapMs: unitMs * 3,
    wordGapMs: unitMs * 7,
  }
}

Page({
  data: {
    wpm: 15,
    frequency: 650,
    presets: [5, 10, 20, 30],
    unitMs: 80,
    dashMs: 240,
    characterGapMs: 240,
    wordGapMs: 560,
    isPreviewing: false,
  },

  onLoad() {
    const settings = app.globalData.cwSettings
    this.applySettings(settings.wpm, settings.frequency, false)
  },

  applySettings(wpm, frequency, shouldSave = true) {
    const timing = timingFor(wpm)
    this.setData({ wpm, frequency, ...timing })
    app.globalData.cwSettings = { wpm, frequency }
    if (shouldSave) wx.setStorageSync('cwSettings', { wpm, frequency })
  },

  changeWpm(event) {
    this.applySettings(Number(event.detail.value), this.data.frequency)
  },

  changeFrequency(event) {
    this.applySettings(this.data.wpm, Number(event.detail.value))
  },

  choosePreset(event) {
    this.applySettings(Number(event.currentTarget.dataset.wpm), this.data.frequency)
  },

  preview() {
    const duration = cwAudio.play('CQ', this.data)
    this.setData({ isPreviewing: true })
    setTimeout(() => this.setData({ isPreviewing: false }), duration)
  },

  onUnload() {
    cwAudio.stop()
  },
})
