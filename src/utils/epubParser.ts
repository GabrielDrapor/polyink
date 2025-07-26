// EPUB Parser utilities for extracting Japanese text
import * as fs from 'fs';
import * as path from 'path';
const { DOMParser } = require('xmldom');
import { promisify } from 'util';

export interface BilingualContent {
  id: string;
  original: string;
  translated: string;
  type: 'title' | 'chapter' | 'paragraph';
}

export interface EPUBParseResult {
  title: string;
  author: string;
  chapters: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export class EPUBParser {
  private static extractTextFromHTML(html: string): { title: string; content: Array<{ type: 'chapter' | 'paragraph'; content: string }> } {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (!doc) return { title: '', content: [] };

      // Extract title from the <title> tag
      const titleTag = doc.getElementsByTagName('title')[0];
      const title = titleTag && titleTag.textContent ? titleTag.textContent.trim() : '';

      const body = doc.getElementsByTagName('body')[0];
      if (!body) return { title, content: [] };

      const content: Array<{ type: 'chapter' | 'paragraph'; content: string }> = [];
      
      const processNode = (node: Node) => {
        if (node.nodeType === 1) { // Element node
          const element = node as Element;
          const tagName = element.tagName.toLowerCase();

          if (tagName.match(/^h[1-6]$/)) {
            const text = element.textContent?.trim();
            if (text) {
              content.push({ type: 'chapter', content: text });
            }
          } else if (tagName === 'p') {
            const text = element.textContent?.trim();
            if (text) {
              content.push({ type: 'paragraph', content: text });
            }
          } else {
            // Recursively process children of other block-level elements
            if (['div', 'section', 'article', 'main'].includes(tagName)) {
              for (let i = 0; i < node.childNodes.length; i++) {
                processNode(node.childNodes[i]);
              }
            }
          }
        }
      };

      for (let i = 0; i < body.childNodes.length; i++) {
        processNode(body.childNodes[i]);
      }

      return { title, content };
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return { title: '', content: [] };
    }
  }

  private static async extractEPUBContent(filePath: string): Promise<{
    title: string;
    author: string;
    htmlFiles: string[];
  }> {
    const JSZip = require('jszip');
    const zip = new JSZip();
    
    const fileBuffer = fs.readFileSync(filePath);
    const zipContent = await zip.loadAsync(fileBuffer);
    
    let title = 'Unknown Title';
    let author = 'Unknown Author';
    
    // Try to find and parse the OPF file
    const opfFile = Object.keys(zipContent.files).find(name => 
      name.endsWith('.opf') && name.includes('content')
    );
    
    if (opfFile) {
      const opfContent = await zipContent.files[opfFile].async('text');
      const doc = new DOMParser().parseFromString(opfContent, 'text/xml');
      
      if (doc) {
        const titleElement = doc.getElementsByTagName('dc:title')[0];
        const authorElement = doc.getElementsByTagName('dc:creator')[0];
        
        if (titleElement && titleElement.textContent) {
          title = titleElement.textContent.trim();
        }
        if (authorElement && authorElement.textContent) {
          author = authorElement.textContent.trim();
        }
      }
    }
    
    // Find all HTML files in the OPS or OEBPS directory
    const htmlFiles = Object.keys(zipContent.files)
      .filter(name => name.match(/\.(x?html?)$/i))
      .sort();
    
    return { title, author, htmlFiles };
  }

    

  

  static async parseEPUBToStructured(filePath: string): Promise<{
    title: string;
    author: string;
    content: Array<{
      id: string;
      type: 'title' | 'chapter' | 'paragraph';
      content: string;
    }>;
  }> {
    const JSZip = require('jszip');
    const zip = new JSZip();
    
    const fileBuffer = fs.readFileSync(filePath);
    const zipContent = await zip.loadAsync(fileBuffer);
    
    const { title: opfTitle, author, htmlFiles } = await this.extractEPUBContent(filePath);
    const structuredContent: Array<{
      id: string;
      type: 'title' | 'chapter' | 'paragraph';
      content: string;
    }> = [];
    
    let bookTitle: string | null = null;
    let contentId = 1;
    
    for (let i = 0; i < htmlFiles.length; i++) {
      const fileName = htmlFiles[i];
      const file = zipContent.files[fileName];
      
      if (file) {
        const htmlContent = await file.async('text');
        const { title: pageTitle, content: pageContent } = this.extractTextFromHTML(htmlContent);
        
        if (pageTitle && !bookTitle) {
          bookTitle = pageTitle;
        }
        
        pageContent.forEach(item => {
          structuredContent.push({
            id: `content-${contentId++}`,
            type: item.type,
            content: item.content
          });
        });
      }
    }
    
    const finalTitle = bookTitle || opfTitle;
    
    return {
      title: finalTitle,
      author,
      content: structuredContent
    };
  }
}