import React from 'react'

export default function WordCard({ word, activeSymbol }) {
  const hasActive = activeSymbol && Array.from(word.word).some((char) => char === activeSymbol)

  return (
    <article className={`word-card ${hasActive ? 'word-card-active' : ''}`}>
      <div className="word-card-title">
        <div className="word-card-arabic">
          {Array.from(word.word).map((char, index) => (
            <span key={index} className={char === activeSymbol ? 'highlight' : ''}>
              {char}
            </span>
          ))}
        </div>
        <div className="word-card-meta">
          <div className="word-card-translit">{word.transliteration}</div>
          <div className="word-card-translation">{word.polish}</div>
        </div>
      </div>

      <div className="word-card-breakdown">
        {word.letters.map((letter, index) => (
          <span key={index} className={`letter-badge ${letter === activeSymbol ? 'highlight' : ''}`}>
            {letter}
          </span>
        ))}
      </div>
    </article>
  )
}
