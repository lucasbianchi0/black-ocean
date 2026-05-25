'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { translations, getAreaData, getModeloItems, getInsightCards } from './i18n'

const countries = [
  { code: 'ar', flag: '🇦🇷', label: 'ARG', lang: 'es' },
  { code: 'br', flag: '🇧🇷', label: 'BRA', lang: 'pt' },
  { code: 'us', flag: '🇺🇸', label: 'ENG', lang: 'en' },
]

const nl = (str) => str.split('\n').reduce((acc, line, i) =>
  i === 0 ? [line] : [...acc, <br key={i}/>, line], [])

export default function Home() {
  const navRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const explainerRef = useRef(null)
  const muteRef = useRef(null)
  const heroVideoRef = useRef(null)
  const [country, setCountry] = useState('ar')
  const [flagOpen, setFlagOpen] = useState(false)
  const [moFlagOpen, setMoFlagOpen] = useState(false)
  const [videoControls, setVideoControls] = useState(false)
  const [activeArea, setActiveArea] = useState(null)
  const [closingModal, setClosingModal] = useState(false)
  const [activeInsight, setActiveInsight] = useState(null)
  const [closingInsight, setClosingInsight] = useState(false)
  const irContentRef = useRef(null)

  const lang = countries.find(c => c.code === country)?.lang ?? 'es'
  const T = translations[lang]
  const current = countries.find(c => c.code === country)
  const areaData = getAreaData(lang)
  const modeloItems = getModeloItems(lang)
  const insightCards = getInsightCards(lang)

  const openModal = (area) => setActiveArea(area)
  const closeModal = () => {
    setClosingModal(true)
    setTimeout(() => { setActiveArea(null); setClosingModal(false) }, 360)
  }

  const openInsight = (i) => setActiveInsight(i)
  const closeInsight = () => {
    setClosingInsight(true)
    setTimeout(() => { setActiveInsight(null); setClosingInsight(false) }, 360)
  }
  const navInsight = (i) => {
    if (i < 0 || i >= insightCards.length) return
    setActiveInsight(i)
    if (irContentRef.current) irContentRef.current.scrollTop = 0
  }

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const reveals = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    reveals.forEach(el => io.observe(el))

    const anchors = document.querySelectorAll('a[href^="#"]')
    const smoothScroll = (e) => {
      const target = document.querySelector(e.currentTarget.getAttribute('href'))
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    }
    anchors.forEach(a => a.addEventListener('click', smoothScroll))

    // hero video — explicit play() for Samsung Internet
    const heroEl = heroVideoRef.current
    if (heroEl) {
      heroEl.play().catch(() => {})
      heroEl.addEventListener('canplay', () => heroEl.play().catch(() => {}), { once: true })
    }

    // explainer video — intersection-driven play/pause
    const videoEl = explainerRef.current
    const videoObs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(() => {})
        else e.target.pause()
      }),
      { threshold: 0.1 }
    )
    if (videoEl) videoObs.observe(videoEl)

    // touch fallback — first user gesture unlocks autoplay on strict browsers
    const unlockVideos = () => {
      heroEl?.play().catch(() => {})
      document.removeEventListener('touchstart', unlockVideos)
      document.removeEventListener('pointerdown', unlockVideos)
    }
    document.addEventListener('touchstart', unlockVideos, { once: true, passive: true })
    document.addEventListener('pointerdown', unlockVideos, { once: true, passive: true })

    const mq = window.matchMedia('(max-width: 768px)')
    setVideoControls(!mq.matches)
    const mqHandler = (e) => setVideoControls(!e.matches)
    mq.addEventListener('change', mqHandler)

    const onOutsideClick = (e) => {
      if (!e.target.closest('.flag-wrap')) setFlagOpen(false)
      if (!e.target.closest('.mo-flag-wrap')) setMoFlagOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      anchors.forEach(a => a.removeEventListener('click', smoothScroll))
      videoObs.disconnect()
      document.removeEventListener('mousedown', onOutsideClick)
      mq.removeEventListener('change', mqHandler)
      document.removeEventListener('touchstart', unlockVideos)
      document.removeEventListener('pointerdown', unlockVideos)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = (activeArea || activeInsight !== null) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeArea, activeInsight])

  useEffect(() => {
    if (!activeArea) return
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activeArea])

  useEffect(() => {
    if (activeInsight === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeInsight()
      if (e.key === 'ArrowRight') navInsight(activeInsight + 1)
      if (e.key === 'ArrowLeft') navInsight(activeInsight - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activeInsight])

  const openMenu = () => {
    const menu = mobileMenuRef.current
    if (!menu) return
    menu.style.display = 'flex'
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')))
  }

  const closeMenu = () => {
    const menu = mobileMenuRef.current
    if (!menu) return
    menu.classList.remove('open')
    setTimeout(() => {
      if (menu && !menu.classList.contains('open')) menu.style.display = 'none'
    }, 420)
  }

  const handleMute = () => {
    if (!explainerRef.current) return
    explainerRef.current.muted = !explainerRef.current.muted
    if (muteRef.current) {
      muteRef.current.textContent = explainerRef.current.muted ? 'Activar sonido' : 'Silenciar'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('.btn-submit')
    const form = e.target
    const data = {
      empresa: form.querySelector('#empresa').value,
      nombre:  form.querySelector('#nombre').value,
      email:   form.querySelector('#email').value,
      mensaje: form.querySelector('#mensaje').value,
    }
    btn.textContent = T.contacto.sending
    btn.disabled = true
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      btn.textContent = T.contacto.sent
      btn.style.background = '#2a4a6b'
      btn.style.color = '#f0ece6'
      form.reset()
    } else {
      btn.textContent = T.contacto.errorSend
      btn.disabled = false
    }
  }

  return (
    <>
      {/* NAV */}
      <nav ref={navRef}>
        <a href="#inicio" className="nav-logo">
          <Image src="/logo.jpg" alt="Ocean Black & Co." width={34} height={34} />
          <span className="nav-logo-text">Ocean Black <em>&</em> Co.</span>
        </a>
        <ul className="nav-center">
          <li><a href="#perspectiva">{T.nav.perspectiva}</a></li>
          <li><a href="#ecosistema">{T.nav.ecosistema}</a></li>
          <li><a href="#modelo">{T.nav.modelo}</a></li>
          <li><a href="#relaciones">{T.nav.relaciones}</a></li>
          <li><a href="#insights">{T.nav.insights}</a></li>
        </ul>
        <div className="nav-right">
          <a href="#contacto" className="btn-ghost">{T.contactoBtn}</a>
          <div className={`flag-wrap${flagOpen ? ' open' : ''}`}>
            <button className="flag-trigger" onClick={() => setFlagOpen(v => !v)}>
              <span className="flag-trigger-emoji">{current.flag}</span>
              <span className="flag-trigger-code">{current.label}</span>
              <span className="flag-trigger-arrow">▾</span>
            </button>
            {flagOpen && (
              <div className="flag-dropdown">
                {countries.map(c => (
                  <button
                    key={c.code}
                    className={`flag-option${country === c.code ? ' selected' : ''}`}
                    onClick={() => { setCountry(c.code); setFlagOpen(false) }}
                  >
                    <span className="flag-option-emoji">{c.flag}</span>
                    <span className="flag-option-name">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="hamburger" onClick={openMenu} aria-label="Menú">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className="mobile-overlay" ref={mobileMenuRef}>
        <div className="mo-header">
          <a href="#inicio" className="nav-logo" onClick={closeMenu}>
            <Image src="/logo.jpg" alt="Ocean Black & Co." width={30} height={30} />
            <span className="nav-logo-text">Ocean Black <em>&</em> Co.</span>
          </a>
          <button className="mobile-close" onClick={closeMenu} aria-label="Cerrar">✕</button>
        </div>
        <nav className="mo-nav">
          <a href="#perspectiva" className="mo-link" onClick={closeMenu}>
            <span className="mo-num">01</span>{T.nav.perspectiva}
          </a>
          <a href="#ecosistema" className="mo-link" onClick={closeMenu}>
            <span className="mo-num">02</span>{T.nav.ecosistema}
          </a>
          <a href="#modelo" className="mo-link" onClick={closeMenu}>
            <span className="mo-num">03</span>{T.nav.modelo}
          </a>
          <a href="#relaciones" className="mo-link" onClick={closeMenu}>
            <span className="mo-num">04</span>{T.nav.relaciones}
          </a>
          <a href="#insights" className="mo-link" onClick={closeMenu}>
            <span className="mo-num">05</span>{T.nav.insights}
          </a>
          <a href="#contacto" className="mo-link" onClick={closeMenu}>
            <span className="mo-num">06</span>{T.nav.contacto}
          </a>
        </nav>
        <div className="mo-footer">
          <div className={`mo-flag-wrap${moFlagOpen ? ' open' : ''}`}>
            <button className="mo-flag-trigger" onClick={() => setMoFlagOpen(v => !v)}>
              <span className="flag-trigger-emoji">{current.flag}</span>
              <span className="flag-trigger-code">{current.label}</span>
              <span className="flag-trigger-arrow">▾</span>
            </button>
            {moFlagOpen && (
              <div className="mo-flag-dropdown">
                {countries.map(c => (
                  <button
                    key={c.code}
                    className={`flag-option${country === c.code ? ' selected' : ''}`}
                    onClick={() => { setCountry(c.code); setMoFlagOpen(false) }}
                  >
                    <span className="flag-option-emoji">{c.flag}</span>
                    <span className="flag-option-name">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <a href="https://instagram.com/oceanblack.co" className="mo-ig" target="_blank" rel="noopener">
            @oceanblack.co
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-video-wrap">
          <video ref={heroVideoRef} autoPlay muted loop playsInline preload="metadata">
            <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-grad" />
        <div className="hero-tint" />
        <div className="hero-content">
          <p className="hero-eyebrow">{T.eyebrow}</p>
          <h1 className="hero-title">Ocean Black<br />&amp; Co.</h1>
          <p className="hero-sub">{T.heroSub}</p>
          <p className="hero-descriptor">
            <strong>{T.heroDescStrong}</strong><br />
            {T.heroDescBody}
          </p>
          <div className="hero-cta-wrap">
            <a href="#ecosistema" className="cta-primary">{T.ctaPrimary}</a>
            <a href="#perspectiva" className="cta-secondary">{T.ctaSecondary}</a>
          </div>
        </div>
        <div className="hero-areas">
          <div className="hero-area-item">
            <span className="hero-area-label">{T.heroAreas.sede}</span>
            <span className="hero-area-value">{T.heroAreas.sedeVal}</span>
          </div>
          <div className="hero-area-item">
            <span className="hero-area-label">{T.heroAreas.areas}</span>
            <span className="hero-area-value">{T.heroAreas.areasVal}</span>
          </div>
          <div className="hero-area-item">
            <span className="hero-area-label">{T.heroAreas.alcance}</span>
            <span className="hero-area-value">{T.heroAreas.alcanceVal}</span>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-bar" />
          <span>Scroll</span>
        </div>
      </section>

      {/* LOGO TICKER */}
      <div className="logo-ticker reveal">
        <div className="lt-track">
          {[0, 1].map(copy => (
            <div className="lt-inner" key={copy} aria-hidden={copy === 1}>
              {logoList.map((logo, i) => (
                <div className="lt-item" key={i}>
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRESENTACIÓN */}
      <section className="presentacion" id="presentacion">
        <div>
          <div className="label reveal">{T.presentacion.label}</div>
          <h2 className="section-title reveal d1">{nl(T.presentacion.h2)}</h2>
        </div>
        <div className="presentacion-right">
          <p className="reveal d1" dangerouslySetInnerHTML={{ __html: T.presentacion.p1 }} />
          <p className="reveal d2">{T.presentacion.p2}</p>
        </div>
      </section>

      {/* BRAND VIDEO */}
      <section className="brand-video">
        <div className="bv-text">
          <div className="label reveal">{T.bvLabel}</div>
          <h2 className="section-title bv-heading reveal d1">
            {T.bvH1}<br />{T.bvH2}<br />{T.bvH3}<br />{T.bvH4}
          </h2>
          <p className="bv-desc reveal d2">{T.bvDesc}</p>
          <a href="#contacto" className="bv-link reveal d3">{T.bvLink}</a>
        </div>
        <div className="bv-media reveal d2">
          <div className="bv-video-wrap">
            <video ref={explainerRef} playsInline muted controls={videoControls} preload="metadata">
              <source src="/explainer.mp4" type="video/mp4" />
            </video>
            <button ref={muteRef} className="bv-mute" onClick={handleMute}>
              Activar sonido
            </button>
          </div>
        </div>
      </section>

      {/* ECOSISTEMA */}
      <section className="ecosistema" id="ecosistema">
        <div className="ecosistema-head">
          <div>
            <div className="label reveal">{T.ecosistema.label}</div>
            <h2 className="section-title reveal d1">{nl(T.ecosistema.h2)}</h2>
          </div>
          <div className="ecosistema-head-right reveal d2">
            <p>{T.ecosistema.desc}</p>
          </div>
        </div>
        <div className="areas-grid">
          {areaData.map((area, i) => (
            <div
              className={`area-card reveal${i % 3 !== 0 ? ` d${i % 3}` : ''}`}
              key={area.num}
              onClick={() => openModal(area)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && openModal(area)}
            >
              <div className="area-num">{area.num}</div>
              <div className="area-name">{area.name}</div>
              <div className="area-text">{area.text}</div>
              <div className="area-card-cta">
                <span>{T.ecosistema.verArea}</span>
                <span className="area-card-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map(i => (
            <div className="marquee-content" key={i} aria-hidden={i === 1}>
              {T.marquee.row1.map((w, j) => (
                <span key={j} className="mq-word">{w}</span>
              )).reduce((acc, el, idx, arr) => idx < arr.length - 1 ? [...acc, el, <span key={`dot-${idx}`} className="mq-dot" />] : [...acc, el], [])}
            </div>
          ))}
        </div>
        <div className="marquee-track marquee-rev">
          {[0, 1].map(i => (
            <div className="marquee-content" key={i} aria-hidden={i === 1}>
              {T.marquee.row2.map((w, j) => (
                <span key={j} className={`mq-word${T.marquee.row2italic[j] ? ' italic' : ''}`}>{w}</span>
              )).reduce((acc, el, idx, arr) => idx < arr.length - 1 ? [...acc, el, <span key={`dot-${idx}`} className="mq-dot" />] : [...acc, el], [])}
            </div>
          ))}
        </div>
      </div>

      {/* DIFERENCIAL */}
      <section className="diferencial">
        <div className="diferencial-wrap">
          <div className="label reveal">{T.diferencial.label}</div>
          <h2 className="section-title reveal d1">{nl(T.diferencial.h2)}</h2>
          <p className="reveal d2">{T.diferencial.desc}</p>
          <div className="pillars">
            {T.diferencial.pillars.map(([t, s], i) => (
              <div className={`pillar reveal${i > 0 ? ` d${i}` : ''}`} key={t}>
                <div className="pillar-title">{t}</div>
                <div className="pillar-sub">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEGOCIOS EN VIVO — BANNER */}
      <div className="nev-section">
        <div className="nev-container">
          <div className="nev-card-wrap reveal">
            <div className="nev-corner-tag">{T.nev.tag}</div>
          <div className="nev-card-outer">
            <div className="nev-glow" />
            <div className="nev-content">
              <div className="nev-left">
                <div className="nev-live-badge reveal d1">
                  <span className="nev-live-dot" />
                  <span className="nev-live-label">En Vivo</span>
                </div>
                <div className="nev-eyebrow reveal d1">{T.nev.eyebrow}</div>
                <h3 className="nev-title reveal d2">{nl(T.nev.title)}</h3>
                <p className="nev-desc reveal d3">{T.nev.desc}</p>
                <a href="https://negociosenvivo.com/" target="_blank" rel="noopener noreferrer" className="nev-cta reveal d4">
                  {T.nev.cta} <span className="nev-arrow">→</span>
                </a>
              </div>
              <div className="nev-right reveal d2">
                <div className="nev-logo-wrap">
                  <div className="nev-logo-card">
                    <div className="nev-logo-shine" />
                    <img src="/nev-logo.png" alt="Negocios en Vivo" />
                  </div>
                  <div className="nev-logo-blur" />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* MODELO OPERATIVO */}
      <section className="modelo" id="modelo">
        <div>
          <div className="label reveal">{T.modelo.label}</div>
          <h2 className="section-title reveal d1">{nl(T.modelo.h2)}</h2>
          <p className="reveal d2">{T.modelo.desc}</p>
        </div>
        <div className="modelo-items">
          {modeloItems.map((item, i) => (
            <div className={`modelo-item reveal${i > 0 ? ` d${i}` : ''}`} key={item.title}>
              <div className="modelo-item-title">{item.title}</div>
              <div className="modelo-item-text">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PERSPECTIVA */}
      <section className="perspectiva" id="perspectiva">
        <div className="label reveal" style={{justifyContent:'center'}}>{T.perspectiva.label}</div>
        <h2 className="section-title reveal d1">{nl(T.perspectiva.h2)}</h2>
        <p className="reveal d2">{T.perspectiva.p1}</p>
        <p className="reveal d3">{T.perspectiva.p2}</p>
      </section>

      {/* RELACIONES */}
      <section className="relaciones" id="relaciones">
        <div className="label reveal" style={{justifyContent:'center'}}>{T.relaciones.label}</div>
        <h2 className="section-title reveal d1">{nl(T.relaciones.h2)}</h2>
        <p className="relaciones-intro reveal d2">{T.relaciones.intro}</p>
        <div className="rel-logos-grid reveal d3">
          {[
            { src: '/logos-color/gsb.png',            alt: 'GSB'          },
            { src: '/logos-color/facyca.png',         alt: 'Facyca'       },
            { src: '/logos-color/cromed.png',         alt: 'Crosmed'      },
            { src: '/logos-color/wallsecurity.png',   alt: 'Wall Security'},
            { src: '/logos-color/puntofarma.png',     alt: 'Punto Farma'  },
            { src: '/logos-color/pilloti.png',        alt: 'Pilloti'      },
            { src: '/logos-color/agropharm.png',      alt: 'Agropharm'    },
            { src: '/logos-color/imeco.png',          alt: 'Imeco'        },
            { src: '/logos-color/limp.png',           alt: 'Tec Limp'     },
            { src: '/logos-color/grupo-maipu-2.png',  alt: 'Grupo Maipú'  },
            { src: '/logos-color/alfa-team-2.png',    alt: 'Alfa Team'    },
            { src: '/logos-color/locsys-2.png',       alt: 'Locsys'       },
            { src: '/logos-color/logo-segutrans.png', alt: 'Segutrans'    },
            { src: '/logos-color/bitronics.png',      alt: 'Bitronics'    },
            { src: '/logos-color/brinks.png',         alt: 'Brinks'       },
            { src: '/logos-color/molinos.png',        alt: 'Molinos'      },
            { src: '/logos-color/saintcobain.png',    alt: 'Saint-Gobain' },
            { src: '/logos-color/loginter.png',       alt: 'Loginter'     },
            { src: '/logos-color/forever-pipe.png',   alt: 'Forever Pipe' },
            { src: '/logos-color/cactus.png',         alt: 'Cactus'       },
            { src: '/logos-color/localiza.png',       alt: 'Localiza'     },
          ].map(({ src, alt }) => (
            <div className="rel-logo-item" key={alt}>
              <img src={src} alt={alt} />
            </div>
          ))}
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="insights" id="insights">
        <div className="insights-top">
          <div>
            <div className="label reveal">{T.insights.label}</div>
            <h2 className="section-title reveal d1">{nl(T.insights.h2)}</h2>
          </div>
          <button className="link-underline reveal d2" onClick={() => openInsight(0)}>{T.insights.verTodos}</button>
        </div>
        <div className="insights-grid">
          {insightCards.map((card, i) => (
            <div
              className={`insight-card reveal${i > 0 ? ` d${i}` : ''}`}
              key={card.title}
              onClick={() => openInsight(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && openInsight(i)}
            >
              <div className="insight-cat">{card.cat}</div>
              <div className="insight-title">{card.title}</div>
              <div className="insight-text">{card.text}</div>
              <div className="insight-arrow">{T.insights.leerMas}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto" id="contacto">
        <div className="contacto-left">
          <div className="label reveal">{T.contacto.label}</div>
          <h2 className="section-title reveal d1">{nl(T.contacto.h2)}</h2>
          <p className="reveal d2">{T.contacto.desc}</p>
          <div className="contact-details reveal d3">
            <div className="contact-row">
              <span className="contact-label">Email</span>
              <a href="mailto:contacto@oceanblack.com.ar" className="contact-value">contacto@oceanblack.com.ar</a>
            </div>
            <div className="contact-row">
              <span className="contact-label">{T.contacto.instagram}</span>
              <a href="https://instagram.com/oceanblack.co" className="contact-value" target="_blank" rel="noopener">@oceanblack.co</a>
            </div>
            <div className="contact-row">
              <span className="contact-label">{T.contacto.ubicacion}</span>
              <span className="contact-value">{T.contacto.ubicacionVal}</span>
            </div>
          </div>
        </div>
        <form className="contact-form reveal d2" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="empresa">{T.contacto.fEmpresa}</label>
            <input id="empresa" type="text" placeholder={T.contacto.fEmpresaPh} autoComplete="organization" />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">{T.contacto.fNombre}</label>
            <input id="nombre" type="text" placeholder={T.contacto.fNombrePh} autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">{T.contacto.fEmail}</label>
            <input id="email" type="email" placeholder={T.contacto.fEmailPh} autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">{T.contacto.fMensaje}</label>
            <textarea id="mensaje" placeholder={T.contacto.fMensajePh} />
          </div>
          <button type="submit" className="btn-submit">{T.contacto.submit}</button>
        </form>
      </section>

      {/* CIERRE */}
      <section className="cierre">
        <div className="cierre-bg-text" aria-hidden="true">OCEAN BLACK</div>
        <h2 className="section-title reveal">{nl(T.cierre.h2)}</h2>
        <p className="cierre-sub reveal d1">{T.cierre.sub}</p>
        <a href="#contacto" className="cierre-btn reveal d2">{T.cierre.btn}</a>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#inicio" className="nav-logo">
              <Image src="/logo.jpg" alt="Ocean Black & Co." width={34} height={34} />
              <span className="nav-logo-text">Ocean Black <em>&</em> Co.</span>
            </a>
            <p>{T.footer.desc}</p>
            <p className="footer-location">{T.footer.location}</p>
          </div>
          <div className="footer-col">
            <h5>{T.footer.ecosistemaTitle}</h5>
            <ul>
              {T.footer.ecosistemaItems.map(([href, label]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>{T.footer.empresaTitle}</h5>
            <ul>
              {T.footer.empresaItems.map(([href, label]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>{T.footer.contactoTitle}</h5>
            <ul>
              <li><a href="mailto:contacto@oceanblack.com.ar">contacto@oceanblack.com.ar</a></li>
              <li><a href="https://instagram.com/oceanblack.co" target="_blank" rel="noopener">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{T.footer.copyright}</p>
          <p className="footer-phrase">{T.footer.phrase}</p>
        </div>
      </footer>

      {/* AREA MODAL */}
      {activeArea && (
        <div
          className={`am-overlay${closingModal ? ' am-closing' : ''}`}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`am-panel${closingModal ? ' am-closing' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <button className="am-close" onClick={closeModal} aria-label="Cerrar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="am-body">
              <div className="am-left">
                <div className="am-num-label">{T.ecosistema.areaLabel} {activeArea.num}</div>
                <h2 className="am-title">{activeArea.name}</h2>
                <p className="am-desc">{activeArea.text}</p>
                <div className="am-services-label">{T.ecosistema.servicios}</div>
                <ul className="am-services">
                  {activeArea.services.map((s, i) => (
                    <li key={s} style={{ '--i': i }}>{s}</li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/5491151222161?text=${encodeURIComponent(`Hola, me interesa el área de ${activeArea.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="am-cta"
                >
                  <span>{T.ecosistema.hablemos}</span>
                  <span className="am-cta-arrow">→</span>
                </a>
              </div>
              <div className="am-right" aria-hidden="true">
                <img className="am-right-img" src={activeArea.img} alt="" />
                <div className="am-right-overlay" />
                <div className="am-right-num">{activeArea.num}</div>
                <div className="am-right-dot" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSIGHT READER */}
      {activeInsight !== null && (
        <div
          className={`ir-overlay${closingInsight ? ' ir-closing' : ''}`}
          onClick={closeInsight}
        >
          <div
            className={`ir-panel${closingInsight ? ' ir-closing' : ''}`}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="ir-header">
              <div className="ir-pills">
                {insightCards.map((c, i) => (
                  <button
                    key={i}
                    className={`ir-pill${i === activeInsight ? ' active' : ''}`}
                    onClick={() => navInsight(i)}
                  >{c.cat}</button>
                ))}
              </div>
              <button className="ir-close" onClick={closeInsight} aria-label="Cerrar">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="ir-content" ref={irContentRef}>
              <div className="ir-article" key={activeInsight}>
                <div className="ir-cat">{insightCards[activeInsight].cat}</div>
                <h2 className="ir-title">{insightCards[activeInsight].title}</h2>
                <div className="ir-divider" />
                <div className="ir-body">
                  {insightCards[activeInsight].body.map((block, i) => {
                    if (block.type === 'p')    return <p key={i}>{block.text}</p>
                    if (block.type === 'lead') return <p key={i} className="ir-lead">{block.text}</p>
                    if (block.type === 'quote') return <blockquote key={i}>{block.text}</blockquote>
                    if (block.type === 'ul')  return (
                      <ul key={i}>
                        {block.items.map(item => <li key={item}>{item}</li>)}
                      </ul>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="ir-footer">
              <button
                className="ir-nav-btn"
                onClick={() => navInsight(activeInsight - 1)}
                disabled={activeInsight === 0}
              >{T.insights.anterior}</button>
              <div className="ir-dots">
                {insightCards.map((_, i) => (
                  <span
                    key={i}
                    className={`ir-dot${i === activeInsight ? ' active' : ''}`}
                    onClick={() => navInsight(i)}
                  />
                ))}
              </div>
              <button
                className="ir-nav-btn"
                onClick={() => navInsight(activeInsight + 1)}
                disabled={activeInsight === insightCards.length - 1}
              >{T.insights.siguiente}</button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP FLOTANTE */}
      <div className="wa-wrap">
        <a
          href="https://wa.me/5491151222161"
          target="_blank"
          rel="noopener noreferrer"
          className="wa-float"
          aria-label="Contactar por WhatsApp"
        >
          <svg className="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="wa-label">Escribinos</span>
        </a>
      </div>
    </>
  )
}

const logoList = [
  { src: '/logos/gsb.png',             alt: 'GSB'             },
  { src: '/logos/facyca.png',          alt: 'Facyca'          },
  { src: '/logos/cromed.png',          alt: 'Crosmed'         },
  { src: '/logos/wallsecurity.png',    alt: 'Wall Security'   },
  { src: '/logos/puntofarma.png',      alt: 'Punto Farma'     },
  { src: '/logos/pilloti.png',         alt: 'Pilloti'         },
  { src: '/logos/agropharm.png',       alt: 'Agropharm'       },
  { src: '/logos/imeco.png',           alt: 'Imeco'           },
  { src: '/logos/limp.png',            alt: 'Tec Limp'        },
  { src: '/logos/grupo-maipu-2.png',   alt: 'Grupo Maipú'     },
  { src: '/logos/alfa-team-2.png',     alt: 'Alfa Team'       },
  { src: '/logos/locsys-2.png',        alt: 'Locsys Seguridad'},
  { src: '/logos/logo-segutrans.png',  alt: 'Segutrans'       },
  { src: '/logos/bitronics.png',       alt: 'Bitronics'       },
]
