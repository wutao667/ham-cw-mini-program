const fs = require('fs')
const path = require('path')

const outputDirectory = path.resolve(__dirname, '../assets/mnemonics-svg')
const pale = '#d5d8d5'
const dark = '#101713'

const MORSE = {
  F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-',
  L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-',
  R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--',
  X: '-..-', Y: '-.--', Z: '--..',
}

const DESIGNS = {
  F: {
    skeleton: '<path d="M62 29 V181 M62 31 H199 M62 105 H171"/>',
    marks: '<circle class="dot" cx="63" cy="31" r="12"/><circle class="dot" cx="151" cy="31" r="12"/><path class="dash" d="M63 65 V145"/><circle class="dot" cx="145" cy="105" r="12"/>',
  },
  G: {
    skeleton: '<path d="M194 49 C174 30 149 24 119 28 C72 34 45 65 45 105 C45 150 76 181 122 183 C156 184 181 172 196 151 V111 H143"/>',
    marks: '<path class="dash" d="M49 75 V136"/><path class="dash" d="M82 179 H144"/><circle class="dot" cx="192" cy="112" r="12"/>',
  },
  H: {
    skeleton: '<path d="M62 29 V181 M198 29 V181 M62 105 H198"/>',
    marks: '<circle class="dot" cx="62" cy="33" r="12"/><circle class="dot" cx="62" cy="177" r="12"/><circle class="dot" cx="198" cy="33" r="12"/><circle class="dot" cx="198" cy="177" r="12"/>',
  },
  I: {
    skeleton: '<path d="M130 29 V181 M82 31 H178 M82 179 H178"/>',
    marks: '<circle class="dot" cx="130" cy="31" r="12"/><circle class="dot" cx="130" cy="179" r="12"/>',
  },
  J: {
    skeleton: '<path d="M180 28 V137 C180 165 159 181 126 181 H98 C76 181 62 169 62 151"/>',
    marks: '<circle class="dot" cx="62" cy="151" r="12"/><path class="dash" d="M89 181 H170"/><path class="dash" d="M180 104 V158"/><path class="dash" d="M180 35 V82"/>',
  },
  K: {
    skeleton: '<path d="M62 29 V181 M190 31 L64 105 L190 181"/>',
    marks: '<path class="dash" d="M172 42 L93 89"/><circle class="dot" cx="68" cy="105" r="12"/><path class="dash" d="M93 121 L172 168"/>',
  },
  L: {
    skeleton: '<path d="M62 29 V179 H201"/>',
    marks: '<circle class="dot" cx="62" cy="32" r="12"/><path class="dash" d="M62 67 V143"/><circle class="dot" cx="62" cy="178" r="12"/><circle class="dot" cx="191" cy="179" r="12"/>',
  },
  M: {
    skeleton: '<path d="M45 181 V30 L130 111 L215 30 V181"/>',
    marks: '<path class="dash" d="M45 45 V166"/><path class="dash" d="M215 45 V166"/>',
  },
  N: {
    skeleton: '<path d="M50 181 V30 L210 181 V30"/>',
    marks: '<path class="dash" d="M50 45 V166"/><circle class="dot" cx="210" cy="178" r="12"/>',
  },
  O: {
    skeleton: '<ellipse cx="130" cy="105" rx="82" ry="78"/>',
    marks: '<path class="dash" d="M50 71 V138"/><path class="dash" d="M210 71 V138"/><path class="dash" d="M96 181 H164"/>',
  },
  P: {
    skeleton: '<path d="M62 181 V29 H130 C171 29 193 53 193 83 C193 113 171 136 130 136 H62"/>',
    marks: '<circle class="dot" cx="62" cy="44" r="12"/><path class="dash" d="M95 30 H151"/><path class="dash" d="M94 136 H151"/><circle class="dot" cx="190" cy="85" r="12"/>',
  },
  Q: {
    skeleton: '<ellipse cx="126" cy="101" rx="79" ry="74"/><path d="M151 145 L207 188"/>',
    marks: '<path class="dash" d="M78 42 C59 57 49 78 49 101"/><path class="dash" d="M203 82 C207 106 201 127 190 143"/><circle class="dot" cx="174" cy="160" r="12"/><path class="dash" d="M153 171 C127 180 91 176 70 155"/>',
  },
  R: {
    skeleton: '<path d="M62 181 V29 H130 C171 29 193 53 193 83 C193 113 171 136 130 136 H62 M130 136 L195 183"/>',
    marks: '<circle class="dot" cx="62" cy="176" r="12"/><path class="dash" d="M91 136 H153"/><circle class="dot" cx="193" cy="181" r="12"/>',
  },
  S: {
    skeleton: '<path d="M190 42 C165 22 90 18 67 55 C45 91 82 105 130 106 C178 107 215 121 193 157 C170 194 95 190 70 169"/>',
    marks: '<circle class="dot" cx="130" cy="32" r="12"/><circle class="dot" cx="130" cy="105" r="12"/><circle class="dot" cx="130" cy="178" r="12"/>',
  },
  T: {
    skeleton: '<path d="M43 31 H217 M130 31 V181"/>',
    marks: '<path class="dash" d="M63 31 H197"/>',
  },
  U: {
    skeleton: '<path d="M54 29 V126 C54 164 82 184 130 184 C178 184 206 164 206 126 V29"/>',
    marks: '<circle class="dot" cx="54" cy="32" r="12"/><circle class="dot" cx="206" cy="32" r="12"/><path class="dash" d="M94 181 H166"/>',
  },
  V: {
    skeleton: '<path d="M43 30 L130 165 L217 30"/>',
    marks: '<circle class="dot" cx="43" cy="33" r="12"/><circle class="dot" cx="217" cy="33" r="12"/><circle class="dot" cx="130" cy="164" r="12"/><path class="dash" d="M70 190 H190"/>',
  },
  W: {
    skeleton: '<path d="M20 30 L75 181 L130 30 L185 181 L240 30"/>',
    marks: '<circle class="dot" cx="20" cy="33" r="12"/><path class="dash" d="M84 160 L122 55"/><path class="dash" d="M194 160 L232 55"/>',
  },
  X: {
    skeleton: '<path d="M48 30 L212 181 M212 30 L48 181"/>',
    marks: '<path class="dash" d="M58 39 L110 88"/><circle class="dot" cx="143" cy="92" r="12"/><circle class="dot" cx="117" cy="118" r="12"/><path class="dash" d="M150 124 L202 172"/>',
  },
  Y: {
    skeleton: '<path d="M43 30 L130 108 L217 30 M130 108 V181"/>',
    marks: '<path class="dash" d="M54 40 L108 89"/><circle class="dot" cx="130" cy="108" r="12"/><path class="dash" d="M152 89 L206 40"/><path class="dash" d="M130 128 V174"/>',
  },
  Z: {
    skeleton: '<path d="M43 31 H217 L48 179 H217"/>',
    marks: '<path class="dash" d="M61 31 H199"/><path class="dash" d="M184 60 L112 123"/><circle class="dot" cx="67" cy="162" r="12"/><circle class="dot" cx="202" cy="179" r="12"/>',
  },
}

