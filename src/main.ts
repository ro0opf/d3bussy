import './styles.css'
import { profile } from './profile'

const el = (tag: string, className?: string, html?: string) => {
  const e = document.createElement(tag)
  if (className) e.className = className
  if (html) e.innerHTML = html
  return e
}

const app = document.getElementById('app')!

// Header / Nav
const header = el('header', 'site-header')
header.innerHTML = `
  <a class="brand" href="#home">${profile.emoji} ${profile.name}</a>
  <nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
    <button id="theme-toggle" aria-label="Toggle theme">🌓</button>
  </nav>
`

// Hero
const hero = el('section', 'hero', `
  <h1 id="home">${profile.title}</h1>
  <p>${profile.tagline}</p>
  <div class="socials">
    ${profile.socials
      .map(
        (s) => `<a href="${s.href}" target="_blank" rel="noreferrer noopener">${s.label}</a>`
      )
      .join('')}
  </div>
`)

// About
const about = el('section', 'about', `
  <h2 id="about">About</h2>
  <p>${profile.about}</p>
  <ul class="skills">
    ${profile.skills.map((sk) => `<li>${sk}</li>`).join('')}
  </ul>
`)

// Projects
const projects = el('section', 'projects', `
  <h2 id="projects">Projects</h2>
  <div class="grid">
  ${profile.projects
    .map(
      (p) => `
      <article class="card">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        ${p.link ? `<a href="${p.link}" target="_blank" rel="noreferrer noopener">Visit ↗</a>` : ''}
      </article>
    `
    )
    .join('')}
  </div>
`)

// Contact
const contact = el('section', 'contact', `
  <h2 id="contact">Contact</h2>
  <p>
    이메일: <a href="mailto:${profile.contact.email}">${profile.contact.email}</a>
    ${profile.contact.location ? ` • 위치: ${profile.contact.location}` : ''}
  </p>
`)

// Footer
const footer = el('footer', 'site-footer', `
  <p>© ${new Date().getFullYear()} ${profile.name}. Built with Vite + TypeScript.</p>
`)

app.append(header, hero, about, projects, contact, footer)

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href') || ''
    const id = href.slice(1)
    const target = document.getElementById(id)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', href)
    }
  })
})

// Theme toggle
const THEME_KEY = 'theme-preference'
const toggle = document.getElementById('theme-toggle')!
const getPreferred = () => localStorage.getItem(THEME_KEY) || 'dark'
const applyTheme = (t: string) => {
  document.documentElement.dataset.theme = t
}
applyTheme(getPreferred())
toggle.addEventListener('click', () => {
  const next = getPreferred() === 'light' ? 'dark' : 'light'
  localStorage.setItem(THEME_KEY, next)
  applyTheme(next)
})
