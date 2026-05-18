import React from 'react'

export default function ProgressDashboard({ progress, letters, vocabulary }) {
  const now = new Date()
  const dueLetters = letters.filter((letter) => {
    const entry = progress.letterProgress?.[letter.symbol]
    return !entry || new Date(entry.nextReview) <= now
  })

  const allWords = vocabulary.flatMap((group) => group.words)
  const dueWords = allWords.filter((word) => {
    const entry = progress.wordProgress?.[word.word]
    return !entry || new Date(entry.nextReview) <= now
  })

  const knownLettersCount = progress.knownLetters?.length || 0
  const knownWordsCount = progress.knownWords?.length || 0
  const favoriteWordsCount = progress.favoriteWords?.length || 0
  const quizHistory = progress.quizHistory || []
  const averageScore = quizHistory.length
    ? Math.round(
        quizHistory.reduce((sum, item) => sum + item.score, 0) / quizHistory.length
      )
    : 0
  const lastQuiz = quizHistory[quizHistory.length - 1]

  return (
    <section id="progress" className="progress-section">
      <div className="section-header">
        <h2>Postęp</h2>
        <p>Śledź liczbę poznanych liter, słów i zaplanowane powtórki.</p>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <strong>{knownLettersCount}</strong>
          <span>poznanych liter</span>
        </div>
        <div className="progress-card">
          <strong>{knownWordsCount}</strong>
          <span>poznanych słów</span>
        </div>
        <div className="progress-card">
          <strong>{favoriteWordsCount}</strong>
          <span>ulubionych słów</span>
        </div>
        <div className="progress-card">
          <strong>{dueLetters.length + dueWords.length}</strong>
          <span>pozycji do powtórki</span>
        </div>
      </div>

      <div className="progress-summary">
        <div>
          <h3>Quizy</h3>
          <p>{quizHistory.length > 0 ? `${quizHistory.length} sesji quizowych` : 'Brak zapisanych quizów jeszcze.'}</p>
          {quizHistory.length > 0 && (
            <p>Średni wynik: {averageScore}%</p>
          )}
          {lastQuiz && (
            <p>Ostatni quiz: {lastQuiz.date} — {lastQuiz.score}%</p>
          )}
        </div>

        <div>
          <h3>Powtórki</h3>
          <p>{dueLetters.length} liter do przejrzenia</p>
          <p>{dueWords.length} słów do przejrzenia</p>
        </div>
      </div>
    </section>
  )
}
