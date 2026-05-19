import React, { useEffect, useState } from 'react'
import letters from './data/letters.json'
import vocabulary from './data/vocabulary.json'
import harakatData from './data/harakat.json'
import LetterCard from './components/LetterCard'
import LetterDetailModal from './components/LetterDetailModal'
import HarakatModule from './components/HarakatModule'
import VocabularySection from './components/VocabularySection'
import FlashcardSection from './components/FlashcardSection'
import QuizSection from './components/QuizSection'
import ProgressDashboard from './components/ProgressDashboard'
import SettingsPanel from './components/SettingsPanel'

const STORAGE_SETTINGS = 'arabicLearningSettings'
const STORAGE_PROGRESS = 'arabicLearningProgress'

const defaultSettings = {
  theme: 'light',
  fontSize: 16,
  audioRate: 1,
  showHarakat: true,
  uiLanguage: 'pl'
}

const defaultProgress = {
  knownLetters: [],
  knownWords: [],
  favoriteWords: [],
  letterProgress: {},
  wordProgress: {},
  quizHistory: []
}

export default function App() {
  const [activeSymbol, setActiveSymbol] = useState(null)
  const [activeHarakat, setActiveHarakat] = useState(null)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return defaultSettings
    try {
      const stored = window.localStorage.getItem(STORAGE_SETTINGS)
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
    } catch {
      return defaultSettings
    }
  })
  const [progress, setProgress] = useState(() => {
    if (typeof window === 'undefined') return defaultProgress
    try {
      const stored = window.localStorage.getItem(STORAGE_PROGRESS)
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress
    } catch {
      return defaultProgress
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings))
    }
  }, [settings])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress))
    }
  }, [progress])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.style.setProperty('--bg', '#0f172a')
      root.style.setProperty('--card', '#111827')
      root.style.setProperty('--accent', '#60a5fa')
      root.style.setProperty('--accent-strong', '#3b82f6')
      root.style.setProperty('--active-bg', '#1f2937')
      root.style.setProperty('--text', '#f8fafc')
    } else {
      root.style.setProperty('--bg', '#f7f7fb')
      root.style.setProperty('--card', '#fff')
      root.style.setProperty('--accent', '#2b6cb0')
      root.style.setProperty('--accent-strong', '#1d4ed8')
      root.style.setProperty('--active-bg', '#f8fafc')
      root.style.setProperty('--text', '#0f172a')
    }
  }, [settings.theme])

  const knownSymbols = progress.knownLetters || []

  const toggleActiveSymbol = (symbol) => {
    setActiveSymbol((current) => (current === symbol ? null : symbol))
  }

  const toggleKnownSymbol = (symbol) => {
    setProgress((current) => {
      const knownLetters = current.knownLetters || []
      const nextKnown = knownLetters.includes(symbol)
        ? knownLetters.filter((item) => item !== symbol)
        : [...knownLetters, symbol]
      return { ...current, knownLetters: nextKnown }
    })
  }

  const toggleKnownWord = (word) => {
    setProgress((current) => {
      const knownWords = current.knownWords || []
      const nextKnown = knownWords.includes(word)
        ? knownWords.filter((item) => item !== word)
        : [...knownWords, word]
      return { ...current, knownWords: nextKnown }
    })
  }

  const updateLetterReview = (symbol, review) => {
    setProgress((current) => ({
      ...current,
      letterProgress: {
        ...current.letterProgress,
        [symbol]: review
      }
    }))
  }

  const updateWordReview = (word, review) => {
    setProgress((current) => ({
      ...current,
      wordProgress: {
        ...current.wordProgress,
        [word]: review
      }
    }))
  }

  const recordQuiz = (quiz) => {
    setProgress((current) => ({
      ...current,
      quizHistory: [...(current.quizHistory || []), quiz]
    }))
  }

  const handleImport = (parsed) => {
    const importedSettings = parsed.settings || (parsed.theme ? parsed : null)
    const importedProgress = parsed.progress || (parsed.knownLetters || parsed.knownWords || parsed.letterProgress || parsed.wordProgress ? parsed : null)

    setSettings(importedSettings ? { ...defaultSettings, ...importedSettings } : defaultSettings)
    setProgress(importedProgress ? { ...defaultProgress, ...importedProgress } : defaultProgress)
  }

  const resetProgress = () => {
    setProgress(defaultProgress)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <div className="container" style={{ fontSize: `${settings.fontSize}px` }}>
      <h1>Arabic Alphabet — MVP</h1>
      <p>Dotknij litery, aby usłyszeć wymowę (Web Speech API). Wybierz literę, aby podświetlić ją we wszystkich przykładach.</p>

      <div className="status-bar">
        <span>Aktywna litera:</span>
        <strong>{activeSymbol || 'brak'}</strong>
        <span>Zdobyte litery:</span>
        <strong>{knownSymbols.length}</strong>
      </div>

      <nav className="top-nav">
        <a href="#progress">Postęp</a>
        <a href="#flashcards">Fiszki</a>
        <a href="#quiz">Quiz</a>
        {settings.showHarakat && <a href="#harakat">Harakat</a>}
        <a href="#alphabet">Alfabet</a>
        <a href="#vocabulary">Słownictwo</a>
        <a href="#settings">Ustawienia</a>
      </nav>

      <ProgressDashboard progress={progress} letters={letters} vocabulary={vocabulary} />

      <FlashcardSection
        letters={letters}
        vocabulary={vocabulary}
        progress={progress}
        onUpdateLetterReview={updateLetterReview}
        onUpdateWordReview={updateWordReview}
        onToggleKnownSymbol={toggleKnownSymbol}
        onToggleKnownWord={toggleKnownWord}
      />

      <QuizSection letters={letters} harakat={harakatData} vocabulary={vocabulary} onRecordQuiz={recordQuiz} />

      {settings.showHarakat && (
        <HarakatModule
          activeHarakat={activeHarakat}
          onSelectHarakat={setActiveHarakat}
          audioRate={settings.audioRate}
        />
      )}

      <section id="alphabet" className="alphabet-section">
        <div className="section-header">
          <h2>Alfabet</h2>
          <p>Przeglądaj wszystkie litery i wybierz tę, którą chcesz utrwalić lub oznaczyć jako poznaną.</p>
        </div>
        <div className="grid">
          {letters.map((l, idx) => (
            <LetterCard
              key={idx}
              letter={l}
              activeSymbol={activeSymbol}
              knownSymbols={knownSymbols}
              audioRate={settings.audioRate}
              onSelect={() => toggleActiveSymbol(l.symbol)}
              onToggleKnown={() => toggleKnownSymbol(l.symbol)}
              onOpenDetails={() => setSelectedLetter(l)}
            />
          ))}
        </div>
      </section>

      <VocabularySection vocabulary={vocabulary} activeSymbol={activeSymbol} onSelectSymbol={toggleActiveSymbol} />

      <SettingsPanel
        settings={settings}
        progress={progress}
        onChange={setSettings}
        onImport={handleImport}
        onResetProgress={resetProgress}
        onResetSettings={resetSettings}
      />

      <LetterDetailModal
        letter={selectedLetter}
        activeSymbol={activeSymbol}
        knownSymbols={knownSymbols}
        onClose={() => setSelectedLetter(null)}
        onToggleActive={toggleActiveSymbol}
        onToggleKnown={toggleKnownSymbol}
      />
    </div>
  )
}