function count(source, className) {
  return (source.match(new RegExp(`class="${className}"`, 'g')) || []).length
}

fs.mkdirSync(outputDirectory, { recursive: true })

Object.entries(DESIGNS).forEach(([letter, design]) => {
  const code = MORSE[letter]
  const expectedDots = (code.match(/\./g) || []).length
  const expectedDashes = (code.match(/-/g) || []).length
  if (count(design.marks, 'dot') !== expectedDots || count(design.marks, 'dash') !== expectedDashes) {
    throw new Error(`Morse mark count mismatch for ${letter}`)
  }

  const skeleton = design.skeleton.replaceAll('/>', ` fill="none" stroke="${pale}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>`)
  const marks = design.marks
    .replaceAll('class="dot"', `class="dot" fill="${dark}"`)
    .replaceAll('class="dash"', `class="dash" fill="none" stroke="${dark}" stroke-width="20" stroke-linecap="round"`)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="210" viewBox="0 0 260 210" role="img" aria-label="Morse mnemonic ${letter}">
  <rect width="260" height="210" rx="20" fill="#fffdf8"/>
  ${skeleton}
  ${marks}
</svg>
`
  fs.writeFileSync(path.join(outputDirectory, `${letter}.svg`), svg, 'utf8')
})

console.log(`Generated and validated ${Object.keys(DESIGNS).length} mnemonic SVG files (F-Z)`)
