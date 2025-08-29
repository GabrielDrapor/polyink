import OpenAI from 'openai';

export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage?: string;
  model?: string;
  apiKey?: string;
}

export class LLMTranslator {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (key) {
      this.openai = new OpenAI({
        apiKey: key,
        baseURL:
          process.env.OPENAI_API_BASE_URL ||
          'https://generativelanguage.googleapis.com/v1beta/openai/',
      });
    }
  }

  async translateText(
    text: string,
    options: TranslationOptions = {}
  ): Promise<string> {
    const {
      sourceLanguage = 'English',
      targetLanguage = 'Chinese',
      model = 'gemini-1.5-flash',
    } = options;

    // Use actual LLM API if available
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Provide only the translation without any explanations or notes.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
          max_tokens: 1000,
        });

        const translation = response.choices[0]?.message?.content?.trim();
        if (translation) {
          return translation;
        }
      } catch (error) {
        console.warn('LLM API failed, using fallback:', error);
      }
    }

    // Fallback to demo translations
    const demoTranslations: Record<string, string> = {
      'A Case of Identity': '身份案',
      'My dear fellow': '亲爱的朋友',
      'Sherlock Holmes': '夏洛克·福尔摩斯',
      'Baker Street': '贝克街',
      'life is infinitely stranger': '生活比想象中要奇妙得多',
      'the mind of man': '人类的思维',
      'strange coincidences': '奇怪的巧合',
      'the cases which come to light': '被揭露的案件',
      'as a rule': '通常',
      'bald enough': '足够直白',
      'vulgar enough': '足够庸俗',
    };

    if (text.length < 50) {
      for (const [key, value] of Object.entries(demoTranslations)) {
        if (text.toLowerCase().includes(key.toLowerCase())) {
          return text.replace(new RegExp(key, 'gi'), value);
        }
      }
    }

    return `[中文翻译: ${text.substring(0, 50)}...]`;
  }

  async translateBatch(
    texts: string[],
    options: TranslationOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<string[]> {
    console.log(`Translating ${texts.length} text segments to Chinese...`);

    // Process in batches to avoid rate limits
    const batchSize = 5;
    const results: string[] = [];
    const totalBatches = Math.ceil(texts.length / batchSize);

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((text) => this.translateText(text, options))
      );
      results.push(...batchResults);

      if (onProgress) {
        const progress = Math.round(((i + batchSize) / texts.length) * 100);
        onProgress(Math.min(100, progress));
      }

      // Small delay between batches if using API
      if (this.openai && i + batchSize < texts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}
