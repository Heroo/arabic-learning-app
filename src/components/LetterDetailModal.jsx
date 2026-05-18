import React from 'react'

export default function LetterDetailModal({ letter, activeSymbol, knownSymbols, onClose, onToggleActive, onToggleKnown }) {
  if (!letter) return null

  const isActive = activeSymbol === letter.symbol
  const isKnown = knownSymbols?.includes(letter.symbol)
  const difficultyDots = '•'.repeat(letter.difficulty)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Zamknij">×</button>

        <div className="modal-title">
          <div className="modal-symbol">{letter.symbol}</div>
          <div>
            <div className="modal-name">{letter.name_ar}</div>
            <div className="modal-subtitle">{letter.polish} · {letter.ipa}</div>
          </div>
        </div>

        <div className="modal-meta">
          <div><strong>Trudność</strong><div className="difficulty">{difficultyDots}</div></div>
          <div><strong>Audio</strong><span>{letter.audioUrl ? 'plik MP3' : 'Web Speech API'}</span></div>
        </div>

        <div className="forms-section">
          <div className="forms-title">Formy pozycyjne</div>
          <div className="forms-grid">
            <div><span>Izolowana</span><strong>{letter.forms.isolated}</strong></div>
            <div><span>Początkowa</span><strong>{letter.forms.initial}</strong></div>
            <div><span>Środkowa</span><strong>{letter.forms.medial}</strong></div>
            <div><span>Końcowa</span><strong>{letter.forms.final}</strong></div>
          </div>
        </div>

        <div className="examples-detail">
          <div className="forms-title">Przykłady</div>
          {letter.examples.map((ex, wi) => (
            <div key={wi} className="word detail-word">
              {Array.from(ex.word).map((ch, ci) => (
                <span key={ci} className={activeSymbol === ch ? 'highlight' : ''}>{ch}</span>
              ))}
              {' '}— {ex.translit}
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className={`select ${isActive ? 'selected' : ''}`} onClick={() => onToggleActive(letter.symbol)}>
            {isActive ? 'Usuń aktywną literę' : 'Ucz się tej litery'}
          </button>
          <button className={`select ${isKnown ? 'known' : ''}`} onClick={() => onToggleKnown(letter.symbol)}>
            {isKnown ? 'Usuń z poznanych' : 'Oznacz jako poznane'}
          </button>
        </div>
      </div>
    </div>
  )
}
