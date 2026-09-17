'use client'

export function Hero() {
  return (
    <div className="ed-hero">
      <p className="ed-hero-brand hero-piece">
        Informe de transformación
      </p>
      <h1 className="ed-hero-title hero-piece">
        De días
        <span className="ed-hero-title-em"> a segundos</span>
      </h1>
      <p className="ed-hero-lead hero-piece">
        El mismo archivo de ~50 partidas: de 1.5 días laborales a un parpadeo.
      </p>

      <div className="ed-hero-compare">
        <div className="ed-hero-old hero-old-num opacity-0">
          <span className="ed-hero-compare-label">Antes</span>
          <span className="ed-hero-compare-value">
            1.5 días
            <span className="hero-strike" aria-hidden />
          </span>
        </div>
        <div className="ed-hero-new hero-new-wrap opacity-0">
          <span className="ed-hero-compare-label">Ahora</span>
          <span className="ed-hero-compare-value is-accent">
            <span className="hero-new-num tabular">0</span> seg
          </span>
        </div>
      </div>

      <div className="ed-hero-bar hero-piece opacity-0">
        <div className="ed-hero-bar-meta">
          <span>Tiempo por archivo</span>
          <span className="text-orange">
            ~<span className="hero-mult tabular">0</span>× más rápido
          </span>
        </div>
        <div className="ed-hero-bar-track">
          <div className="hero-compress-track" />
        </div>
      </div>

      <p className="ed-hero-scroll hero-scroll-cue opacity-0">
        <span className="hero-scroll-arrow">↓</span>
        Desplázate por la historia
      </p>
    </div>
  )
}
