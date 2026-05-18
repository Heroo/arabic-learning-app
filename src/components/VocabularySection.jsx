import React from 'react'
import WordCard from './WordCard'

const categoryLabels = {
  greetings: 'Powitania',
  family: 'Rodzina',
  house: 'Dom',
  numbers: 'Liczby',
  colors: 'Kolory',
  food: 'Jedzenie',
  animals: 'Zwierzęta'
}

export default function VocabularySection({ vocabulary, activeSymbol }) {
  return (
    <section id="vocabulary" className="vocabulary-section">
      <div className="section-header">
        <h2>Słownictwo</h2>
        <p>Ćwicz nowe słowa według kategorii. Aktywna litera jest podświetlana w każdym przykładzie.</p>
      </div>

      {vocabulary.map((group) => (
        <div key={group.category} className="vocab-group">
          <h3>{categoryLabels[group.category] || group.category}</h3>
          <div className="vocab-grid">
            {group.words.map((word, index) => (
              <WordCard key={`${group.category}-${index}`} word={word} activeSymbol={activeSymbol} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
