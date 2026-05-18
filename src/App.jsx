import React, { useState, useEffect } from 'react'
import letters from './data/letters.json'
import vocabulary from './data/vocabulary.json'
import LetterCard from './components/LetterCard'
import LetterDetailModal from './components/LetterDetailModal'
import HarakatModule from './components/HarakatModule'
import VocabularySection from './components/VocabularySection'

const STORAGE_KEY = 'knownArabicLetters'

export default function App(){
  const [activeSymbol, setActiveSymbol] = useState(null)
  const [activeHarakat, setActiveHarakat] = useState(null)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [knownSymbols, setKnownSymbols] = useState(() => {
    if (typeof window === 'undefined') return []
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(knownSymbols))
    }
  }, [knownSymbols])

  const toggleActiveSymbol = (symbol) => {
    setActiveSymbol((current) => (current === symbol ? null : symbol))
  }

  const toggleKnownSymbol = (symbol) => {
    setKnownSymbols((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : [...current, symbol]
    )
  }

  return (
    <div className="container">
      <h1>Arabic Alphabet — MVP</h1>
      <p>Dotknij litery, aby usłyszeć wymowę (Web Speech API). Wybierz literę, aby podświetlić ją we wszystkich przykładach.</p>

      <div className="status-bar">
        <span>Aktywna litera:</span>
        <strong>{activeSymbol || 'brak'}</strong>
        <span>Zdobyte litery:</span>
        <strong>{knownSymbols.length}</strong>
      </div>

      <nav className="top-nav">
        <a href="#alphabet">Alfabet</a>
        <a href="#harakat">Harakat</a>
        <a href="#vocabulary">Słownictwo</a>
      </nav>

      <HarakatModule activeHarakat={activeHarakat} onSelectHarakat={setActiveHarakat} />

      <section id="alphabet" className="alphabet-section">
        <div className="grid">
          {letters.map((l, idx) => (
            <LetterCard
              key={idx}
              letter={l}
              activeSymbol={activeSymbol}
              knownSymbols={knownSymbols}
              onSelect={() => toggleActiveSymbol(l.symbol)}
              onToggleKnown={() => toggleKnownSymbol(l.symbol)}
              onOpenDetails={() => setSelectedLetter(l)}
            />
          ))}
        </div>
      </section>

      <VocabularySection vocabulary={vocabulary} activeSymbol={activeSymbol} />

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
