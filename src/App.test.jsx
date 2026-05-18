import { render, screen, within, fireEvent } from '@testing-library/react'
import App from './App'
import letters from './data/letters.json'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('selects an active letter, toggles known letters, and opens the detail modal', () => {
    render(<App />)

    const firstLetter = letters[0]
    const card = screen.getByText(`${firstLetter.name_ar} · ${firstLetter.polish}`).closest('.card')
    expect(card).toBeInTheDocument()

    const learnButton = within(card).getByRole('button', { name: /Ucz się/i })
    fireEvent.click(learnButton)

    const statusBar = screen.getByText(/Aktywna litera:/i).parentElement
    expect(statusBar).toHaveTextContent(firstLetter.symbol)

    const knownButton = within(card).getByRole('button', { name: /Oznacz jako poznane/i })
    fireEvent.click(knownButton)

    const knownStatus = screen.getByText(/Zdobyte litery:/i).parentElement
    expect(knownStatus).toHaveTextContent('1')

    const detailsButton = within(card).getByRole('button', { name: /Szczegóły/i })
    fireEvent.click(detailsButton)

    expect(screen.getByText(firstLetter.name_ar)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zamknij/i })).toBeInTheDocument()
  })
})
