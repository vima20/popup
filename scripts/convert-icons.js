const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];

async function convertSvgToPng(size) {
  const svgPath = path.join(__dirname, '..', 'public', `icon${size}.svg`);
  const pngPath = path.join(__dirname, '..', 'dist', `icon${size}.png`);

  const svgBuffer = fs.readFileSync(svgPath);
  
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(pngPath);

  console.log(`Converted icon${size}.svg to icon${size}.png`);
}

async function main() {
  // Create dist directory if it doesn't exist
  const distPath = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  // Convert all icons
  for (const size of sizes) {
    await convertSvgToPng(size);
  }
}

main().catch(console.error); 