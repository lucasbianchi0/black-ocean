'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const countries = [
  { code: 'ar', flag: '🇦🇷', label: 'ARG', lang: 'es' },
  { code: 'br', flag: '🇧🇷', label: 'BRA', lang: 'pt' },
  { code: 'uy', flag: '🇺🇾', label: 'URU', lang: 'es' },
  { code: 'cl', flag: '🇨🇱', label: 'CHI', lang: 'es' },
  { code: 'py', flag: '🇵🇾', label: 'PAR', lang: 'es' },
]

const i18n = {
  es: {
    eyebrow: 'Conectar · Resolver · Expandir',
    heroSub: 'Conexiones que generan crecimiento.',
    heroDescStrong: 'Las empresas evolucionan. Su estructura también.',
    heroDescBody: 'Soluciones estratégicas para compañías que requieren estructura, resolución, capacidad operativa y expansión.',
    ctaPrimary: 'Explorar ecosistema',
    ctaSecondary: 'Nuestra perspectiva',
    contactoBtn: 'Contacto Institucional',
    nav: { perspectiva: 'Perspectiva', ecosistema: 'Ecosistema', modelo: 'Modelo Operativo', relaciones: 'Relaciones', insights: 'Insights', contacto: 'Contacto' },
    bvLabel: 'Quiénes Somos',
    bvH1: 'El ecosistema', bvH2: 'estratégico', bvH3: 'detrás de', bvH4: 'tu empresa.',
    bvDesc: 'Conocé cómo integramos especialistas, relaciones y estructura bajo una misma visión — para empresas que buscan operar, resolver y crecer en otro nivel.',
    bvLink: 'Iniciar conversación',
  },
  pt: {
    eyebrow: 'Conectar · Resolver · Expandir',
    heroSub: 'Conexões que geram crescimento.',
    heroDescStrong: 'As empresas evoluem. Sua estrutura também.',
    heroDescBody: 'Soluções estratégicas para empresas que requerem estrutura, resolução, capacidade operacional e expansão.',
    ctaPrimary: 'Explorar ecossistema',
    ctaSecondary: 'Nossa perspectiva',
    contactoBtn: 'Contato Institucional',
    nav: { perspectiva: 'Perspectiva', ecosistema: 'Ecossistema', modelo: 'Modelo Operacional', relaciones: 'Relações', insights: 'Insights', contacto: 'Contato' },
    bvLabel: 'Quem Somos',
    bvH1: 'O ecossistema', bvH2: 'estratégico', bvH3: 'por trás da', bvH4: 'sua empresa.',
    bvDesc: 'Conheça como integramos especialistas, relações e estrutura sob uma mesma visão — para empresas que buscam operar, resolver e crescer em outro nível.',
    bvLink: 'Iniciar conversa',
  },
}

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

  const lang = countries.find(c => c.code === country)?.lang ?? 'es'
  const T = i18n[lang]
  const current = countries.find(c => c.code === country)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('.btn-submit')
    btn.textContent = 'Mensaje enviado'
    btn.style.background = '#2a4a6b'
    btn.style.color = '#f0ece6'
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
            <span className="hero-area-label">Sede</span>
            <span className="hero-area-value">Buenos Aires</span>
          </div>
          <div className="hero-area-item">
            <span className="hero-area-label">Áreas</span>
            <span className="hero-area-value">10 sectores</span>
          </div>
          <div className="hero-area-item">
            <span className="hero-area-label">Alcance</span>
            <span className="hero-area-value">Regional</span>
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
          <div className="label reveal">Presentación Institucional</div>
          <h2 className="section-title reveal d1">Una nueva<br />generación de<br />estructuras.</h2>
        </div>
        <div className="presentacion-right">
          <p className="reveal d1"><strong>OCEAN BLACK & CO.</strong> integra soluciones estratégicas para empresas y organizaciones que requieren estructura, resolución y capacidad de expansión.</p>
          <p className="reveal d2">Más que un proveedor de servicios: un ecosistema empresarial capaz de articular especialistas, herramientas y conexiones bajo una misma visión operativa.</p>
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
            <div className="label reveal">Ecosistema</div>
            <h2 className="section-title reveal d1">Áreas<br />estratégicas<br />integradas.</h2>
          </div>
          <div className="ecosistema-head-right reveal d2">
            <p>Diez áreas integradas bajo una misma estructura. Cada una coordinada para operar de forma independiente o en conjunto, según el escenario que requiera la empresa.</p>
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
                <span>Ver área</span>
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
              {['Conectar', 'Resolver', 'Expandir', 'Ecosistema Empresarial', 'Estructura', 'Visión', 'Resolución', 'Articulación'].map((w, j) => (
                <span key={j} className="mq-word">
                  {w}
                </span>
              )).reduce((acc, el, idx, arr) => idx < arr.length - 1 ? [...acc, el, <span key={`dot-${idx}`} className="mq-dot" />] : [...acc, el], [])}
            </div>
          ))}
        </div>
        <div className="marquee-track marquee-rev">
          {[0, 1].map(i => (
            <div className="marquee-content" key={i} aria-hidden={i === 1}>
              {['Integración Estratégica', 'Conexiones que Generan Crecimiento', 'Desarrollo Corporativo', 'Empresas Modernas', 'Estructuras Modernas', 'Ocean Black & Co.'].map((w, j) => (
                <span key={j} className={`mq-word${j % 2 === 0 ? ' italic' : ''}`}>
                  {w}
                </span>
              )).reduce((acc, el, idx, arr) => idx < arr.length - 1 ? [...acc, el, <span key={`dot-${idx}`} className="mq-dot" />] : [...acc, el], [])}
            </div>
          ))}
        </div>
      </div>

      {/* DIFERENCIAL */}
      <section className="diferencial">
        <div className="diferencial-wrap">
          <div className="label reveal">Diferencial</div>
          <h2 className="section-title reveal d1">Una estructura diseñada<br />para integrar capacidades.</h2>
          <p className="reveal d2">No prestamos servicios aislados. Desarrollamos ecosistemas capaces de resolver, integrar y acompañar procesos empresariales complejos con estructura, conexiones y capacidad de ejecución real.</p>
          <div className="pillars">
            {[['Resolución','Capacidad operativa'],['Integración','Ecosistema articulado'],['Conexión','Red estratégica'],['Expansión','Crecimiento sostenible']].map(([t, s], i) => (
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
            <div className="nev-corner-tag">Parte del grupo</div>
          <div className="nev-card-outer">
            <div className="nev-glow" />
            <div className="nev-content">
              <div className="nev-left">
                <div className="nev-live-badge reveal d1">
                  <span className="nev-live-dot" />
                  <span className="nev-live-label">En Vivo</span>
                </div>
                <div className="nev-eyebrow reveal d1">Del ecosistema de Ocean Black &amp; Co.</div>
                <h3 className="nev-title reveal d2">Negocios<br />en Vivo</h3>
                <p className="nev-desc reveal d3">Tu fuente confiable de noticias económicas, financieras y empresariales para el mercado latinoamericano.</p>
                <a href="https://negociosenvivo.com/" target="_blank" rel="noopener noreferrer" className="nev-cta reveal d4">
                  Conocer plataforma <span className="nev-arrow">→</span>
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
          <div className="label reveal">Modelo Operativo</div>
          <h2 className="section-title reveal d1">Estructura flexible.<br />Ejecución estratégica.</h2>
          <p className="reveal d2">Operamos mediante una red de especialistas, estudios y partners coordinados centralmente. Adaptamos recursos y soluciones según cada escenario — sin estructuras fijas, sin rigidez.</p>
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
        <div className="label reveal" style={{justifyContent:'center'}}>Nuestra Perspectiva</div>
        <h2 className="section-title reveal d1">El valor está<br />en la articulación.</h2>
        <p className="reveal d2">Las empresas que crecen hoy no lo hacen solas. Lo hacen con estructura, con conexiones estratégicas y con la capacidad de integrar soluciones en entornos que cambian rápido.</p>
        <p className="reveal d3">Creemos en una nueva generación de estructuras empresariales: más conectadas, más flexibles, orientadas a generar valor real a través de relaciones y ejecución.</p>
      </section>

      {/* RELACIONES */}
      <section className="relaciones" id="relaciones">
        <div className="label reveal" style={{justifyContent:'center'}}>Relaciones Empresariales</div>
        <h2 className="section-title reveal d1">Ecosistema<br />de relaciones.</h2>
        <p className="relaciones-intro reveal d2">Empresas, profesionales y organizaciones que comparten una visión orientada al crecimiento, la evolución y la generación de valor a largo plazo.</p>
        <div className="rel-logos-grid reveal d3">
          {[
            { src: '/logos-color/agropharm.png',      alt: 'Agropharm'    },
            { src: '/logos-color/pilloti.png',        alt: 'Pilloti'      },
            { src: '/logos-color/cromed.png',         alt: 'Crosmed'      },
            { src: '/logos-color/puntofarma.png',     alt: 'Punto Farma'  },
            { src: '/logos-color/bitronics.png',      alt: 'Bitronics'    },
            { src: '/logos-color/logo-segutrans.png', alt: 'Segutrans'    },
            { src: '/logos-color/locsys-2.png',       alt: 'Locsys'       },
            { src: '/logos-color/alfa-team-2.png',    alt: 'Alfa Team'    },
            { src: '/logos-color/limp.png',           alt: 'Limp'         },
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
            <div className="label reveal">Insights</div>
            <h2 className="section-title reveal d1">Perspectiva<br />empresarial.</h2>
          </div>
          <button className="link-underline reveal d2" onClick={() => openInsight(0)}>Ver todos</button>
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
              <div className="insight-arrow">Leer más</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto" id="contacto">
        <div className="contacto-left">
          <div className="label reveal">Contacto Institucional</div>
          <h2 className="section-title reveal d1">Iniciar una<br />conversación.</h2>
          <p className="reveal d2">Abiertos a construir relaciones estratégicas con empresas y organizaciones que busquen operar con mayor estructura e integración.</p>
          <div className="contact-details reveal d3">
            <div className="contact-row">
              <span className="contact-label">Email</span>
              <a href="mailto:contacto@oceanblack.com.ar" className="contact-value">contacto@oceanblack.com.ar</a>
            </div>
            <div className="contact-row">
              <span className="contact-label">Javier Cicero</span>
              <a href="mailto:javiercicero@oceanblack.com.ar" className="contact-value">javiercicero@oceanblack.com.ar</a>
            </div>
            <div className="contact-row">
              <span className="contact-label">Tomás Vera</span>
              <a href="mailto:tomasvera@oceanblack.com.ar" className="contact-value">tomasvera@oceanblack.com.ar</a>
            </div>
            <div className="contact-row">
              <span className="contact-label">Instagram</span>
              <a href="https://instagram.com/oceanblack.co" className="contact-value" target="_blank" rel="noopener">@oceanblack.co</a>
            </div>
            <div className="contact-row">
              <span className="contact-label">Ubicación</span>
              <span className="contact-value">Buenos Aires &nbsp;•&nbsp; Argentina</span>
            </div>
          </div>
        </div>
        <form className="contact-form reveal d2" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="empresa">Empresa</label>
            <input id="empresa" type="text" placeholder="Nombre de su organización" autoComplete="organization" />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" placeholder="Su nombre completo" autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email corporativo</label>
            <input id="email" type="email" placeholder="email@empresa.com" autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" placeholder="Descripción del escenario que busca resolver..." />
          </div>
          <button type="submit" className="btn-submit">Iniciar Conversación</button>
        </form>
      </section>

      {/* CIERRE */}
      <section className="cierre">
        <div className="cierre-bg-text" aria-hidden="true">OCEAN BLACK</div>
        <h2 className="section-title reveal">Conectar.<br />Resolver.<br />Expandir.</h2>
        <p className="cierre-sub reveal d1">Ecosistema Empresarial Estratégico</p>
        <a href="#contacto" className="cierre-btn reveal d2">Iniciar Conversación</a>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#inicio" className="nav-logo">
              <Image src="/logo.jpg" alt="Ocean Black & Co." width={34} height={34} />
              <span className="nav-logo-text">Ocean Black <em>&</em> Co.</span>
            </a>
            <p>Integración de soluciones, conexiones estratégicas y estructuras orientadas al crecimiento empresarial moderno.</p>
            <p className="footer-location">Buenos Aires &nbsp;•&nbsp; Argentina</p>
          </div>
          <div className="footer-col">
            <h5>Ecosistema</h5>
            <ul>
              <li><a href="#ecosistema">Estrategia</a></li>
              <li><a href="#ecosistema">Finanzas</a></li>
              <li><a href="#ecosistema">Legal</a></li>
              <li><a href="#ecosistema">Tecnología</a></li>
              <li><a href="#ecosistema">Real Estate</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Empresa</h5>
            <ul>
              <li><a href="#perspectiva">Perspectiva</a></li>
              <li><a href="#modelo">Modelo Operativo</a></li>
              <li><a href="#relaciones">Relaciones</a></li>
              <li><a href="#insights">Insights</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contacto</h5>
            <ul>
              <li><a href="mailto:contacto@oceanblack.com.ar">contacto@oceanblack.com.ar</a></li>
              <li><a href="mailto:javiercicero@oceanblack.com.ar">javiercicero@oceanblack.com.ar</a></li>
              <li><a href="mailto:tomasvera@oceanblack.com.ar">tomasvera@oceanblack.com.ar</a></li>
              <li><a href="https://instagram.com/oceanblack.co" target="_blank" rel="noopener">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Ocean Black & Co. Todos los derechos reservados.</p>
          <p className="footer-phrase">Conectar &nbsp;•&nbsp; Resolver &nbsp;•&nbsp; Expandir</p>
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
                <div className="am-num-label">Área {activeArea.num}</div>
                <h2 className="am-title">{activeArea.name}</h2>
                <p className="am-desc">{activeArea.text}</p>
                <div className="am-services-label">Servicios</div>
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
                  <span>Hablemos</span>
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
              >← Anterior</button>
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
              >Siguiente →</button>
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
  { src: '/logos/facyca.png',        alt: 'Facyca'       },
  { src: '/logos/brinks.png',        alt: 'Brinks'       },
  { src: '/logos/saintcobain.png',   alt: 'Saint-Gobain' },
  { src: '/logos/wallsecurity.png',  alt: 'Wall Security'},
  { src: '/logos/pilloti.png',       alt: 'Pilloti'      },
  { src: '/logos/grupo-maipu-2.png', alt: 'Grupo Maipú'  },
  { src: '/logos/molinos.png',       alt: 'Molinos'      },
  { src: '/logos/loginter.png',      alt: 'Loginter'     },
  { src: '/logos/imeco.png',         alt: 'Imeco'        },
  { src: '/logos/agropharm.png',     alt: 'Agropharm'    },
]

const areaData = [
  {
    num: '01', img: '/areas/01.jpg', name: 'Estrategia y Desarrollo Empresarial',
    text: 'Acompañamos empresas y ejecutivos en procesos de análisis, crecimiento y estructuración estratégica.',
    services: ['Diagnóstico empresarial','Desarrollo de estructura operativa','Estrategias de expansión','Optimización de procesos','Reorganización empresarial','Desarrollo comercial','Networking estratégico','Estructuración de alianzas','Advisory ejecutivo'],
  },
  {
    num: '02', img: '/areas/02.jpg', name: 'Área Contable, Fiscal y Administrativa',
    text: 'Articulamos soluciones contables y administrativas orientadas a mejorar la organización y eficiencia operativa.',
    services: ['Gestión contable integral','Liquidación impositiva','Planificación fiscal','Estructuración administrativa','Optimización tributaria','Análisis financiero','Auditoría administrativa','Monotributo y autónomos','Sueldos y cargas sociales','Reportes de gestión'],
  },
  {
    num: '03', img: '/areas/03.jpg', name: 'Soluciones Financieras y Corporativas',
    text: 'Desarrollamos acceso a herramientas financieras y estructuras orientadas a facilitar el crecimiento empresarial.',
    services: ['Gestión de líneas de crédito','Alternativas de financiamiento','Desarrollo de estructuras financieras','Capital para expansión','Soluciones corporativas estratégicas','Vehículos de optimización empresarial','Estructuración patrimonial','Evaluación de proyectos','Articulación con operadores y entidades'],
  },
  {
    num: '04', img: '/areas/04.jpg', name: 'Área Jurídica y Corporativa',
    text: 'Coordinamos soluciones legales y corporativas mediante estudios y profesionales especializados.',
    services: ['Derecho societario','Constitución de sociedades','Contratos comerciales','Estructuración corporativa','Acuerdos empresariales','Protección patrimonial','Asesoramiento laboral','Gestión societaria','Marcas y registros','Compliance corporativo'],
  },
  {
    num: '05', img: '/areas/05.jpg', name: 'Real Estate y Desarrollo Inmobiliario',
    text: 'Acompañamos operaciones y estructuras vinculadas al desarrollo inmobiliario y patrimonial.',
    services: ['Búsqueda de oportunidades','Inversiones inmobiliarias','Real estate corporativo','Estructuración patrimonial','Operaciones comerciales','Networking inmobiliario','Gestión de activos'],
  },
  {
    num: '06', img: '/areas/06.jpg', name: 'Recursos Humanos y Desarrollo Organizacional',
    text: 'Brindamos herramientas orientadas al fortalecimiento de equipos y estructuras internas.',
    services: ['Reclutamiento estratégico','Búsqueda ejecutiva','Desarrollo organizacional','Estructura de equipos','Procesos internos','Capacitación empresarial','Cultura organizacional','Optimización operativa'],
  },
  {
    num: '07', img: '/areas/07.jpg', name: 'Tecnología, IA y Automatización',
    text: 'Implementamos soluciones tecnológicas orientadas a mejorar eficiencia, control y escalabilidad empresarial.',
    services: ['Automatización de procesos','Inteligencia artificial aplicada','Integración de sistemas','CRM y gestión operativa','Asistentes virtuales empresariales','Automatización comercial','Dashboards y control','Optimización digital','Desarrollo de ecosistemas tecnológicos'],
  },
  {
    num: '08', img: '/areas/08.jpg', name: 'Seguridad y Protección Empresarial',
    text: 'Desarrollamos soluciones vinculadas a prevención, control y resguardo operativo.',
    services: ['Seguridad corporativa','Evaluación operativa','Protocolos internos','Seguridad tecnológica','Supervisión estratégica','Control de procesos sensibles'],
  },
  {
    num: '09', img: '/areas/09.jpg', name: 'Desarrollo Comercial, Marketing y Expansión',
    text: 'Estrategias orientadas al posicionamiento, crecimiento comercial y fortalecimiento operativo de empresas y marcas.',
    services: ['Estrategias de crecimiento','Expansión comercial','Estructuración de áreas de ventas','Posicionamiento empresarial','Branding corporativo','Comunicación institucional','Estrategias digitales','CRM y seguimiento de clientes','Automatización de procesos comerciales','Embudos y gestión comercial','Sitios web corporativos','Ecosistemas digitales'],
  },
  {
    num: '10', img: '/areas/10.jpg', name: 'Formación Comercial y Desarrollo de Equipos',
    text: 'Programas orientados al fortalecimiento comercial, profesionalización de equipos y optimización de procesos de ventas.',
    services: ['Entrenamiento de equipos comerciales','Desarrollo de procesos de ventas','Estructuración de áreas comerciales','Capacitación en negociación y cierre','Optimización de atención y seguimiento','Formación en ventas consultivas','Integración de herramientas digitales','IA aplicada a procesos comerciales','Desarrollo de liderazgo comercial','Workshops y programas internos'],
  },
]

const modeloItems = [
  { title: 'Red de especialistas', text: 'Partners y profesionales integrados bajo coordinación central.' },
  { title: 'Acceso estratégico', text: 'Conexiones que generan valor y oportunidades de desarrollo.' },
  { title: 'Coordinación integral', text: 'Soluciones articuladas según cada nivel y escenario.' },
  { title: 'Capacidad de resolución', text: 'Estructura preparada para operar en entornos complejos.' },
]

const insightCards = [
  {
    cat: 'Estrategia',
    title: 'Estructuras flexibles para entornos en transformación',
    text: 'Las organizaciones que se adaptan con velocidad son las que ganan. La estructura es la ventaja competitiva invisible.',
    body: [
      { type: 'p', text: 'Las compañías atraviesan escenarios cada vez más dinámicos, donde la capacidad de adaptación dejó de ser una ventaja secundaria para convertirse en un factor central de competitividad.' },
      { type: 'p', text: 'En OCEAN BLACK & CO. trabajamos sobre la estructura estratégica de empresas y organizaciones que necesitan optimizar procesos, redefinir modelos operativos y fortalecer su capacidad de respuesta frente a nuevos desafíos.' },
      { type: 'p', text: 'Nuestro enfoque combina análisis, visión empresarial y coordinación interdisciplinaria para desarrollar soluciones alineadas a las necesidades reales de cada operación.' },
      { type: 'lead', text: 'Acompañamos procesos vinculados a:' },
      { type: 'ul', items: ['Reorganización operativa', 'Optimización interna', 'Desarrollo comercial', 'Estructura corporativa', 'Expansión de unidades de negocio', 'Fortalecimiento estratégico'] },
      { type: 'p', text: 'Entendemos que detrás de cada etapa de crecimiento existe una necesidad estructural distinta. La velocidad sin estructura genera desgaste. La estructura permite sostener evolución, eficiencia y escalabilidad.' },
    ],
  },
  {
    cat: 'Tecnología & IA',
    title: 'Automatización: la nueva base de operación corporativa',
    text: 'La inteligencia artificial aplicada ya no es una tendencia. Es el estándar de las empresas que buscan escalar.',
    body: [
      { type: 'p', text: 'La transformación tecnológica ya no pertenece únicamente a grandes corporaciones. Hoy, las organizaciones más competitivas son aquellas capaces de integrar automatización, inteligencia artificial y sistemas inteligentes dentro de sus operaciones cotidianas.' },
      { type: 'p', text: 'En OCEAN BLACK & CO. impulsamos soluciones orientadas a optimizar tiempos, reducir fricción operativa y mejorar la capacidad de gestión mediante herramientas tecnológicas adaptadas a cada estructura empresarial.' },
      { type: 'lead', text: 'Trabajamos sobre:' },
      { type: 'ul', items: ['Automatización de procesos', 'Integración de sistemas', 'Inteligencia artificial aplicada', 'Optimización administrativa', 'Desarrollo de herramientas digitales', 'Modernización operativa'] },
      { type: 'quote', text: 'La tecnología no reemplaza estructuras. Las potencia.' },
      { type: 'p', text: 'La incorporación estratégica de automatización permite a las empresas operar con mayor precisión, velocidad y capacidad de expansión, liberando tiempo y recursos para enfocarse en decisiones de alto valor.' },
    ],
  },
  {
    cat: 'Expansión',
    title: 'El capital estratégico detrás del crecimiento sostenible',
    text: 'Crecer requiere más que financiamiento. Requiere acceso, conexiones y una estructura que soporte la expansión.',
    body: [
      { type: 'p', text: 'Expandirse implica mucho más que aumentar volumen o incorporar recursos. El crecimiento sostenible requiere estructura, visión, acceso estratégico y capacidad de ejecución.' },
      { type: 'p', text: 'En OCEAN BLACK & CO. acompañamos empresas y organizaciones que buscan fortalecer sus procesos de expansión mediante conexiones, herramientas y soluciones alineadas a objetivos concretos de desarrollo.' },
      { type: 'lead', text: 'Nuestro ecosistema integra distintas áreas para facilitar:' },
      { type: 'ul', items: ['Crecimiento comercial', 'Desarrollo corporativo', 'Generación de alianzas', 'Acceso a nuevas oportunidades', 'Optimización de estructura', 'Acompañamiento en procesos de escalabilidad'] },
      { type: 'p', text: 'Creemos que las empresas crecen de forma más sólida cuando cuentan con una estructura preparada para sostener esa evolución.' },
      { type: 'quote', text: 'El verdadero crecimiento no depende únicamente del capital disponible, sino de la capacidad de transformar oportunidades en expansión real.' },
    ],
  },
]
