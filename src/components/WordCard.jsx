import React from 'react'

function splitArabicClusters(str) {
  const clusters = []
  let current = { base: '', marks: '' }
  const isBase = (ch) => /[\u0621-\u064A\u0660-\u0669\u0671\u0620-\u0629]/.test(ch)
  const isMark = (ch) => /[\u064B-\u0652\u0670\u0674\u06D6-\u06ED]/.test(ch)

  for (const ch of str) {
    if (isBase(ch) || ch === ' ' || ch === "'" || ch === '’') {
      if (current.base || current.marks) {
        clusters.push(current)
      }
      current = { base: ch, marks: '' }
    } else if (isMark(ch)) {
      current.marks += ch
    } else {
      // other characters (punctuation) treat as base
      if (current.base || current.marks) {
        clusters.push(current)
      }
      current = { base: ch, marks: '' }
    }
  }
  if (current.base || current.marks) clusters.push(current)
  return clusters
}

export default function WordCard({ word, activeSymbol, onSelectSymbol }) {
  const clusters = splitArabicClusters(word.word)
  const hasActive = activeSymbol && clusters.some((c) => c.base === activeSymbol)

  return (
    <article className={`word-card ${hasActive ? 'word-card-active' : ''}`}>
      <div className="word-card-title">
        <div className="word-card-arabic">
          {clusters.map((g, idx) => {
            const isActive = g.base === activeSymbol
            return (
              <span key={idx} className="glyph">
                <span className="harakat">{g.marks}</span>
                <span
                  className={isActive ? 'base highlight clickable' : 'base clickable'}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSymbol && onSelectSymbol(g.base)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      onSelectSymbol && onSelectSymbol(g.base)
                    }
                  }}
                >
                  {g.base}
                </span>
              </span>
            )
          })}
        </div>
        <div className="word-card-meta">
          <div className="word-card-translit">{word.transliteration}</div>
          <div className="word-card-translation">{word.polish}</div>
        </div>
      </div>

      <div className="word-card-breakdown">
        {word.letters.map((letter, index) => (
          <span
            key={index}
            className={`letter-badge ${letter === activeSymbol ? 'highlight' : ''} clickable`}
            role="button"
            tabIndex={0}
            onClick={() => onSelectSymbol && onSelectSymbol(letter)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onSelectSymbol && onSelectSymbol(letter)
              }
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </article>
  )
}
