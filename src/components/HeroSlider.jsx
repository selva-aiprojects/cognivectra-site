import { useState, useEffect } from "react";

/**
 * HeroSlider component
 * @param {Array} slides - Array of objects { image, title, subtitle }
 * @param {number} interval - Time in ms for each slide
 */
export default function HeroSlider({ slides, interval = 5000 }) {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
            setProgress(0);
        }, interval);

        const progressTimer = setInterval(() => {
            setProgress((prev) => Math.min(prev + (100 / (interval / 100)), 100));
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(progressTimer);
        };
    }, [slides.length, interval]);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="hero-slider-container">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === current ? "active" : ""}`}
                >
                    <img src={slide.image} alt={slide.title || "Hero visual"} loading="lazy" />
                    <div className="slide-overlay"></div>

                    <div className="slide-caption">
                        {slide.title && <h4>{slide.title}</h4>}
                        {slide.subtitle && <p>{slide.subtitle}</p>}
                    </div>
                </div>
            ))}

            {/* Navigation & Progress */}
            <div className="slider-nav">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`slider-dot ${index === current ? "active" : ""}`}
                        onClick={() => {
                            setCurrent(index);
                            setProgress(0);
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        {index === current && (
                            <svg className="progress-ring" width="24" height="24">
                                <circle
                                    className="progress-ring-circle"
                                    stroke="var(--accent-primary)"
                                    strokeWidth="2"
                                    fill="transparent"
                                    r="10"
                                    cx="12"
                                    cy="12"
                                    style={{
                                        strokeDasharray: "62.8",
                                        strokeDashoffset: 62.8 - (62.8 * progress) / 100,
                                    }}
                                />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
