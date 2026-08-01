const fs = require('fs')
const path = require('path')

const sharpModulePath = process.argv[2]
if (!sharpModulePath) throw new Error('Pass the absolute sharp module path as the first argument')
const sharp = require(sharpModulePath)

const source = path.resolve(__dirname, 'source/morse-visual-chart.png')
const outputDirectory = path.resolve(__dirname, '../assets/mnemonics')

// Tight glyph cells in the supplied 823 × 655 chart. Captions are excluded so
// neighboring letters cannot leak into an image.
const CELLS = {
  A: [50, 15, 100, 115], B: [155, 15, 95, 115], C: [250, 15, 120, 115],
  D: [380, 15, 100, 115], E: [490, 15, 105, 115], F: [600, 15, 95, 115],
  G: [700, 15, 120, 115],
  H: [50, 165, 100, 130], I: [160, 165, 70, 130], J: [235, 165, 105, 130],
  K: [350, 165, 130, 130], L: [485, 165, 105, 130], M: [600, 165, 80, 130],
  N: [690, 165, 80, 130],
  O: [40, 330, 110, 115], P: [150, 330, 100, 115], Q: [250, 330, 125, 115],
  R: [380, 330, 115, 115], S: [500, 330, 90, 115], T: [600, 330, 100, 115],
  U: [45, 470, 100, 135], V: [150, 470, 110, 135], W: [270, 470, 115, 135],
  X: [395, 470, 115, 135], Y: [525, 470, 115, 135], Z: [650, 470, 130, 135],
}

fs.mkdirSync(outputDirectory, { recursive: true })

async function cropAll() {
  for (const [letter, [left, top, width, height]] of Object.entries(CELLS)) {
    const cellBuffer = await sharp(source)
      .extract({ left, top, width, height })
      .toBuffer()

    await sharp(cellBuffer)
      .trim({ background: '#ffffff', threshold: 18 })
      .resize({ width: 240, height: 190, fit: 'contain', background: '#ffffff' })
      .extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#ffffff' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(outputDirectory, `${letter}.png`))
  }
  console.log(`Generated ${Object.keys(CELLS).length} independent mnemonic PNG files`)
}

cropAll().catch(error => {
  console.error(error)
  process.exitCode = 1
})
