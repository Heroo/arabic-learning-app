import React, {useState, useRef} from 'react'

export default function LetterCard({letter, activeSymbol, knownSymbols, onSelect, onToggleKnown, onOpenDetails}){
  const [playing, setPlaying] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null)
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const audioRef = useRef(null)

  const play = async () => {
    setPlaying(true)

    if(letter.audioUrl){
      try{
        if(audioRef.current){
          audioRef.current.pause()
          audioRef.current.src = ''
        }
        audioRef.current = new Audio(letter.audioUrl)
        audioRef.current.crossOrigin = 'anonymous'
        audioRef.current.play().catch(()=>{})
      }catch(e){
        console.warn('Audio play failed, falling back to TTS', e)
      }
    } else if(synthRef.current){
      const utter = new SpeechSynthesisUtterance(letter.name_ar)
      utter.lang = 'ar-SA'
      utter.rate = 0.9
      synthRef.current.cancel()
      synthRef.current.speak(utter)
    }

    for(const ex of letter.examples){
      await highlightSequence(ex.word)
      await wait(300)
    }

    setPlaying(false)
    setActiveIdx(null)
  }

  const highlightSequence = (word) => {
    return new Promise((resolve)=>{
      const chars = Array.from(word)
      let i = 0
      const step = () => {
        if(i>=chars.length){
          setActiveIdx(null)
          resolve()
          return
        }
        if(chars[i] === letter.symbol){
          setActiveIdx(i)
        } else {
          setActiveIdx(null)
        }
        i++
        setTimeout(step, 280)
      }
      step()
    })
  }

  const wait = (ms)=> new Promise(r=>setTimeout(r,ms))
  const isActiveLetter = activeSymbol === letter.symbol
  const isKnown = knownSymbols?.includes(letter.symbol)
  const difficultyDots = '•'.repeat(letter.difficulty)

  return (
    <div className={`card ${isActiveLetter ? 'card-active' : ''} ${isKnown ? 'card-known' : ''}`}>
      <div className="card-header">
        <div>
          <div className="letter">{letter.symbol}</div>
          <div className="letter-name">{letter.name_ar} · {letter.polish}</div>
          <div className="card-meta">
            <span className="difficulty">{difficultyDots}</span>
            <span className="ipa">{letter.ipa}</span>
          </div>
        </div>
        <div className="actions">
          <button className="play" onClick={play} disabled={playing}>{playing? 'Odtwarzanie...' : 'Odtwórz'}</button>
          <button className={`select ${isActiveLetter ? 'selected' : ''}`} onClick={onSelect}>
            {isActiveLetter ? 'Aktywna' : 'Ucz się'}
          </button>
          <button className={`select ${isKnown ? 'known' : ''}`} onClick={onToggleKnown}>
            {isKnown ? 'Usuń z poznanych' : 'Oznacz jako poznane'}
          </button>
          <button className="details" onClick={onOpenDetails}>Szczegóły</button>
        </div>
      </div>

      {isKnown && <div className="known-badge">Poznane</div>}
      <div className="forms-inline">
        <div><span>Izol.</span><strong>{letter.forms.isolated}</strong></div>
        <div><span>Początk.</span><strong>{letter.forms.initial}</strong></div>
        <div><span>Środ.</span><strong>{letter.forms.medial}</strong></div>
        <div><span>Końc.</span><strong>{letter.forms.final}</strong></div>
      </div>

      <div className="examples">
        {letter.examples.map((ex,wi)=> (
          <div className="word" key={wi}>
            {Array.from(ex.word).map((ch,ci)=> {
              const isActive = (ci===activeIdx && ch===letter.symbol) || activeSymbol === ch
              return <span key={ci} className={isActive ? 'highlight' : ''}>{ch}</span>
            }))}
            {' '}— {ex.translit}
          </div>
        ))}
      </div>
    </div>
  )
}
