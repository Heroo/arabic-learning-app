import React, {useState, useEffect, useRef} from 'react'

export default function LetterCard({letter}){
  const [playing, setPlaying] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null)
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const audioRef = useRef(null)

  const play = async () => {
    setPlaying(true)
    // prefer explicit audio URL (darmowe nagrania), fallback to Web Speech API
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

    // highlight occurrences in example words sequentially
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

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div className="letter">{letter.symbol}</div>
          <div>{letter.polish}</div>
        </div>
        <div>
          <button className="play" onClick={play} disabled={playing}>{playing? 'Odtwarzanie...' : 'Odtwórz'}</button>
        </div>
      </div>

      <div className="examples">
        {letter.examples.map((ex,wi)=> (
          <div className="word" key={wi}>
            {Array.from(ex.word).map((ch,ci)=> (
              <span key={ci} className={ci===activeIdx && ch===letter.symbol ? 'highlight' : ''}>{ch}</span>
            ))}
            {' '}— {ex.translit}
          </div>
        ))}
      </div>
    </div>
  )
}
