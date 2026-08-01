const cwAudio = require('../../utils/cw-audio.js')

const app = getApp()

const WORD_BANK = {
  2: ['CQ', 'DE', 'DX', 'HI', 'OK', 'WX'],
  3: ['HAM', 'RST', 'QTH', 'KEY', 'RIG', 'ANT', 'WPM'],
  4: ['CALL', 'CODE', 'NAME', 'TONE', 'WAVE', 'COPY', 'SEND', 'TEST', 'BAND'],
  5: ['RADIO', 'MORSE', 'POWER', 'HELLO', 'NOISE', 'SPEED', 'WORLD'],
  6: ['SIGNAL', 'LISTEN', 'TUNING', 'KEYING', 'STATIC', 'REPEAT'],
  7: ['ANTENNA', 'STATION', 'RECEIVE', 'CONTACT', 'MESSAGE', 'OPERATE'],
  8: ['OPERATOR', 'WIRELESS', 'PRACTICE', 'RECEIVER', 'TRANSMIT'],
}

Page({
  data: {
    letterCount: 3,
    wpm: 12,
    frequency: 650,
    hasQuestion: false,
    answer: '',
    inputValue: '',
    revealed: false,
    isCorrect: false,
    questionCount: 0,
    correctCount: 0,
    accuracy: 0,
    counted: false,
  },

  onShow() {
    const settings = app.globalData.cwSettings
    this.setData({ wpm: settings.wpm, frequency: settings.frequency })
  },

  changeLetterCount(event) {
    this.setData({
      letterCount: Number(event.detail.value),
      hasQuestion: false,
      answer: '',
      inputValue: '',
      revealed: false,
      isCorrect: false,
      counted: false,
    })
    cwAudio.stop()
  },

  randomPlay() {
    const pool = WORD_BANK[this.data.letterCount]
    let answer = pool[Math.floor(Math.random() * pool.length)]
    if (pool.length > 1 && answer === this.data.answer) {
      answer = pool[(pool.indexOf(answer) + 1) % pool.length]
    }

    this.setData({
      hasQuestion: true,
      answer,
      inputValue: '',
      revealed: false,
      isCorrect: false,
      counted: false,
    })
    setTimeout(() => this.playCurrent(), 120)
  },

  replay() {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先生成并播放单词', icon: 'none' })
      return
    }
    this.playCurrent()
  },

  playCurrent() {
    cwAudio.play(this.data.answer, this.data)
  },

  onInput(event) {
    const inputValue = event.detail.value
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, this.data.letterCount)

    this.setData({
      inputValue,
      isCorrect: this.data.revealed && inputValue === this.data.answer,
    })
  },

  revealAnswer() {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先生成并播放单词', icon: 'none' })
      return
    }
    const isCorrect = this.data.inputValue === this.data.answer
    this.setData({
      revealed: true,
      isCorrect,
      ...this.resultUpdate(isCorrect),
    })
  },

  resultUpdate(isCorrect) {
    if (this.data.counted) return {}
    const questionCount = this.data.questionCount + 1
    const correctCount = this.data.correctCount + (isCorrect ? 1 : 0)
    return {
      questionCount,
      correctCount,
      accuracy: Math.round((correctCount / questionCount) * 100),
      counted: true,
    }
  },

  onUnload() {
    cwAudio.stop()
  },
})
