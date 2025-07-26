#!/usr/bin/env node

import { EPUBConverter } from '../api/epubConverter';
import { config } from 'dotenv';

config();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: npm run convert-epub <input.epub> [--output output.json]');
    process.exit(1);
  }

  const inputPath = args[0];
  let outputPath = 'src/bilingual-content.json';

  const outputIndex = args.indexOf('--output');
  if (outputIndex > -1 && args[outputIndex + 1]) {
    outputPath = args[outputIndex + 1];
  }

  // Skip API key check for demo purposes
  // if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
  //   console.error('Error: Please set GEMINI_API_KEY or OPENAI_API_KEY environment variable');
  //   process.exit(1);
  // }

  try {
    console.log(`Converting ${inputPath} to bilingual JSON...`);
    
    const converter = new EPUBConverter();

    const onProgress = (progress: number) => {
      const barLength = 40;
      const filledLength = Math.round(barLength * (progress / 100));
      const emptyLength = barLength - filledLength;
      const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
      process.stdout.write(`\rTranslating: [${bar}] ${progress}%`);
    };

    const savedPath = await converter.saveBilingualJSON(inputPath, outputPath, {
      sourceLanguage: 'English',
      targetLanguage: 'Chinese',
      onProgress
    });

    process.stdout.write('\n'); // Newline after progress bar
    console.log(`✅ Successfully converted and saved to: ${savedPath}`);
    console.log(`📖 Content is ready for the bilingual reader!`);
    
  } catch (error) {
    console.error('❌ Error converting EPUB:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}