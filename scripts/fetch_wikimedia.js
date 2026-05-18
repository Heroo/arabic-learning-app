// Simple script to search Wikimedia Commons for Arabic letter audio files
// Usage: `node scripts/fetch_wikimedia.js > audio-urls.json`
// Requires Node 18+ for global fetch.

const letters = [
  'alif','ba','ta','tha','jim','ha','kha','dal','dhal','ra','zay','sin','shin','sad','dad','ta','za','ayn','ghayn','fa','qaf','kaf','lam','mim','nun','ha','waw','ya'
]

async function search(term){
  const q = encodeURIComponent(term + ' pronunciation audio site:commons.wikimedia.org');
  // Use Wikimedia API search for media - use 'search' action on commons
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(term + ' pronunciation audio')}&srnamespace=6&srwhat=text&srprop='`;
  try{
    const res = await fetch(url)
    const j = await res.json()
    return j.query && j.query.search ? j.query.search.map(s=>s.title) : []
  }catch(e){
    console.error('search error', e)
    return []
  }
}

(async ()=>{
  const out = {}
  for(const l of letters){
    const titles = await search(l + ' Arabic letter')
    out[l]=titles.slice(0,3)
    // be gentle
    await new Promise(r=>setTimeout(r, 500))
  }
  console.log(JSON.stringify(out,null,2))
})()
