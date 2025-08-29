import React, { useState } from 'react';
import './BilingualReader.css';

export interface ContentItem {
  id: string;
  original: string;
  translated: string;
  type?: 'title' | 'chapter' | 'paragraph';
  className?: string;
  tagName?: string;
  styles?: string;
}

interface BilingualReaderProps {
  content: ContentItem[];
  title: string;
  author: string;
  styles?: string;
  setShowOriginalTitle: (value: boolean) => void;
}

const BilingualReader: React.FC<BilingualReaderProps> = ({
  content,
  title,
  author,
  styles,
  setShowOriginalTitle,
}) => {
  const [showOriginal, setShowOriginal] = useState<{ [key: string]: boolean }>(
    () => {
      return content.reduce(
        (acc, item) => {
          acc[item.id] = true;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
    }
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [paragraphSpacing, setParagraphSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const toggleLanguage = (id: string) => {
    setShowOriginal((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showAllOriginal = () => {
    const allOriginal = content.reduce(
      (acc, item) => {
        acc[item.id] = true;
        return acc;
      },
      {} as { [key: string]: boolean }
    );
    setShowOriginal(allOriginal);
    setShowOriginalTitle(true);
    setIsMenuOpen(false);
  };

  const showAllTranslated = () => {
    const allTranslated = content.reduce(
      (acc, item) => {
        acc[item.id] = false;
        return acc;
      },
      {} as { [key: string]: boolean }
    );
    setShowOriginal(allTranslated);
    setShowOriginalTitle(false);
    setIsMenuOpen(false);
  };

  const adjustParagraphSpacing = (delta: number) => {
    setParagraphSpacing((prev) => Math.max(0, Math.min(50, prev + delta)));
  };

  const adjustLineHeight = (delta: number) => {
    setLineHeight((prev) => Math.max(1.0, Math.min(3.0, prev + delta)));
  };

  const adjustLetterSpacing = (delta: number) => {
    setLetterSpacing((prev) => Math.max(-0.1, Math.min(0.3, prev + delta)));
  };

  return (
    <div className="bilingual-reader">
      {/* Inject EPUB CSS styles */}
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}

      <main
        className="reader-content"
        style={{
          lineHeight: lineHeight,
          letterSpacing: `${letterSpacing}em`,
        }}
      >
        {content.map((item) => {
          const text = showOriginal[item.id] ? item.original : item.translated;
          const isChinese = /[\u4e00-\u9fff]/.test(text);

          // Combine original EPUB classes with reader classes
          let itemClass = 'paragraph';
          if (item.type === 'title') {
            itemClass = 'title-text';
          } else if (item.type === 'chapter') {
            itemClass = 'chapter-text';
          } else {
            itemClass += isChinese ? ' chinese-text' : ' english-text';
          }

          // Add original EPUB className if available
          if (item.className) {
            itemClass += ` ${item.className}`;
          }

          // Create inline styles combining reader and EPUB styles
          const combinedStyles: React.CSSProperties = {};
          if (item.styles) {
            // Parse inline styles if available
            const inlineStyles = item.styles.split(';').reduce((acc, style) => {
              const [property, value] = style.split(':').map((s) => s.trim());
              if (property && value) {
                // Convert CSS property names to camelCase for React
                const camelProp = property.replace(/-([a-z])/g, (g) =>
                  g[1].toUpperCase()
                );
                acc[camelProp] = value;
              }
              return acc;
            }, {} as any);
            Object.assign(combinedStyles, inlineStyles);
          }

          // Determine the appropriate HTML element based on original tagName or type
          const TagName = (item.tagName ||
            (item.type === 'title'
              ? 'h2'
              : item.type === 'chapter'
                ? 'h3'
                : 'p')) as keyof JSX.IntrinsicElements;

          const element = React.createElement(
            TagName,
            {
              className: itemClass,
              style: combinedStyles,
              onClick: () => toggleLanguage(item.id),
            },
            text
          );

          return (
            <div
              key={item.id}
              className={`paragraph-container ${item.type || 'paragraph'}-container`}
              style={{ marginBottom: `${paragraphSpacing}px` }}
            >
              {element}
            </div>
          );
        })}
      </main>

      <div className="fab-container">
        <button className="fab" onClick={toggleMenu}>
          ⋮
        </button>
        {isMenuOpen && (
          <div className="fab-menu">
            <div className="fab-menu-section">
              <div className="fab-menu-header">Language</div>
              <button className="fab-menu-item" onClick={showAllOriginal}>
                Show All Original
              </button>
              <button className="fab-menu-item" onClick={showAllTranslated}>
                Show All Translated
              </button>
            </div>

            <div className="fab-menu-section">
              <div className="fab-menu-header">
                Paragraph Spacing: {paragraphSpacing}px
              </div>
              <div className="fab-menu-controls">
                <button
                  className="fab-control-btn"
                  onClick={() => adjustParagraphSpacing(-5)}
                >
                  -
                </button>
                <button
                  className="fab-control-btn"
                  onClick={() => adjustParagraphSpacing(5)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="fab-menu-section">
              <div className="fab-menu-header">
                Line Height: {lineHeight.toFixed(1)}
              </div>
              <div className="fab-menu-controls">
                <button
                  className="fab-control-btn"
                  onClick={() => adjustLineHeight(-0.1)}
                >
                  -
                </button>
                <button
                  className="fab-control-btn"
                  onClick={() => adjustLineHeight(0.1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="fab-menu-section">
              <div className="fab-menu-header">
                Letter Spacing: {letterSpacing.toFixed(2)}em
              </div>
              <div className="fab-menu-controls">
                <button
                  className="fab-control-btn"
                  onClick={() => adjustLetterSpacing(-0.01)}
                >
                  -
                </button>
                <button
                  className="fab-control-btn"
                  onClick={() => adjustLetterSpacing(0.01)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BilingualReader;
