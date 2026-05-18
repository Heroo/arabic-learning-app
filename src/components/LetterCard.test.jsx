import { render, screen, fireEvent } from '@testing-library/react'
import LetterCard from './LetterCard'
import letters from '../data/letters.json'

describe('LetterCard', () => {
  const letter = letters[0]

  it('renders the letter card and calls select and known handlers', () => {
    const onSelect = vi.fn()
    const onToggleKnown = vi.fn()
    const onOpenDetails = vi.fn()

    render(
      <LetterCard
        letter={letter}
        activeSymbol={letter.symbol}
        knownSymbols={[letter.symbol]}
        onSelect={onSelect}
        onToggleKnown={onToggleKnown}
        onOpenDetails={onOpenDetails}
      />
    )

    expect(screen.getByText(letter.symbol)).toBeInTheDocument()
    expect(screen.getByText(`${letter.name_ar} · ${letter.polish}`)).toBeInTheDocument()
    expect(screen.getByText(/Poznane/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Aktywna/i }))
    expect(onSelect).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /Usuń z poznanych/i }))
    expect(onToggleKnown).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /Szczegóły/i }))
    expect(onOpenDetails).toHaveBeenCalledTimes(1)
  })
})
