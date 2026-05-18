# Audio sources and how to populate `audioUrl`

This project uses `audioUrl` fields in `src/data/letters.json` to play prerecorded audio. Currently they are `null` placeholders.

How to populate:

1. Run the helper to search Wikimedia Commons for candidate audio titles:

```bash
cd /workspaces/arabic-learning-app
node scripts/fetch_wikimedia.js > audio-candidates.json
```

2. Inspect results and pick the best file page titles. Then query the Wikimedia API for the file URL, for example:

```bash
curl "https://commons.wikimedia.org/w/api.php?action=query&titles=File:Example.ogg&prop=imageinfo&iiprop=url&format=json&origin=*"
```

3. Copy the returned `imageinfo[0].url` value into the matching letter's `audioUrl` in `src/data/letters.json`.

4. Commit changes and push.

Automatyzacja: możesz rozszerzyć `scripts/fetch_wikimedia.js` aby zwracał bezpośrednie URL-e zamiast tylko tytułów.
