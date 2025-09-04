import React, { useState, useEffect } from 'react';
import BilingualReader, { ContentItem } from './components/BilingualReader';
import BookShelf from './components/BookShelf';
import './App.css';

interface BookContent {
  uuid: string;
  title: string;
  originalTitle: string;
  author: string;
  styles: string;
  currentChapter: number;
  chapterInfo: {
    number: number;
    title: string;
    originalTitle: string;
  };
  content: ContentItem[];
}

function App() {
  const [showOriginalTitle, setShowOriginalTitle] = useState(true);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [bookUuid, setBookUuid] = useState<string | null>(null);
  const [showBookShelf, setShowBookShelf] = useState(false);

  const loadChapter = async (chapterNumber: number) => {
    if (!bookUuid) {
      setError('No book UUID found');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/book/${bookUuid}/chapter/${chapterNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as BookContent;
      setBookContent(data);
      setCurrentChapter(chapterNumber);
      
      // Small delay then scroll to appropriate position
      setTimeout(() => {
        // If loading next chapter, scroll to a safe position from top
        // If loading previous chapter, scroll to a safe position from bottom
        if (chapterNumber > currentChapter) {
          window.scrollTo(0, 100); // Start a bit from top when going forward
        } else if (chapterNumber < currentChapter) {
          // Scroll to near bottom when going backward
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
          window.scrollTo(0, scrollHeight - clientHeight - 100);
        } else {
          window.scrollTo(0, 0); // Default to top
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapter');
      console.error('Error fetching chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Extract book UUID from URL: /book/:uuid
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'book' && pathParts[2]) {
      const uuid = pathParts[2];
      setBookUuid(uuid);
      setShowBookShelf(false);
    } else if (pathParts.length <= 2 && (pathParts[1] === '' || pathParts[1] === undefined)) {
      // Root path - show book shelf
      setShowBookShelf(true);
      setLoading(false);
    } else {
      setError('Invalid book URL. Expected format: /book/:book_id');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load first chapter when book UUID is available
    if (bookUuid && !showBookShelf) {
      loadChapter(1);
    }
  }, [bookUuid, showBookShelf]);

  const handleSelectBook = (uuid: string) => {
    setBookUuid(uuid);
    setShowBookShelf(false);
    setBookContent(null);
    setCurrentChapter(1);
    setError(null);
    setLoading(true);
    
    // Update URL
    window.history.pushState({}, '', `/book/${uuid}`);
  };

  // Show book shelf on root path
  if (showBookShelf) {
    return (
      <div className="App">
        <BookShelf onSelectBook={handleSelectBook} />
      </div>
    );
  }

  if (loading && !bookContent) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading book content...</div>
        </div>
      </div>
    );
  }

  if (error || !bookContent) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Error: {error || 'Failed to load book content'}</div>
        </div>
      </div>
    );
  }

  const epubContent = bookContent.content;
  const author = bookContent.author !== 'Unknown Author' ? bookContent.author : '';

  return (
    <div className="App">
      <BilingualReader
        content={epubContent}
        title={bookContent.title}
        author={author}
        styles={bookContent.styles}
        currentChapter={currentChapter}
        onLoadChapter={loadChapter}
        isLoading={loading}
        setShowOriginalTitle={setShowOriginalTitle}
        bookUuid={bookUuid || undefined}
      />
    </div>
  );
}

export default App;
