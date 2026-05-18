import React, { useMemo, useState } from 'react'

const shuffle = (array) => array.slice().sort(() => Math.random() - 0.5)

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)]

export default function QuizSection({ letters, harakat, vocabulary, onRecordQuiz }) {
  const quizTypes = [
    { key: 'letter-name', label: 'Litera → nazwa' },
    { key: 'harakat', label: 'Harakat → wymowa' },
    { key: 'word-meaning', label: 'Słowo → znaczenie' },
    { key: 'position', label: 'Rozpoznaj literę' }
  ]

  const [quizType, setQuizType] = useState('letter-name')
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [session, setSession] = useState({ score: 0, total: 0 })

  const allWords = useMemo(() => vocabulary.flatMap((group) => group.words), [vocabulary])

  const generateQuestion = (type) => {
    if (type === 'letter-name') {
      const letter = getRandomItem(letters)
      const correct = `${letter.name_ar} (${letter.polish})`
      const options = shuffle([
        correct,
        ...shuffle(letters.filter((item) => item.symbol !== letter.symbol).map((item) => `${item.name_ar} (${item.polish})`)).slice(0, 3)
      ])
      return { prompt: letter.symbol, options, answer: correct, label: 'Wybierz nazwę litery' }
    }

    if (type === 'harakat') {
      const item = getRandomItem(harakat)
      const example = getRandomItem(item.examples)
      const correct = example.translit
      const options = shuffle([
        correct,
        ...shuffle(harakat.flatMap((entry) => entry.examples.map((e) => e.translit)).filter((value) => value !== correct)).slice(0, 3)
      ])
      return { prompt: example.word, options, answer: correct, label: 'Wybierz prawidłową transkrypcję' }
    }

    if (type === 'word-meaning') {
      const word = getRandomItem(allWords)
      const correct = word.word
      const options = shuffle([
        correct,
        ...shuffle(allWords.filter((item) => item.word !== correct).map((item) => item.word)).slice(0, 3)
      ])
      return { prompt: word.polish, options, answer: correct, label: 'Wybierz arabski zapis słowa' }
    }

    if (type === 'position') {
      const word = getRandomItem(allWords)
      const letters = Array.from(word.word).filter((char) => char.trim())
      const correct = getRandomItem(letters)
      return {
        prompt: word.word.replace(new RegExp(correct, 'g'), `<mark>${correct}</mark>`),
        options: shuffle([correct, ...shuffle(letters.filter((letter) => letter !== correct)).slice(0, 3)]),
        answer: correct,
        label: 'Która litera jest podświetlona?',
        html: true
      }
    }

    return null
  }

  const startQuiz = (type) => {
    setQuizType(type)
    setSession({ score: 0, total: 0 })
    setFeedback(null)
    setSelected(null)
    setQuestion(generateQuestion(type))
  }

  const handleAnswer = (option) => {
    if (!question) return
    const correct = option === question.answer
    setFeedback(correct ? 'Poprawnie!' : `Błędnie — poprawna odpowiedź: ${question.answer}`)
    setSession((current) => ({ score: current.score + (correct ? 1 : 0), total: current.total + 1 }))
    setSelected(option)
  }

  const nextQuestion = () => {
    if (session.total >= 4 && question) {
      onRecordQuiz({
        date: new Date().toLocaleDateString('pl-PL'),
        type: quizType,
        score: Math.round((session.score / session.total) * 100),
        total: session.total
      })
      setFeedback('Sesja zakończona. Możesz rozpocząć nowy quiz.')
      setQuestion(null)
      return
    }

    setSelected(null)
    setFeedback(null)
    setQuestion(generateQuestion(quizType))
  }

  return (
    <section id="quiz" className="quiz-section">
      <div className="section-header">
        <h2>Quizy</h2>
        <p>Sprawdź swoją wiedzę na temat liter, harakat i słów.</p>
      </div>

      <div className="quiz-types">
        {quizTypes.map((type) => (
          <button
            key={type.key}
            className={quizType === type.key ? 'active' : ''}
            type="button"
            onClick={() => startQuiz(type.key)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {question ? (
        <div className="quiz-card">
          <p className="quiz-label">{question.label}</p>
          <div className="quiz-prompt" dangerouslySetInnerHTML={{ __html: question.html ? question.prompt : question.prompt }} />
          <div className="quiz-options">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className={selected === option ? 'selected' : ''}
                onClick={() => handleAnswer(option)}
                disabled={!!selected}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && <p className="quiz-feedback">{feedback}</p>}
          {selected && <button type="button" onClick={nextQuestion}>Następne pytanie</button>}
        </div>
      ) : (
        <div className="quiz-empty">
          <p>Wybierz typ quizu, aby rozpocząć.</p>
        </div>
      )}

      <div className="quiz-summary">
        <span>Wynik: {session.score}/{session.total}</span>
      </div>
    </section>
  )
}
