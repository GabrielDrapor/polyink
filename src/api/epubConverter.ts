// EPUB Converter API for production use
import { EPUBParser } from '../utils/epubParser';
import { LLMTranslator } from '../utils/llmTranslator';
import * as fs from 'fs';

export interface BilingualContent {
  id: string;
  original: string;
  translated: string;
  type: 'title' | 'chapter' | 'paragraph';
}

export interface ConversionOptions {
  sourceLanguage?: string;
  targetLanguage?: string;
  model?: string;
  onProgress?: (progress: number) => void;
}

export class EPUBConverter {
  async convertEPUBToBilingual(
    filePath: string,
    options: ConversionOptions = {}
  ): Promise<{
    title: string;
    originalTitle: string;
    author: string;
    content: BilingualContent[];
  }> {
    const {
      sourceLanguage = 'English',
      targetLanguage = 'Chinese',
      model
    } = options;

    console.log(`📖 Extracting structured content from ${filePath}...`);
    
    // Parse EPUB to extract structured content
    const epubData = await EPUBParser.parseEPUBToStructured(filePath);
    
    if (epubData.content.length === 0) {
      throw new Error('No text content found in EPUB');
    }

    console.log(`📚 Found ${epubData.content.length} structured items`);
    
    // Extract content items for translation
    let contentItems = epubData.content;

    console.log(`📝 Extracted ${contentItems.length} items for translation`);

    // Translate all content items
    console.log(`🌏 Translating ${contentItems.length} items from ${sourceLanguage} to ${targetLanguage}...`);
    
    const translator = new LLMTranslator();
    const originalTexts = contentItems.map(item => item.content);
    const translatedTexts = await translator.translateBatch(
      originalTexts, 
      {
        sourceLanguage,
        targetLanguage,
        model
      },
      options.onProgress
    );

    // Create bilingual content
    const content: BilingualContent[] = contentItems.map((item, index) => ({
      id: item.id,
      original: item.content,
      translated: translatedTexts[index] || `[Translation failed: ${item.content}]`,
      type: item.type
    }));

    console.log(`✅ Successfully processed ${content.length} structured items`);

    const translatedTitle = await translator.translateText(epubData.title, { sourceLanguage, targetLanguage, model });

    return {
      title: translatedTitle,
      originalTitle: epubData.title,
      author: epubData.author,
      content
    };
  }

  async saveBilingualJSON(
    filePath: string,
    outputPath: string,
    options: ConversionOptions = {}
  ): Promise<string> {
    const result = await this.convertEPUBToBilingual(filePath, options);
    
    const output = {
      title: result.title,
      originalTitle: result.originalTitle,
      author: result.author,
      content: result.content
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    return outputPath;
  }
}
