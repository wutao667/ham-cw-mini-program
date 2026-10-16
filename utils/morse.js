const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  // ITU-R M.1677-1: punctuation used by callsigns and QSO exchanges.
  '/': '-..-.', '?': '..--..', '.': '.-.-.-', ',': '--..--',
  '=': '-...-', '+': '.-.-.', '-': '-....-',
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const DIGITS = '0123456789'.split('')
const CHARACTERS = LETTERS.concat(DIGITS)

const WORDS = [
  'CQ', 'DE', 'HAM', 'RADIO', 'CODE', 'MORSE', 'CALL', 'SIGNAL',
  'ANTENNA', 'POWER', 'HELLO', 'THANKS', 'NAME', 'QTH', 'RST', 'WX',
]

function toDisplay(code) {
  return code.replace(/\./g, '·').replace(/-/g, '—')
}

function encode(text) {
  return normalizeMorseText(text)
    .split(' ')
    .map(word => word.split('').map(char => MORSE[char] || '').filter(Boolean).join('  '))
    .join('     ')
}

function normalizeMorseText(text) {
  // Unsupported characters are word separators; never join the words around them.
  return String(text == null ? '' : text).toUpperCase().split('')
    .map(char => Object.prototype.hasOwnProperty.call(MORSE, char) ? char : ' ')
    .join('').replace(/\s+/g, ' ').trim()
}

function describe(code) {
  const dots = (code.match(/\./g) || []).length
  const dashes = (code.match(/-/g) || []).length
  return `${code.length} 个信号 · ${dots} 点 ${dashes} 划`
}

module.exports = { MORSE, LETTERS, DIGITS, CHARACTERS, WORDS, toDisplay, encode, describe, normalizeMorseText }
