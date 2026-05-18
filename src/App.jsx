import React from 'react'
import letters from './data/letters.json'
import LetterCard from './components/LetterCard'

export default function App(){
  return (
    <div className="container">
      <h1>Arabic Alphabet — MVP</h1>
      <p>Dotknij litery, aby usłyszeć wymowę (Web Speech API). Podświetlanie pokazuje aktywną literę w przykładach.</p>
      <div className="grid">
        {letters.map((l,idx)=>(
          <LetterCard key={idx} letter={l} />
        ))}
      </div>
    </div>
  )
}
