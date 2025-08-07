#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_CONFIGS = {
  hero: {
    sizes: [
      { width: 640, suffix: '-sm' },
      { width: 1024, suffix: '-md' },
      { width: 1920, suffix: '-lg' },
      { width: 2560, suffix: '-xl' }
    ],
    formats: ['webp', 'jpg']
  },
  general: {
    sizes: [
      { width: 400, suffix: '-sm' },
      { width: 800, suffix: '-md' },
      { width: 1200, suffix: '-lg' }
    ],
    formats: ['webp', 'jpg']
  }
};

async function optimizeImage(inputPath, outputDir, config) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  for (const size of config.sizes) {
    for (const format of config.formats) {
      const outputPath = path.join(
        outputDir,
        `${filename}${size.suffix}.${format}`
      );
      
      try {
        await sharp(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .toFormat(format, {
            quality: format === 'webp' ? 85 : 80,
            progressive: true
          })
          .toFile(outputPath);
          
        console.log(`✓ Created: ${outputPath}`);
      } catch (error) {
        console.error(`✗ Failed to create ${outputPath}:`, error.message);
      }
    }
  }
  
  // Create a blurred placeholder
  const placeholderPath = path.join(outputDir, `${filename}-placeholder.jpg`);
  try {
    await sharp(inputPath)
      .resize(20)
      .blur(10)
      .toFormat('jpeg', { quality: 50 })
      .toFile(placeholderPath);
    console.log(`✓ Created placeholder: ${placeholderPath}`);
  } catch (error) {
    console.error(`✗ Failed to create placeholder:`, error.message);
  }
}

async function main() {
  const assetsDir = path.join(__dirname, '../src/assets');
  const optimizedDir = path.join(assetsDir, 'optimized');
  
  // Create optimized directory if it doesn't exist
  try {
    await fs.mkdir(optimizedDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create optimized directory:', error);
    return;
  }
  
  // Optimize hero image
  const heroImagePath = path.join(assetsDir, 'hero-nodes.jpg');
  if (await fs.access(heroImagePath).then(() => true).catch(() => false)) {
    console.log('Optimizing hero image...');
    await optimizeImage(heroImagePath, optimizedDir, IMAGE_CONFIGS.hero);
  }
  
  console.log('\nImage optimization complete!');
  console.log('Add the following to your package.json scripts:');
  console.log('"optimize-images": "node scripts/optimize-images.js"');
}

// Check if sharp is installed
try {
  require('sharp');
  main();
} catch (error) {
  console.error('Sharp is not installed. Run: npm install --save-dev sharp');
  process.exit(1);
}