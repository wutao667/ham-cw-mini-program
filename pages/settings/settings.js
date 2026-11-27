const cwAudio = require('../../utils/cw-audio.js')

const app = getApp()

Page({
  data: {
    wpm: 15,
    frequency: 650,
    effectiveWpm: 15,
    presets: [5, 10, 15, 20, 25, 30],
    unitMs: 80,
    dashMs: 240,
    characterGapMs: 240,
    wordGapMs: 560,
    characterGapUnits: 3,
    wordGapUnits: 7,
    isPreviewing: false,
  },

  onLoad() {
    const settings = app.globalData.cwSettings
    this.applySettings(settings.wpm, settings.frequency, settings.effectiveWpm || settings.wpm, false)
  },

  applySettings(wpm, frequency, requestedEffectiveWpm, shouldSave = true) {
    const effectiveWpm = Math.min(wpm, Math.max(5, requestedEffectiveWpm))
    const { unit, characterGap, wordGap } = cwAudio.timingFor(wpm, effectiveWpm)
    this.setData({
      wpm, frequency, effectiveWpm,
      unitMs: Math.round(unit * 1000),
      dashMs: Math.round(unit * 3000),
      characterGapMs: Math.round(characterGap * 1000),
      wordGapMs: Math.round(wordGap * 1000),
      characterGapUnits: Number((characterGap / unit).toFixed(2)),
      wordGapUnits: Number((wordGap / unit).toFixed(2)),
    })
    app.globalData.cwSettings = { wpm, frequency, effectiveWpm }
    if (shouldSave) wx.setStorageSync('cwSettings', app.globalData.cwSettings)
  },

  changeEffectiveWpm(event) {
    this.applySettings(this.data.wpm, this.data.frequency, Number(event.detail.value))
  },

  changeCharacterSpeed(wpm) {
    const effective = this.data.effectiveWpm === this.data.wpm ? wpm : this.data.effectiveWpm
    this.applySettings(wpm, this.data.frequency, effective)
  },

  changeWpm(event) {
    this.changeCharacterSpeed(Number(event.detail.value))
  },

  changeFrequency(event) {
    this.applySettings(this.data.wpm, Number(event.detail.value), this.data.effectiveWpm)
  },

  choosePreset(event) {
    this.changeCharacterSpeed(Number(event.currentTarget.dataset.wpm))
  },

  preview() {
    const duration = cwAudio.play('CQ CQ', this.data)
    this.setData({ isPreviewing: true })
    setTimeout(() => this.setData({ isPreviewing: false }), duration)
  },

  onUnload() {
    cwAudio.stop()
  },
})
