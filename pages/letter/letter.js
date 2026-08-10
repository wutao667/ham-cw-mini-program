const { CHARACTERS, MORSE, toDisplay } = require('../../utils/morse.js')
const { addLetterScore } = require('../../utils/score-history.js')
const cwAudio = require('../../utils/cw-audio.js')

const app = getApp()
const toAnswerDisplay = code => (
  toDisplay(code).replace(/—/g, '–').split('').join('\u00A0')
)
const QUICK_CHARACTERS = CHARACTERS.map(character => ({
  character,
  errorCount: 0,
}))

Page({
  data: {
    quickCharacters: QUICK_CHARACTERS,
    wpm: 15,
    frequency: 650,
    hasQuestion: false,
    answer: '',
    answerCode: '',
    inputValue: '',
    inputCode: '',
    revealed: false,
    isCorrect: false,
    questionCount: 0,
    correctCount: 0,
    accuracy: 0,
    averageTime: '0.0',
    counted: false,
  },

  onShow() {
    const settings = app.globalData.cwSettings
    this.setData({ wpm: settings.wpm, frequency: settings.frequency })
  },

  randomPlay() {
    if (this.autoNextTimer) {
      clearTimeout(this.autoNextTimer)
      this.autoNextTimer = null
    }
    this.startSessionTimer()

    let answer = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    if (CHARACTERS.length > 1 && answer === this.data.answer) {
      answer = CHARACTERS[(CHARACTERS.indexOf(answer) + 1) % CHARACTERS.length]
    }

    this.setData({
      hasQuestion: true,
      answer,
      answerCode: toAnswerDisplay(MORSE[answer]),
      inputValue: '',
      inputCode: '',
      revealed: false,
      isCorrect: false,
      counted: false,
    })
    setTimeout(() => this.playCurrent(), 120)
  },

  replay() {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先点击随机播放', icon: 'none' })
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
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 1)

    this.setData({
      inputValue,
      inputCode: inputValue ? toAnswerDisplay(MORSE[inputValue]) : '',
      isCorrect: this.data.revealed && inputValue === this.data.answer,
    })
  },

  revealAnswer() {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先点击随机播放', icon: 'none' })
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
    const update = {
      questionCount,
      correctCount,
      accuracy: Math.round((correctCount / questionCount) * 100),
      averageTime: this.calculateAverageTime(correctCount),
      counted: true,
    }

    if (!isCorrect) {
      update.quickCharacters = this.data.quickCharacters.map(item => (
        item.character === this.data.answer
          ? { ...item, errorCount: item.errorCount + 1 }
          : item
      ))
    }

    return update
  },

  startSessionTimer() {
    if (this.sessionStartTime) return
    this.sessionStartTime = Date.now()
    this.averageTimer = setInterval(() => this.updateAverageTime(), 100)
  },

  calculateAverageTime(correctCount = this.data.correctCount) {
    if (!this.sessionStartTime || correctCount === 0) return '0.0'
    const elapsedSeconds = (Date.now() - this.sessionStartTime) / 1000
    return (elapsedSeconds / correctCount).toFixed(1)
  },

  updateAverageTime() {
    const averageTime = this.calculateAverageTime()
    if (averageTime !== this.data.averageTime) this.setData({ averageTime })
  },

  recordScore() {
    if (this.data.questionCount === 0) {
      wx.showToast({ title: '请先完成至少一题', icon: 'none' })
      return
    }

    const averageTime = this.calculateAverageTime()
    const recordedAt = Date.now()
    try {
      addLetterScore({
        recordedAt,
        questionCount: this.data.questionCount,
        correctCount: this.data.correctCount,
        accuracy: this.data.accuracy,
        averageTime: Number(averageTime),
      })
      this.setData({ averageTime })
      wx.showToast({ title: '成绩已记录', icon: 'success' })
    } catch (error) {
      wx.showToast({ title: '记录失败，请稍后重试', icon: 'none' })
    }
  },

  openHistory() {
    wx.navigateTo({ url: '/pages/history/history' })
  },

  quickInput(event) {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先点击随机播放', icon: 'none' })
      return
    }

    if (this.autoNextTimer) {
      clearTimeout(this.autoNextTimer)
      this.autoNextTimer = null
    }

    const inputValue = event.currentTarget.dataset.character
    const isCorrect = inputValue === this.data.answer
    this.setData({
      inputValue,
      inputCode: toAnswerDisplay(MORSE[inputValue]),
      revealed: true,
      isCorrect,
      ...this.resultUpdate(isCorrect),
    })

    if (isCorrect) {
      this.autoNextTimer = setTimeout(() => {
        this.autoNextTimer = null
        this.randomPlay()
      }, 600)
    }
  },

  onUnload() {
    if (this.autoNextTimer) clearTimeout(this.autoNextTimer)
    if (this.averageTimer) clearInterval(this.averageTimer)
    this.averageTimer = null
    this.sessionStartTime = null
    cwAudio.stop()
  },
})
