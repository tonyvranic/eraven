import type { HomeHeroQuote } from "./Hero.types";
import { queryFn } from "../../../../utils/queryFn";

export default function Init() {
  const homeHeroSections = document.querySelectorAll('[data-home-hero-section]');
  
  homeHeroSections.forEach(section => {
    // Config
    const intervalDuration = 8;
    const firstTimerDuration = 5;
    const quotes: HomeHeroQuote[] = [
      {
        text: 'Exploring the <em>intersection</em><br> of creativity<br> & code',
        patternPath: '/patterns/intersection-pattern.svg',
        patternHoverPath: '/patterns/intersection-pattern-hover.svg'
      },
      {
        text: 'Unlocking <em>Potential</em><br> From Concept<br> to <em>Creation</em>',
        patternPath: '/patterns/unlocked-lock-pattern.svg',
        patternHoverPath: '/patterns/unlocked-lock-pattern-hover.svg'
      },
      {
        text: 'The Future of<br> <em>Making</em> lies<br> Beyond the<br> <em>Horizon</em>',
        patternPath: '/patterns/compass-pattern.svg',
        patternHoverPath: '/patterns/compass-pattern-hover.svg'
      },
      {
        text: 'Turn <em>Ideas</em><br> into Impact<br> A <em>Maker\'s</em><br> Journey',
        patternPath: '/patterns/wings-pattern.svg',
        patternHoverPath: '/patterns/wings-pattern-hover.svg'
      },
    ];
  
    const hideTitleClass = 'hide-title';
    const showTitleClass = 'show-title';

    const hidePatternClass = 'hide-pattern';
    const showPatternClass = 'show-pattern';
  
  
    // Queries
    const titleEls = queryFn(section, '.hero-title', { all: true });
    const titleWrapEls = queryFn(section, '.hero-wrap', { all: true });

    const patternBgEl = queryFn(section, '.hero-bg-pattern', { all: false });
    const patternHoverBgEl = queryFn(section, '.hero-bg-pattern.type-hover', { all: false });
    if (!titleEls || !titleWrapEls || !patternBgEl || !patternHoverBgEl) return;
  
  
    // State
    let currentQuoteIndex = 0;
  
  
    // Main
    // swapTitles(titleWrapEls, titleEls, quotes[3]);
    registerInterval(titleWrapEls, titleEls, patternBgEl, patternHoverBgEl);
  
  
    // Functions
    function swapQuote(
      titleWrapEls: NodeListOf<HTMLElement>,
      titleEls: NodeListOf<HTMLElement>,
      patternBgEl: HTMLElement,
      patternHoverBgEl: HTMLElement,
    ) {
      const nextQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      const nextQuote = quotes[nextQuoteIndex];
  

      swapTitles(titleWrapEls, titleEls, nextQuote);
      swapPatterns(patternBgEl, patternHoverBgEl, nextQuote);
  
      // Update index
      currentQuoteIndex = nextQuoteIndex;
    }
  

    /**
     * Interval will get registered after the initial settimeout
     */
    function registerInterval(
      titleWrapEls: NodeListOf<HTMLElement>,
      titleEls: NodeListOf<HTMLElement>,
      patternBgEl: HTMLElement,
      patternHoverBgEl: HTMLElement
    ) {
      const timerDuration = firstTimerDuration * 1000;
      const intervalDurationMs = intervalDuration * 1000;

      setTimeout(() => {
        swapQuote(titleWrapEls, titleEls, patternBgEl, patternHoverBgEl);

        setInterval(() => {
          swapQuote(titleWrapEls, titleEls, patternBgEl, patternHoverBgEl);
        }, intervalDurationMs);
      }, timerDuration);

    }
  
  
    // Async
    async function swapPatterns(
      patternBgEl: HTMLElement,
      patternHoverBgEl: HTMLElement,
      nextQuote: HomeHeroQuote
    ): Promise<void> {
      await sleep(0.4);

      // Hide the current patterns
      patternBgEl.classList.remove(hidePatternClass);
      patternHoverBgEl.classList.remove(hidePatternClass);
      patternBgEl.classList.add(hidePatternClass);
      patternHoverBgEl.classList.add(hidePatternClass);

      await sleep(1.1);

      // Update the background images for the patterns based on the next quote
      if (patternBgEl) {
        patternBgEl.style.backgroundImage = `url("${nextQuote.patternPath}")`;
      }
      if (patternHoverBgEl) {
        patternHoverBgEl.style.backgroundImage = `url("${nextQuote.patternHoverPath}")`;
      }

      await sleep(0.2);

      // Show the updated patterns
      patternBgEl.classList.remove(hidePatternClass);
      patternHoverBgEl.classList.remove(hidePatternClass);
      patternBgEl.classList.add(showPatternClass);
      patternHoverBgEl.classList.add(showPatternClass);
    }

    async function swapTitles(
      titleWrapEls: NodeListOf<HTMLElement>,
      titleEls: NodeListOf<HTMLElement>,
      nextQuote: HomeHeroQuote
    ): Promise<void> {
      // Hide titles
      titleWrapEls.forEach((titleWrapEl) => {
        titleWrapEl.classList.remove(hideTitleClass);
        titleWrapEl.classList.add(hideTitleClass);
      });
  
      await sleep(1.5);
  
      // Update titles with the next quote's text
      titleEls.forEach((titleEl) => {
        titleEl.innerHTML = nextQuote.text;
      });
      
      // Show titles with the next quote's text
      titleWrapEls.forEach((titleWrapEl) => {
        titleWrapEl.classList.remove(hideTitleClass);
        titleWrapEl.classList.add(showTitleClass);
      });
    }
  
  
    // Helpers
    function sleep(s: number) {
      const ms = s * 1000;
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  });
}