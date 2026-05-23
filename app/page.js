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
    eyebrow: 'Para empresas y ejecutivos en expansión.',
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
    eyebrow: 'Para empresas e executivos em expansão.',
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
  const [country, setCountry] = useState('ar')
  const [flagOpen, setFlagOpen] = useState(false)
  const [moFlagOpen, setMoFlagOpen] = useState(false)
  const [videoControls, setVideoControls] = useState(false)

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

    const videoEl = explainerRef.current
    const videoObs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(() => {})
        else e.target.pause()
      }),
      { threshold: 0.25 }
    )
    if (videoEl) videoObs.observe(videoEl)

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
    }
  }, [])

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
          <video autoPlay muted loop playsInline preload="none">
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
      <div className="logo-ticker">
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
            <video ref={explainerRef} playsInline muted controls={videoControls} preload="none">
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
          {areas.map((area, i) => (
            <div className={`area-card reveal${i % 3 !== 0 ? ` d${i % 3}` : ''}`} key={area.num}>
              <div className="area-num">{area.num}</div>
              <div className="area-name">{area.name}</div>
              <div className="area-text">{area.text}</div>
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
        <div className="logos-row reveal d3">
          {[...Array(6)].map((_, i) => (
            <div className="logo-slot" key={i}>
              <svg width="90" height="24" viewBox="0 0 90 24" fill="none">
                <rect x="0" y="8" width="90" height="8" rx="1" fill="currentColor" opacity="0.35"/>
              </svg>
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
          <a href="#" className="link-underline reveal d2">Ver todos</a>
        </div>
        <div className="insights-grid">
          {insightCards.map((card, i) => (
            <div className={`insight-card reveal${i > 0 ? ` d${i}` : ''}`} key={card.title}>
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
              <a href="mailto:contacto@oceanblack.co" className="contact-value">contacto@oceanblack.co</a>
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
              <li><a href="#contacto">Contacto Institucional</a></li>
              <li><a href="https://instagram.com/oceanblack.co" target="_blank" rel="noopener">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Ocean Black & Co. Todos los derechos reservados.</p>
          <p className="footer-phrase">Conectar &nbsp;•&nbsp; Resolver &nbsp;•&nbsp; Expandir</p>
        </div>
      </footer>
    </>
  )
}

const logoList = [
  { src: '/logos/agropharm.png',      alt: 'Agropharm',    w: 48  },
  { src: '/logos/pilloti.png',        alt: 'Pilloti',      w: 208 },
  { src: '/logos/wallsecurity.png',   alt: 'Wall Security',w: 83  },
  { src: '/logos/cromed.png',         alt: 'Crosmed',      w: 96  },
  { src: '/logos/facyca.png',         alt: 'Facyca',       w: 167 },
  { src: '/logos/puntofarma.png',     alt: 'Punto Farma',  w: 103 },
  { src: '/logos/bitronics.png',      alt: 'Bitronics',    w: 75  },
  { src: '/logos/logo-segutrans.png', alt: 'Segutrans',    w: 116 },
  { src: '/logos/locsys-2.png',       alt: 'Locsys',       w: 75  },
  { src: '/logos/alfa-team-2.png',    alt: 'Alfa Team',    w: 75  },
  { src: '/logos/grupo-maipu-2.png',  alt: 'Grupo Maipú',  w: 75  },
  { src: '/logos/limp.png',           alt: 'Limp',         w: 48  },
  { src: '/logos/imeco.png',          alt: 'Imeco',        w: 261 },
]

const areas = [
  { num: '01', name: 'Estrategia y Desarrollo Empresarial', text: 'Diagnóstico, estructuración operativa, expansión y advisory ejecutivo.' },
  { num: '02', name: 'Contable, Fiscal y Administrativa', text: 'Planificación fiscal, optimización tributaria y gestión contable integral.' },
  { num: '03', name: 'Soluciones Financieras y Corporativas', text: 'Financiamiento, estructuras de capital y articulación con operadores especializados.' },
  { num: '04', name: 'Jurídica y Corporativa', text: 'Derecho societario, contratos, estructuración corporativa y compliance.' },
  { num: '05', name: 'Real Estate y Desarrollo Inmobiliario', text: 'Inversiones, estructuración patrimonial y activos estratégicos.' },
  { num: '06', name: 'Recursos Humanos y Desarrollo Organizacional', text: 'Reclutamiento ejecutivo, cultura organizacional y optimización de equipos.' },
  { num: '07', name: 'Tecnología, IA y Automatización', text: 'Automatización, inteligencia artificial aplicada y ecosistemas digitales.' },
  { num: '08', name: 'Seguridad y Protección Empresarial', text: 'Gestión de riesgo corporativo, protocolos internos y seguridad operativa.' },
  { num: '09 — 10', name: 'Desarrollo Comercial, Marketing y Formación', text: 'Posicionamiento, branding, automatización comercial y formación de equipos.' },
]

const modeloItems = [
  { title: 'Red de especialistas', text: 'Partners y profesionales integrados bajo coordinación central.' },
  { title: 'Acceso estratégico', text: 'Conexiones que generan valor y oportunidades de desarrollo.' },
  { title: 'Coordinación integral', text: 'Soluciones articuladas según cada nivel y escenario.' },
  { title: 'Capacidad de resolución', text: 'Estructura preparada para operar en entornos complejos.' },
]

const insightCards = [
  { cat: 'Estrategia', title: 'Estructuras flexibles para entornos en transformación', text: 'Las organizaciones que se adaptan con velocidad son las que ganan. La estructura es la ventaja competitiva invisible.' },
  { cat: 'Tecnología & IA', title: 'Automatización: la nueva base de operación corporativa', text: 'La inteligencia artificial aplicada ya no es una tendencia. Es el estándar de las empresas que buscan escalar.' },
  { cat: 'Expansión', title: 'El capital estratégico detrás del crecimiento sostenible', text: 'Crecer requiere más que financiamiento. Requiere acceso, conexiones y una estructura que soporte la expansión.' },
]
