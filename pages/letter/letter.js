const { CHARACTERS, MORSE, toDisplay } = require('../../utils/morse.js')
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
    cwAudio.stop()
  },
})
