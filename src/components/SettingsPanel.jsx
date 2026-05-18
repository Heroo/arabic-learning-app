import React, { useState } from 'react'

export default function SettingsPanel({ settings, progress, onChange, onImport, onResetProgress, onResetSettings }) {
  const [importError, setImportError] = useState(null)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      onImport(parsed)
      setImportError(null)
    } catch (error) {
      setImportError('Niepoprawny format JSON.')
    }
  }

  const downloadJson = () => {
    const data = JSON.stringify({ settings, progress }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'arabic-learning-settings.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section id="settings" className="settings-section">
      <div className="section-header">
        <h2>Ustawienia</h2>
        <p>Dostosuj motyw, rozmiar tekstu i zachowanie aplikacji. Możesz też eksportować lub importować swoje dane.</p>
      </div>

      <div className="settings-grid">
        <label>
          Motyw
          <select value={settings.theme} onChange={(event) => onChange({ ...settings, theme: event.target.value })}>
            <option value="light">Jasny</option>
            <option value="dark">Ciemny</option>
          </select>
        </label>

        <label>
          Rozmiar czcionki
          <input
            type="range"
            min="14"
            max="22"
            value={settings.fontSize}
            onChange={(event) => onChange({ ...settings, fontSize: Number(event.target.value) })}
          />
          <span>{settings.fontSize}px</span>
        </label>

        <label>
          Szybkość audio
          <select value={settings.audioRate} onChange={(event) => onChange({ ...settings, audioRate: Number(event.target.value) })}>
            <option value="0.8">0.8x</option>
            <option value="0.9">0.9x</option>
            <option value="1">1x</option>
            <option value="1.1">1.1x</option>
            <option value="1.25">1.25x</option>
          </select>
        </label>

        <label>
          Pokaż harakat
          <input
            type="checkbox"
            checked={settings.showHarakat}
            onChange={(event) => onChange({ ...settings, showHarakat: event.target.checked })}
          />
        </label>

        <label>
          Język interfejsu
          <select value={settings.uiLanguage} onChange={(event) => onChange({ ...settings, uiLanguage: event.target.value })}>
            <option value="pl">Polski</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <div className="settings-actions">
        <button className="button-secondary" type="button" onClick={downloadJson}>Eksportuj ustawienia i progres</button>
        <label className="button-secondary file-label">
          Importuj dane
          <input type="file" accept="application/json" onChange={handleFile} />
        </label>
        <button className="button-secondary" type="button" onClick={onResetSettings}>
          Resetuj ustawienia
        </button>
        <button
          className="button-danger"
          type="button"
          onClick={() => {
            if (window.confirm('Na pewno chcesz zresetować wszystkie postępy?')) {
              onResetProgress()
            }
          }}
        >
          Resetuj progres
        </button>
      </div>

      {importError && <p className="import-error">{importError}</p>}
    </section>
  )
}
