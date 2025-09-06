import './styles.css'

const el = (tag: string, className?: string, html?: string) => {
  const e = document.createElement(tag)
  if (className) e.className = className
  if (html) e.innerHTML = html
  return e
}

const app = document.getElementById('app')!

// Header
const header = el('header', 'site-header')
header.innerHTML = `
  <div class="brand">📦 Asset Manager</div>
  <nav>
    <span style="opacity:.7">BASE:</span>
    <code>${import.meta.env.BASE_URL}</code>
  </nav>
`

// Helper: build full asset URL under BASE_URL
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/'

const makeUrl = (path: string) => {
  const clean = path.replace(/^\/+/, '') // remove leading slashes
  return base + clean
}

// Builder
const builder = el('section', 'about', `
  <h2>자산 링크 만들기</h2>
  <p class="muted">public 디렉터리 기준 경로를 입력하세요. 예: <code>assets/logo.png</code></p>
  <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap">
    <input id="asset-input" placeholder="assets/..." style="padding:8px; min-width:260px; border-radius:8px; border:1px solid #2a2a30; background:var(--card); color:var(--text)" />
    <button id="build-btn" style="background: var(--card); color: var(--text); border: 1px solid #2a2a30; border-radius: 8px; padding: 8px 12px; cursor: pointer;">만들기</button>
  </div>
  <p id="asset-url" style="margin-top:12px; word-break:break-all"></p>
`)

// List from manifest
const list = el('section', 'projects', `
  <h2>자산 목록 (manifest)</h2>
  <div class="grid" id="asset-list">
    <p class="muted">manifest가 비어있거나 로드되지 않았습니다.</p>
  </div>
`)

app.append(header, builder, list)

// Interactions
const input = document.getElementById('asset-input') as HTMLInputElement
const out = document.getElementById('asset-url')!
document.getElementById('build-btn')!.addEventListener('click', async () => {
  const url = makeUrl(input.value.trim())
  if (!input.value.trim()) {
    out.textContent = '경로를 입력해 주세요.'
    return
  }
  out.innerHTML = `<a href="${url}" target="_blank" rel="noreferrer noopener">${url}</a>`
  try {
    await navigator.clipboard.writeText(url)
    out.innerHTML += ' <span style="color:#86efac">(클립보드에 복사됨)</span>'
  } catch {}
})

// Load manifest from public/assets/manifest.json
type Item = { name: string; path: string; note?: string }
const manifestUrl = makeUrl('assets/manifest.json')
fetch(manifestUrl)
  .then((r) => (r.ok ? r.json() : { items: [] }))
  .then((data: { items?: Item[] }) => {
    const grid = document.getElementById('asset-list')!
    grid.innerHTML = ''
    const items = data.items ?? []
    if (!items.length) {
      grid.innerHTML = '<p class="muted">등록된 자산이 없습니다. manifest.json을 수정하세요.</p>'
      return
    }
    items.forEach((it) => {
      const url = makeUrl(it.path)
      const card = el('article', 'card')
      card.innerHTML = `
        <h3>${it.name}</h3>
        <p class="muted">${it.path}${it.note ? ` • ${it.note}` : ''}</p>
        <a href="${url}" target="_blank" rel="noreferrer noopener">열기 ↗</a>
      `
      grid.appendChild(card)
    })
  })
  .catch(() => {})

