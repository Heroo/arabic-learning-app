# Arabic Alphabet Learning App — Project Plan

**Target:** Personal learning tool, deployed to GitHub Pages
**Timeline:** 2–4 weeks, hobby pace, iterative
**Stack:** React + Vite + Tailwind CSS + Web Audio API
**Persistence:** LocalStorage (per-device)

-----

## 1. Project Goals

1. Learn the 28 Arabic letters with proper pronunciation, anchored in Polish phonetic intuition.
1. Build word-recognition skill by **highlighting the letter currently being learned** in every example word so the eye trains on shape recognition across positions (isolated, initial, medial, final).
1. Develop reading fluency through harakat (vowel marks) and short word drills.
1. Track progress over weeks with spaced repetition logic.
1. Ship to GitHub Pages as a polished, sharable PWA — even if used only personally.

-----

## 2. Core Pedagogical Principles

These shape every feature:

- **One letter at a time.** Focused attention beats scattered exposure. The “letter of the day/session” is visually emphasized everywhere it appears.
- **Polish phonetic anchor.** Every Arabic letter is mapped to the closest Polish sound *or* explicitly flagged as “brak w polskim” (no Polish equivalent — e.g., ع ‎, ح ‎, ق ‎, ط ‎) with an audio comparison.
- **Multi-position exposure.** Arabic letters look different at the start, middle, end of words, and standalone. Every learning card shows all four forms with the active letter colored.
- **Audio-first.** Every visible Arabic character or word must be tappable to hear it. Silent reading is forbidden in MVP.
- **Active recall.** SRS-style review: letters seen correctly less recently surface more often.
- **No translation crutch for letters.** Letter learning stays in shape+sound space. Polish translation appears only at the word/vocabulary layer.

-----

## 3. Feature Breakdown

### Status realizacji
- [x] 3.1 Alphabet Explorer: siatka liter, szczegóły litery, aktywna litera, poznane litery, formy pozycyjne, wsparcie Web Speech API
- [x] 3.2 Letter Highlighter: aktywna litera podświetla wystąpienia w przykładach i słownictwie
- [x] 3.3 Phonetics & Sound Library: Web Speech API jako fallback
- [x] 3.4 Harakat Module: gotowy moduł harakat z przykładami i odtwarzaniem audio
- [x] 3.5 Vocabulary & Words Module: baza słówek z kategoriami i aktywnym podświetleniem
- [ ] 3.5 Vocabulary audio: każde słowo i litera z własnym odtwarzaniem audio
- [ ] 3.5 Flashcard / favorites / “I know this” w słówkach
- [ ] 3.6 Writing Practice: śledzenie napisów / przycisk do trasowania
- [ ] 3.7 Quizzes & Progress: quizy, dashboard postępów, SRS, statystyki
- [ ] 3.8 Settings: motyw, rozmiar czcionki, audio speed, wyłączanie harakat, język UI, eksport/import

### 3.1 Alphabet Explorer (MVP — Week 1)

The home of letter learning.

**View:** Grid of 28 letters in Arabic alphabetical order (ا ب ت ث ج ح خ …).

**Per-letter card shows:**

- Large letter glyph (isolated form)
- Letter name in Arabic + transliteration (e.g., ب → “bāʾ” / “ba”)
- Polish phonetic hint: `ب → "b" jak w "byk"`
- IPA: `/b/`
- Audio play button (pre-recorded MP3)
- “Brak odpowiednika” badge if no Polish equivalent (with comparison audio: “Polskie ‘h’ vs arabskie ح”)
- Position forms displayed in a 4-column mini-table: ـب ـبـ بـ ب (final, medial, initial, isolated)
- Difficulty marker (1–3 dots) — emphatic and pharyngeal letters get 3

**Interaction:**

- Click letter card → detail modal with larger forms, slower audio, mnemonic, and 3 example words with the letter highlighted
- “Mark as learning” toggle → sets this as the **active highlighted letter** across the app
- “Mark as known” — moves to mastered pool, surfaces less in SRS

### 3.2 Letter Highlighter (signature feature)

The core differentiator. When a target letter is active, **every Arabic word displayed anywhere in the app** has that letter visually distinguished.

**Implementation logic:**

