import React, { useMemo, useState } from 'react'

const reviewIntervals = [1, 2, 4, 7, 14]
const getNextReview = (box) => {
  const days = reviewIntervals[Math.min(Math.max(box - 1, 0), reviewIntervals.length - 1)]
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export default function FlashcardSection({ letters, vocabulary, progress, onUpdateLetterReview, onUpdateWordReview, onToggleKnownSymbol, onToggleKnownWord }) {
  const [mode, setMode] = useState('letters')
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const allWords = useMemo(() => vocabulary.flatMap((group) => group.words), [vocabulary])
  const dueLetters = useMemo(() => letters.filter((letter) => {
    const entry = progress.letterProgress?.[letter.symbol]
    return !entry || new Date(entry.nextReview) <= new Date()
  }), [letters, progress.letterProgress])
  const dueWords = useMemo(() => allWords.filter((word) => {
    const entry = progress.wordProgress?.[word.word]
    return !entry || new Date(entry.nextReview) <= new Date()
  }), [allWords, progress.wordProgress])

  const items = mode === 'letters' ? dueLetters : dueWords
  const currentItem = items[currentIndex] || null

  const handleReview = (correct) => {
    if (!currentItem) return
    const key = mode === 'letters' ? currentItem.symbol : currentItem.word
    const existing = mode === 'letters'
      ? progress.letterProgress?.[key] || { box: 1 }
      : progress.wordProgress?.[key] || { box: 1 }

    const nextBox = correct ? Math.min(existing.box + 1, reviewIntervals.length) : 1
    const updated = {
      box: nextBox,
      lastReview: new Date().toISOString(),
      nextReview: getNextReview(nextBox)
    }

    if (mode === 'letters') {
      onUpdateLetterReview(key, updated)
    } else {
      onUpdateWordReview(key, updated)
    }

    setShowAnswer(false)
    setCurrentIndex((index) => Math.min(index + 1, items.length - 1))
  }

  const handleToggleKnown = () => {
    if (!currentItem) return
    if (mode === 'letters') {
      onToggleKnownSymbol(currentItem.symbol)
    } else {
      onToggleKnownWord(currentItem.word)
    }
  }

  return (
    <section id="flashcards" className="flashcard-section">
      <div className="section-header">
        <h2>Fiszki i powtórki</h2>
        <p>Powtarzaj litery i słowa według prostego systemu powtórek.</p>
      </div>

      <div className="review-controls">
        <button className={mode === 'letters' ? 'active' : ''} type="button" onClick={() => { setMode('letters'); setCurrentIndex(0); setShowAnswer(false)}}>Litery</button>
        <button className={mode === 'words' ? 'active' : ''} type="button" onClick={() => { setMode('words'); setCurrentIndex(0); setShowAnswer(false)}}>Słowa</button>
      </div>

      {currentItem ? (
        <div className="flashcard-card">
          <div className="flashcard-content">
            <div className="flashcard-front">
              {mode === 'letters' ? (
                <>
                  <span className="flashcard-symbol">{currentItem.symbol}</span>
                  <p>{currentItem.polish}</p>
                </>
              ) : (
                <>
                  <span className="flashcard-word">{currentItem.word}</span>
                  <p>{currentItem.polish}</p>
                </>
              )}
            </div>

            {showAnswer && (
              <div className="flashcard-answer">
                {mode === 'letters' ? (
                  <p>Także: {currentItem.name_ar} · {currentItem.ipa}</p>
                ) : (
                  <p>Transliteracja: {currentItem.transliteration}</p>
                )}
              </div>
            )}
          </div>

          <div className="flashcard-actions">
            <button type="button" onClick={() => setShowAnswer((v) => !v)}>{showAnswer ? 'Ukryj odpowiedź' : 'Pokaż odpowiedź'}</button>
            <button type="button" onClick={() => handleReview(true)}>Znam</button>
            <button type="button" onClick={() => handleReview(false)}>Jeszcze nie</button>
            <button type="button" onClick={handleToggleKnown}>{mode === 'letters' ? 'Poznane/Usuń' : 'Znam to słowo'}</button>
          </div>
        </div>
      ) : (
        <div className="flashcard-empty">
          <p>Brak pozycji do powtórki w tej kategorii. Dodaj kolejne litery lub słowa, aby zapełnić fiszki.</p>
        </div>
      )}
    </section>
  )
}
