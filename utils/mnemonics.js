const SYLLABIC_MNEMONICS = {
  A: 'a-PART',
  B: 'BOB is the man',
  C: 'CO-ca CO-la',
  D: 'DOG did it',
  E: 'eh?',
  F: 'fetch a FIRE-man',
  G: 'GOOD GRAV-y',
  H: 'hip-i-ty hop',
  I: 'i-bid',
  J: 'in JAWS JAWS JAWS',
  K: 'KANG-a-ROO',
  L: 'los AN-ge-les',
  M: 'MMMM-MMMM',
  N: 'NU-dist',
  O: 'OH-MY-GOD',
  P: 'a-POOP-Y-smell',
  Q: 'GOD SAVE the QUEEN',
  R: 'ro-TAT-ion',
  S: 'si-si-si',
  T: 'TALL',
  U: 'u-ni-FORM',
  V: 'vic-tor-y VEE',
  W: 'the WORLD WAR',
  X: 'X-marks-the-SPOT',
  Y: "YOU'RE a COOL DUDE",
  Z: 'ZINC ZOO-kee-per',
}

function digitMnemonic(character) {
  const value = Number(character)
  if (value === 0) return '5 划'
  if (value <= 5) return `${value} 点 · ${5 - value} 划`
  return `${10 - value} 划 · ${value - 5} 点`
}

function getMnemonic(character) {
  const isLetter = Boolean(SYLLABIC_MNEMONICS[character])
  return {
    isLetter,
    syllable: isLetter ? SYLLABIC_MNEMONICS[character] : digitMnemonic(character),
    visualSrc: isLetter ? `/assets/mnemonics-svg/${character}.svg` : '',
  }
}

module.exports = { SYLLABIC_MNEMONICS, getMnemonic }