- Each word stored as an array of characters with metadata (base letter, position in word, harakat).
- A `<HighlightedWord>` component takes the word + active letter, renders each character with conditional styling:
  - **Active letter:** vivid accent color (e.g., warm amber `#D97706` or coral), bold, slightly larger, subtle underline
  - **Other letters:** muted ink color (`#1F2937` on light, `#E5E7EB` on dark)
- Handle Arabic ligatures carefully — letters like ل + ا form لا. The highlighter must recognize the base letter even within a ligature.
- Edge cases: hamza variants (أ إ ؤ ئ ء) — decide whether they count as “alif” or separate. Recommendation: treat as separate but offer a “show all hamza-family” toggle.

**Why this works:** Polish learners (and any non-native script learner) struggle most with recognizing the *same letter in different word positions*. Coloring makes the same shape visually obvious across morphological contexts.

### 3.3 Phonetics & Sound Library (Week 1–2)

**Audio assets needed:**

- 28 letters × 4 forms × 1 audio = 28 base files (one per letter, since the sound is the same across forms)
- 28 letters × 3 harakat (fatha/kasra/damma) = 84 syllable files (e.g., بَ بِ بُ → “ba”, “bi”, “bu”)
- Letter names spoken (28 files: “bāʾ”, “tāʾ”, …)
- ~100 example words for MVP (5–10 per letter for primary positions)

**Sources (in priority order):**

