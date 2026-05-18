import React, { useState, useRef } from 'react'
import harakat from '../data/harakat.json'

const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window

export default function HarakatModule({ activeHarakat, onSelectHarakat, audioRate = 1 }) {
  const [playing, setPlaying] = useState(false)
  const [activeExample, setActiveExample] = useState(null)
  const synthRef = useRef(hasSpeech ? window.speechSynthesis : null)

  const play = async (item) => {
    if (playing) return
    setPlaying(true)
    onSelectHarakat(item.symbol)
    setActiveExample(null)

    if (synthRef.current) {
      const utter = new SpeechSynthesisUtterance(item.examples[0].word)
      utter.lang = 'ar-SA'
      utter.rate = audioRate
      synthRef.current.cancel()
      synthRef.current.speak(utter)
    }

    for (let i = 0; i < item.examples.length; i++) {
      setActiveExample(i)
      await wait(500)
    }

    setActiveExample(null)
    setPlaying(false)
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <section id="harakat" className="harakat-section">
      <div className="harakat-header">
        <div>
          <h2>Harakat — krótki samogłoski</h2>
          <p>Ucz się fatha, kasra i damma z krótkimi przykładami. Naciśnij przycisk audio, aby usłyszeć wymowę i podświetlić przykłady.</p>
        </div>
        <div className="harakat-note">
          {hasSpeech ? 'Web Speech API dostępne' : 'Web Speech API nie jest dostępne w tej przeglądarce'}
        </div>
      </div>

      <div className="harakat-grid">
        {harakat.map((item) => {
          const isActive = activeHarakat === item.symbol
          return (
            <article key={item.symbol} className={`harakat-card ${isActive ? 'harakat-card-active' : ''}`}>
              <div className="harakat-title">
                <div className="harakat-symbol">{item.symbol}</div>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </div>
              </div>

              <div className="harakat-actions">
                <button className="play" onClick={() => play(item)} disabled={!hasSpeech || playing}>
                  {playing && isActive ? 'Odtwarzanie...' : 'Odtwórz'}
                </button>
                <button className={`select ${isActive ? 'selected' : ''}`} onClick={() => onSelectHarakat(item.symbol)}>
                  {isActive ? 'Aktywna' : 'Wybierz'}
                </button>
              </div>

              <div className="harakat-examples">
                {item.examples.map((example, index) => {
                  const highlight = activeExample === index || isActive
                  return (
                    <div key={index} className={`harakat-example ${highlight ? 'highlight' : ''}`}>
                      <span className="example-word">{example.word}</span>
                      <span className="example-translit">{example.translit}</span>
                    </div>
                  )
                })}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
