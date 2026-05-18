import { render, screen, fireEvent } from '@testing-library/react'
import LetterDetailModal from './LetterDetailModal'
import letters from '../data/letters.json'

describe('LetterDetailModal', () => {
  const letter = letters[0]

  it('renders modal content and responds to actions', () => {
    const onClose = vi.fn()
    const onToggleActive = vi.fn()
    const onToggleKnown = vi.fn()

    render(
      <LetterDetailModal
        letter={letter}
        activeSymbol={letter.symbol}
        knownSymbols={[letter.symbol]}
        onClose={onClose}
        onToggleActive={onToggleActive}
        onToggleKnown={onToggleKnown}
      />
    )

    expect(screen.getByText(letter.name_ar)).toBeInTheDocument()
    expect(screen.getByText(letter.ipa)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zamknij/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Usuń aktywną literę/i }))
    expect(onToggleActive).toHaveBeenCalledWith(letter.symbol)

    fireEvent.click(screen.getByRole('button', { name: /Usuń z poznanych/i }))
    expect(onToggleKnown).toHaveBeenCalledWith(letter.symbol)

    fireEvent.click(screen.getByRole('button', { name: /Zamknij/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when no letter is passed', () => {
    const { container } = render(
      <LetterDetailModal
        letter={null}
        activeSymbol={null}
        knownSymbols={[]}
        onClose={() => {}}
        onToggleActive={() => {}}
        onToggleKnown={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