1. **Pre-recorded studio files.** Best quality. Options:
- Wiktionary Commons: many letters have CC-BY-SA recordings ([commons.wikimedia.org](https://commons.wikimedia.org))
- [Tatoeba](https://tatoeba.org) — sentence-level audio, MSA available
- [Forvo](https://forvo.com) — word-level, requires API or manual download
- **Record your own** with Audacity if a native speaker is reachable
1. **Web Speech API** as fallback for dynamic words not in the asset library:
   
   ```js
   const utter = new SpeechSynthesisUtterance(word);
   utter.lang = 'ar-SA';
   speechSynthesis.speak(utter);
   ```
   
   Quality varies by browser/OS but works offline on most devices.
1. **TTS API** (optional later): ElevenLabs or Google Cloud TTS for premium quality if Web Speech is too robotic.

**File organization:**

```
/public/audio/
  /letters/        ba.mp3, ta.mp3, tha.mp3, ...
  /letter-names/   ba_name.mp3, ta_name.mp3, ...
  /harakat/        ba-fatha.mp3, ba-kasra.mp3, ba-damma.mp3, ...
  /words/          kitab.mp3, bayt.mp3, ...
```

Naming convention: ASCII transliteration to avoid encoding issues on GitHub Pages.

**Polish phonetic mapping** (all 28 letters — to be stored in `phonetics.json`):

|Arabic|Name|Polish hint                     |IPA     |Notes for Polish speaker           |
|------|----|--------------------------------|--------|-----------------------------------|
|ا     |alif|“a” jak w “lampa” (długie)      |/aː/    |Długa samogłoska                   |
|ب     |bāʾ |“b” jak w “byk”                 |/b/     |Identyczne                         |
|ت     |tāʾ |“t” jak w “tata”                |/t/     |Identyczne                         |
|ث     |ṯāʾ |jak ang. “th” w “think”         |/θ/     |Brak w polskim, język między zębami|
|ج     |jīm |“dż” jak w “dżem”               |/dʒ/    |Identyczne                         |
|ح     |ḥāʾ |mocne, gardłowe “h”             |/ħ/     |**Brak w polskim**, ciasne gardło  |
|خ     |ḫāʾ |“ch” jak w “chleb” (mocniejsze) |/x/     |Bardzo bliskie polskiemu           |
|د     |dāl |“d” jak w “dom”                 |/d/     |Identyczne                         |
|ذ     |ḏāl |jak ang. “th” w “this”          |/ð/     |Brak w polskim, dźwięczne          |
|ر     |rāʾ |“r” jak w “ryba” (rolowane)     |/r/     |Identyczne                         |
|ز     |zāy |“z” jak w “zebra”               |/z/     |Identyczne                         |
|س     |sīn |“s” jak w “sok”                 |/s/     |Identyczne                         |
|ش     |šīn |“sz” jak w “szafa”              |/ʃ/     |Identyczne                         |
|ص     |ṣād |“s” emfatyczne, ciemne          |/sˤ/    |**Brak w polskim**, język wgłębiony|
|ض     |ḍād |“d” emfatyczne, ciemne          |/dˤ/    |**Brak w polskim**                 |
|ط     |ṭāʾ |“t” emfatyczne, ciemne          |/tˤ/    |**Brak w polskim**                 |
|ظ     |ẓāʾ |emfatyczne “th” (this)          |/ðˤ/    |**Brak w polskim**                 |
|ع     |ʿayn|dźwięczne ściśnięcie gardła     |/ʕ/     |**Brak w polskim**, najtrudniejsza |
|غ     |ġayn|jak francuskie “r” gardłowe     |/ɣ/     |Brak w polskim, bliskie niem. “r”  |
|ف     |fāʾ |“f” jak w “foka”                |/f/     |Identyczne                         |
|ق     |qāf |“k” z głębi gardła              |/q/     |**Brak w polskim**                 |
|ك     |kāf |“k” jak w “kot”                 |/k/     |Identyczne                         |
|ل     |lām |“l” jak w “las”                 |/l/     |Identyczne                         |
|م     |mīm |“m” jak w “mama”                |/m/     |Identyczne                         |
|ن     |nūn |“n” jak w “noc”                 |/n/     |Identyczne                         |
|ه     |hāʾ |“h” lekkie jak w “hak”          |/h/     |Identyczne (lekkie)                |
|و     |wāw |“ł” jak w “łaska” lub “u” długie|/w/ /uː/|Spółgłoska lub samogłoska          |
|ي     |yāʾ |“j” jak w “jajko” lub “i” długie|/j/ /iː/|Spółgłoska lub samogłoska          |

### 3.4 Harakat (Vowel Marks) Module (Week 2)

Arabic text is usually written without short vowels. Learners must know how to read with harakat first.

**Marks to teach:**

- Fatha (◌َ) — “a”
- Kasra (◌ِ) — “i”
- Damma (◌ُ) — “u”
- Sukūn (◌ْ) — brak samogłoski
- Shadda (◌ّ) — podwojenie spółgłoski
- Tanwīn (◌ً ◌ٍ ◌ٌ) — “an”, “in”, “un” (końcówki)

**Exercises:**

- Show ب alone → tap to hear “b”
- Show بَ → tap to hear “ba”
- Show بِ → tap to hear “bi”
- Mini-quiz: hear audio “tu” → pick correct visual from تَ تِ تُ

### 3.5 Vocabulary & Words Module (Week 2–3)

Beginner words organized into themes:

- **Greetings:** سَلام (pokój), مَرحَبا (witaj), شُكراً (dziękuję)
- **Family:** أَب (ojciec), أُم (matka), بِنت (córka), اِبن (syn)
- **House:** بَيت (dom), باب (drzwi), كِتاب (książka)
- **Numbers:** 0–10
- **Colors:** أَحمَر (czerwony), أَزرَق (niebieski), …
- **Food/animals** (great for kids)

**Per word:**

- Arabic with harakat
- Letter-highlighted version (active letter colored)
- Polish translation
- Audio
- Letter-by-letter breakdown panel (tap each letter → hear it)
- “Add to favorites” / “I know this” toggle

**Flashcard mode** (SRS — Spaced Repetition System):

- Lightweight Leitner-box algorithm (no need for full SM-2)
- 5 boxes: review intervals 1d / 2d / 4d / 7d / 14d
- Correct answer → promote one box; incorrect → back to box 1
- Daily review queue surfaced on dashboard

### 3.6 Writing Practice (Week 3 — optional)

- SVG-based tracing: each letter has stroke order data
- User drags finger/mouse along path
- Visual feedback when stroke matches direction (RTL!)
- Sources: existing open-source projects like [Arabic Letter Trace](https://github.com/topics/arabic-learning) on GitHub for stroke data, or trace yourself once in Figma → export SVG

Can be deferred to v2.

### 3.7 Quizzes & Progress (Week 3–4)

**Quiz types:**

1. **Letter → Sound:** see ج, hear 4 options, pick the right audio
1. **Sound → Letter:** hear /ʕ/, pick from 4 letter glyphs
1. **Letter → Name:** see ث, pick “ṯāʾ” from options
1. **Position recognition:** see word مكتبة with ت highlighted in medial form, identify which letter is highlighted
1. **Harakat read:** see بِ, pick “bi” from “ba/bi/bu”
1. **Polish phonetic match:** see ك, pick “k jak w kot” from Polish hints

**Progress dashboard:**

- Letters: 0/28 learned (with visual grid showing mastery level per letter)
- Quiz accuracy over time (line chart)
- Streak counter
- Words mastered count
- Time spent (rough estimate from sessions)
- Weak letters list (highlight what to drill next)

### 3.8 Settings (Week 4)

- Font choice for Arabic (Amiri, Scheherazade New, Noto Naskh Arabic, Cairo) — these are free Google Fonts
- Font size slider
- Audio playback speed (0.75x / 1x / 1.25x)
- Show/hide harakat toggle
- Highlight color picker
- Theme: light / dark / sepia (sepia is friendly for long reading)
- UI language: Polish (default) / English
- Export progress as JSON
- Import progress JSON
- Reset all progress (with confirm)

-----

## 4. Information Architecture

```
/                       → Dashboard (today's review, streak, jump-back-in)
/alphabet               → 28-letter grid
/alphabet/:letter       → Letter detail (forms, audio, examples)
/harakat                → Vowel marks lesson
/words                  → Vocabulary library
/words/:theme           → Theme-filtered word list
/practice               → Flashcards / SRS review queue
/quiz                   → Quiz launcher
/quiz/:type             → Quiz session
/writing                → Tracing (v2)
/progress               → Statistics
/settings               → Preferences
```

-----

## 5. Data Model

All in LocalStorage, JSON-serializable.

```ts
// Static data — bundled with app
type Letter = {
  id: string;              // 'baa'
  arabic: string;          // 'ب'
  name: string;            // 'bāʾ'
  nameArabic: string;      // 'باء'
  forms: {
    isolated: string;      // 'ب'
    initial: string;       // 'بـ'
    medial: string;        // 'ـبـ'
    final: string;         // 'ـب'
  };
  ipa: string;             // '/b/'
  polishHint: string;      // 'b jak w byk'
  polishExample: string;   // 'byk'
  noPolishEquivalent: boolean;
  difficulty: 1 | 2 | 3;
  audioFile: string;       // 'ba.mp3'
  mnemonic?: string;       // 'Kropka pod literką — ba na dole'
  category: 'sun' | 'moon'; // ważne dla أل (al-)
};

type Word = {
  id: string;
  arabic: string;          // 'كِتاب'
  arabicNoHarakat: string; // 'كتاب'
  letters: string[];       // ['kaaf', 'taa', 'alif', 'baa']
  transliteration: string; // 'kitāb'
  polish: string;          // 'książka'
  audioFile: string;       // 'kitab.mp3'
  themes: string[];        // ['school', 'objects']
  difficulty: 1 | 2 | 3;
};

// User state — LocalStorage
type UserProgress = {
  activeLetter: string | null;       // for highlighting
  letterMastery: Record<string, {
    box: 1 | 2 | 3 | 4 | 5;          // SRS box
    correctCount: number;
    incorrectCount: number;
    lastReviewed: ISODateString;
    nextDue: ISODateString;
  }>;
  wordMastery: Record<string, { ... }>;
  settings: {
    arabicFont: string;
    fontSize: number;
    audioSpeed: number;
    showHarakat: boolean;
    highlightColor: string;
    theme: 'light' | 'dark' | 'sepia';
    uiLanguage: 'pl' | 'en';
  };
  stats: {
    streakDays: number;
    lastSessionDate: ISODateString;
    totalSessions: number;
    quizHistory: { date, type, score, total }[];
  };
};
```

-----

## 6. Visual & Aesthetic Direction

This is a *personal* learning tool that should feel calm, focused, and a bit reverent — not gamified-noisy like Duolingo.

**Mood:** Editorial, slightly Middle-Eastern-influenced, generous spacing, beautiful Arabic typography front and center.

**Typography:**

- Arabic body: **Amiri** (classical, elegant) or **Scheherazade New** (clear, beginner-friendly)
- Arabic display: **Reem Kufi** for headers, geometric and modern
- Latin/Polish: **Fraunces** (serif, characterful) for headers, **Inter** would be too generic — use **DM Sans** or **Geist** for UI text

**Color palette (suggestion):**

- Background: warm off-white `#FAF7F2` (sepia-leaning)
- Ink: deep brown-black `#1A1410`
- Accent / highlighted letter: amber `#B45309` (warm, readable against ink)
- Secondary accent: terracotta `#9F4A2C`
- Muted UI: warm grey `#8B7E6A`
- Success: olive `#5C7C2A`
- Dark mode: deep navy ink `#0F1419` with parchment text `#E8DDC8`

**Motion:**

- Letter cards: gentle scale + fade on hover
- Active letter highlight: subtle pulse on selection (300ms ease-out)
- Page transitions: 200ms fade
- Audio play button: ripple effect on tap

**Layout principles:**

- RTL-aware throughout (use CSS logical properties: `padding-inline-start`, `margin-inline-end`)
- Arabic text always rendered with `dir="rtl"` and `lang="ar"`
- Mixed Polish/Arabic content uses `<bdi>` to prevent direction bleeding

-----

## 7. Technical Implementation Notes

### Stack rationale

- **Vite** — fastest dev experience, simple GitHub Pages build (`vite build` → `dist/`)
- **React** — component reuse for letter cards, highlighter, flashcards
- **Tailwind** — RTL support via `dir="rtl"` and `rtl:` variants
- **No backend** — everything in LocalStorage, audio served from `/public`
- **Optional later:** Zustand for state management if `useState` chains get unwieldy

### GitHub Pages deployment

- Repo: `arabic-learning` (private or public)
- `vite.config.js` → set `base: '/arabic-learning/'` to match repo name
- GitHub Actions workflow on push to `main`:
  
  ```yaml
  - npm ci && npm run build
  - peaceiris/actions-gh-pages@v3 → publish dist/
  ```
- Enable Pages in repo settings → source: `gh-pages` branch
- Custom domain optional later

### Audio handling

- Lazy-load audio files — don’t bundle 200 MP3s into the JS bundle
- Use the native `<audio>` element or `new Audio(src)` constructor
- Preload audio for the *active letter* and its examples when user enters a screen
- Cache strategy: Service Worker (later) for offline use

### Arabic text rendering gotchas

- Always specify `lang="ar"` and `dir="rtl"` on Arabic spans
- Some fonts render harakat positioning poorly at small sizes — set min `font-size: 1.5rem` for harakat
- `font-feature-settings: "ss01"` or similar may improve specific letter shapes depending on font
- Test on iOS Safari, Chrome, Firefox — Arabic shaping has historically had edge cases

### Letter highlighting algorithm

Word string → split into “grapheme clusters” (letter + its harakat). Each cluster maps to one base letter. The render loop checks if base letter matches active letter.

```js
function tokenizeArabic(word) {
  // Combines base letter + following diacritics into one token
  const tokens = [];
  let current = '';
  for (const char of [...word]) {
    if (isDiacritic(char)) {
      current += char; // attach to previous letter
    } else {
      if (current) tokens.push(current);
      current = char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

function HighlightedWord({ word, activeLetter }) {
  const tokens = tokenizeArabic(word);
  return (
    <span dir="rtl" lang="ar">
      {tokens.map((tok, i) => {
        const baseChar = tok[0];
        const isActive = baseChar === activeLetter;
        return (
          <span key={i} className={isActive ? 'text-amber-700 font-bold' : ''}>
            {tok}
          </span>
        );
      })}
    </span>
  );
}
```

-----

## 8. Week-by-Week Roadmap

### Week 1: Foundations

- [ ] Scaffold Vite + React + Tailwind + RTL config
- [ ] Set up repo + GitHub Pages workflow + first deploy of “Hello”
- [ ] Build `letters.json` with all 28 entries (data table from §3.3)
- [ ] Record/download audio for 28 letter names + 28 letter sounds
- [ ] Build Alphabet Explorer grid (read-only)
- [ ] Build Letter Detail page with forms + audio
- [ ] Implement `HighlightedWord` component
- [ ] LocalStorage hook (`useLocalState`)
- [ ] Settings: theme + font

### Week 2: Phonetics & Words

- [ ] Harakat module with audio
- [ ] First 50 vocabulary words across 5 themes
- [ ] Letter-by-letter word breakdown panel
- [ ] “Mark as learning” / “Mark as known” wiring
- [ ] Dashboard skeleton

### Week 3: Practice & Quizzes

- [ ] Leitner SRS engine (in plain JS)
- [ ] Flashcard component + review queue
- [ ] Quiz framework (one engine, multiple types)
- [ ] 6 quiz types from §3.7
- [ ] Progress stats page with recharts

### Week 4: Polish & Publish

- [ ] PWA manifest + favicon + app icon
- [ ] Service Worker for offline (optional but valuable)
- [ ] Settings screen complete (export/import JSON)
- [ ] Visual polish pass (motion, hover states, empty states)
- [ ] Mobile responsive QA
- [ ] Privacy: no analytics or tracking
- [ ] Write README with screenshots
- [ ] Optional: writing/tracing module

-----

## 9. Open Questions to Decide Before Building

Mark these answers in a comment or follow-up message and I’ll lock them in:

1. **Repo visibility:** public (others can fork and learn) or private?
1. **Quran context:** add a tab for short Quranic phrases later, or keep strictly MSA?
1. **Child mode:** since you have a 4-year-old, do you want a kid-friendly variant later (bigger letters, fewer words per screen, animal-themed vocab)?
1. **Audio recording:** are you OK with TTS quality for MVP, or do you want to source pre-recorded audio before launch?
1. **Letter order:** strict Arabic alphabetical (ا ب ت ث…) or frequency-based for faster reading wins (most common letters first)?
1. **Hamza handling:** treat أ إ ؤ ئ ء as one family or five separate items?
1. **Visual identity:** does the warm-sepia + amber palette feel right, or do you prefer something else (cooler/blue, monochrome, more vibrant)?

-----

## 10. Future Ideas (Post-Launch / v2)

- Sentence-level reading from Tatoeba
- Connected handwriting practice with stroke recognition (ML, e.g., TensorFlow.js)
- AI conversation partner using Claude API for sentence construction practice
- Audio dictation: hear a word, type it in Arabic (great muscle memory)
- Root-pattern explorer (semitic root system: ك-ت-ب → كَتَب write, كِتاب book, مَكتَب office, مَكتَبة library)
- Daily ayah or hadith with full breakdown (if Quran tab added)
- Mobile app via Capacitor (same React code → iOS/Android)
- Community deck-sharing (export/import already lays the groundwork)

-----

## 11. Risks & Mitigations

|Risk                                               |Mitigation                                                                                      |
|---------------------------------------------------|------------------------------------------------------------------------------------------------|
|Audio quality from TTS is poor for Arabic          |Plan B: budget weekend to record letters manually with Audacity, or download Wiktionary CC files|
|Arabic font rendering inconsistency across browsers|Stick to 1–2 well-tested Google Fonts (Amiri + Scheherazade), test on iOS/Android early         |
|Letter highlighter breaks on ligatures (لا, لله)   |Write tokenizer with explicit ligature handling, unit-test with 50 example words                |
|Scope creep (writing module, AI features)          |Lock MVP to weeks 1–3, defer everything else to v2                                              |
|Losing motivation mid-build                        |Weeks are modular — even Week 1 alone is usable as a flashcard tool                             |
|LocalStorage gets wiped                            |JSON export reminder once a week + import flow tested                                           |

-----

## 12. Success Metrics (for yourself)

- Recognize 28 letters in isolation in <2s each
- Read any of the first 50 vocab words aloud without hesitation
- Correctly identify any letter in any position in a new word
- Maintain a 14-day streak using the app
- Be able to read 3-letter Quranic words like بَعد، قَبل، عَلى by end of week 4

-----

*This plan is intentionally over-specified — pick what you want for MVP and defer the rest. The “two pillars” that make this app unique are: (1) consistent active-letter highlighting across every word, and (2) Polish phonetic mapping with explicit “brak w polskim” callouts. Everything else is supporting infrastructure.*