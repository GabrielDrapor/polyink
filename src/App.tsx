import React, { useState } from 'react';
import BilingualReader, { ContentItem } from './components/BilingualReader';
import './App.css';

import bilingualContent from './bilingual-content.json';

const epubContent = bilingualContent.content as ContentItem[];

function App() {
  const [showOriginalTitle, setShowOriginalTitle] = useState(true);
  const author =
    bilingualContent.author !== 'Unknown Author' ? bilingualContent.author : '';

  const title = showOriginalTitle
    ? (bilingualContent as any).originalTitle
    : bilingualContent.title;

  return (
    <div className="App">
      <div className="title-page">
        <h1
          className="clickable-title"
          onClick={() => setShowOriginalTitle((prev) => !prev)}
        >
          {title}
        </h1>
        {author && <h2>{author}</h2>}
      </div>
      <BilingualReader
        content={epubContent}
        title={bilingualContent.title}
        author={author}
        styles={(bilingualContent as any).styles}
        setShowOriginalTitle={setShowOriginalTitle}
      />
    </div>
  );
}

export default App;
