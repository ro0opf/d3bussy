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

// ===== Asset Table =====
type Row = {
  date: string
  gateio_usdt: number
  gateio_krw: number
  bitget_usdt: number
  bitget_krw: number
  okx_usdt: number
  okx_krw: number
  rate: number // KRW per 1 USDT
  note?: string
}

const KEY = 'asset-rows'
const loadRows = (): Row[] => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Row[]
    return parsed.map((r) => ({ ...r }))
  } catch {
    return []
  }
}
const saveRows = (rows: Row[]) => localStorage.setItem(KEY, JSON.stringify(rows))

const headers: { key: keyof Row | 'total_usdt' | 'total_krw' | 'diff_usdt' | 'diff_krw'; label: string }[] = [
  { key: 'date', label: '날짜' },
  { key: 'gateio_usdt', label: 'GateIO (USDT)' },
  { key: 'gateio_krw', label: 'GateIO (KRW)' },
  { key: 'bitget_usdt', label: 'Bitget (USDT)' },
  { key: 'bitget_krw', label: 'Bitget (KRW)' },
  { key: 'okx_usdt', label: 'OKX (USDT)' },
  { key: 'okx_krw', label: 'OKX (KRW)' },
  { key: 'total_usdt', label: 'Total (USDT)' },
  { key: 'total_krw', label: 'Total (KRW)' },
  { key: 'diff_usdt', label: 'Diff (USDT)' },
  { key: 'diff_krw', label: 'Diff (KRW)' },
  { key: 'rate', label: 'Exchange Rate' },
  { key: 'note', label: '비고' }
]

const sumUSDT = (r: Row) => (r.gateio_usdt || 0) + (r.bitget_usdt || 0) + (r.okx_usdt || 0)
const sumKRW = (r: Row) => (r.gateio_krw || 0) + (r.bitget_krw || 0) + (r.okx_krw || 0)
const totalUSDT = (r: Row) => {
  const rate = r.rate || 0
  const usdt = sumUSDT(r)
  const krw = sumKRW(r)
  if (rate > 0) return usdt + krw / rate
  return usdt
}
const totalKRW = (r: Row) => {
  const rate = r.rate || 0
  const usdt = sumUSDT(r)
  const krw = sumKRW(r)
  if (rate > 0) return krw + usdt * rate
  return krw
}

const fmt = (n: number | null | undefined, digits = 2) =>
  typeof n === 'number' && isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : '-'

const assetSection = el('section', 'projects')
assetSection.innerHTML = `
  <h2>자산 현황</h2>
  <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin:8px 0 12px">
    <button id="add-row" style="background: var(--card); color: var(--text); border: 1px solid #2a2a30; border-radius: 8px; padding: 8px 12px; cursor: pointer;">행 추가</button>
    <span class="muted" style="opacity:.8">값을 편집하면 자동 저장됩니다 (로컬 저장소).</span>
  </div>
  <div style="overflow:auto">
    <table class="asset-table" style="width:100%; border-collapse:collapse; min-width:980px">
      <thead>
        <tr>
          ${headers.map((h) => `<th style=\"text-align:left; padding:8px; border-bottom:1px solid #2a2a30; white-space:nowrap\">${h.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody id="asset-tbody"></tbody>
    </table>
  </div>
`

const renderTable = () => {
  const tbody = document.getElementById('asset-tbody')!
  const rows = loadRows()
  tbody.innerHTML = ''
  rows.forEach((row, idx) => {
    const prev = idx > 0 ? rows[idx - 1] : undefined
    const tU = totalUSDT(row)
    const tK = totalKRW(row)
    const pU = prev ? totalUSDT(prev) : undefined
    const pK = prev ? totalKRW(prev) : undefined
    const dU = typeof pU === 'number' ? tU - pU : undefined
    const dK = typeof pK === 'number' ? tK - pK : undefined

    const tr = document.createElement('tr')
    headers.forEach((h) => {
      const td = document.createElement('td')
      td.style.padding = '6px'
      if (
        h.key === 'total_usdt' ||
        h.key === 'total_krw' ||
        h.key === 'diff_usdt' ||
        h.key === 'diff_krw'
      ) {
        const v = h.key === 'total_usdt' ? tU : h.key === 'total_krw' ? tK : h.key === 'diff_usdt' ? dU : dK
        td.textContent = fmt(v)
        td.style.textAlign = 'right'
      } else if (h.key === 'date') {
        const input = document.createElement('input')
        input.type = 'date'
        input.value = row.date
        input.onchange = () => {
          const rows2 = loadRows()
          rows2[idx].date = input.value
          saveRows(rows2)
          renderTable()
        }
        td.appendChild(input)
        td.style.whiteSpace = 'nowrap'
      } else if (h.key === 'note') {
        const input = document.createElement('input')
        input.placeholder = '비고'
        input.value = row.note ?? ''
        input.oninput = () => {
          const rows2 = loadRows()
          rows2[idx].note = input.value
          saveRows(rows2)
        }
        td.appendChild(input)
        td.style.textAlign = 'left'
      } else if (h.key === 'rate') {
        const input = document.createElement('input')
        input.type = 'number'
        input.step = '0.0001'
        input.placeholder = 'KRW/USDT'
        input.value = String(row.rate ?? '')
        input.oninput = () => {
          const rows2 = loadRows()
          rows2[idx].rate = Number(input.value) || 0
          saveRows(rows2)
          renderTable()
        }
        td.appendChild(input)
        td.style.textAlign = 'right'
      } else {
        const key = h.key as keyof Row
        const input = document.createElement('input')
        input.type = 'number'
        input.step = '0.0001'
        input.value = String((row[key] as number) ?? '')
        input.oninput = () => {
          const rows2 = loadRows()
          // @ts-expect-error index write
          rows2[idx][key] = Number(input.value) || 0
          saveRows(rows2)
          renderTable()
        }
        td.appendChild(input)
        td.style.textAlign = 'right'
      }
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
}

const ensureInitial = () => {
  let rows = loadRows()
  if (rows.length === 0) {
    rows = [
      {
        date: '2025-09-06',
        gateio_usdt: 0,
        gateio_krw: 0,
        bitget_usdt: 0,
        bitget_krw: 0,
        okx_usdt: 0,
        okx_krw: 0,
        rate: 0,
        note: ''
      }
    ]
    saveRows(rows)
  }
}

const addRow = () => {
  const rows = loadRows()
  const last = rows[rows.length - 1]
  const d = new Date(last.date)
  if (!isNaN(d.getTime())) d.setDate(d.getDate() + 1)
  const nextDate = !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : last.date
  rows.push({
    date: nextDate,
    gateio_usdt: 0,
    gateio_krw: 0,
    bitget_usdt: 0,
    bitget_krw: 0,
    okx_usdt: 0,
    okx_krw: 0,
    rate: last.rate || 0,
    note: ''
  })
  saveRows(rows)
  renderTable()
}

// Append sections
app.append(header, assetSection)

ensureInitial()
renderTable()
document.getElementById('add-row')!.addEventListener('click', addRow)
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

// Keep original tools below (link builder + manifest)
const sep = el('div', undefined, '<hr style="border:0; border-top:1px solid #2a2a30; opacity:.6; margin:16px 0">')
app.append(sep)
app.append(builder, list)

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
