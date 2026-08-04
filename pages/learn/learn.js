const { MORSE, CHARACTERS, toDisplay } = require('../../utils/morse.js')
const { getMnemonic } = require('../../utils/mnemonics.js')
const cwAudio = require('../../utils/cw-audio.js')

const app = getApp()
const toSpacedDisplay = code => toDisplay(code).split('').join('\u00A0')

Page({
  data: {
    characters: CHARACTERS.map(character => ({
      character,
      code: toSpacedDisplay(MORSE[character]),
    })),
    currentIndex: 0,
    current: {
      letter: 'A',
      code: '· —',
      isLetter: true,
      syllable: 'a-PART',
      visualSrc: '/assets/mnemonics-svg/A.svg',
    },
    wpm: 15,
    frequency: 650,
    isPlaying: false,
  },

  onShow() {
    const settings = app.globalData.cwSettings
    this.setData({ wpm: settings.wpm, frequency: settings.frequency })
  },

  selectLetter(event) {
    const index = Number(event.currentTarget.dataset.index)
    this.showLetter(index, true)
  },

  showLetter(index, shouldPlay) {
    const letter = CHARACTERS[index]
    const code = MORSE[letter]
    const mnemonic = getMnemonic(letter)
    this.setData({
      currentIndex: index,
      current: {
        letter,
        code: toDisplay(code).split('').join(' '),
        ...mnemonic,
      },
    })
    if (shouldPlay) this.playCurrent()
  },

  playCurrent() {
    const duration = cwAudio.play(this.data.current.letter, this.data)
    this.setData({ isPlaying: true })
    setTimeout(() => this.setData({ isPlaying: false }), duration)
  },

  onUnload() { cwAudio.stop() },
})
