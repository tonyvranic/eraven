interface LazyObserveOptions<
  T extends HTMLElement
> {
  selector: string;
  defaultOffset?: number;
  defaultMultiplierOffset?: number;
  defaultMultiplier?: number;
  onIntersect: (el: T) => void;
}

/**
 * Lazy observes elements matching the selector and triggers the callback when they intersect.
 * Offset is calculated by: `${baseMargin + multiplier * multiplierOffset}px`
 * Or if using defaults: `${defaultOffset + defaultMultiplier * defaultMultiplierOffset}px`
 * 
 * @param selector
 * @param defaultOffset
 * @param defaultMultiplierOffset
 * @param defaultMultiplier
 * @param onIntersect Callback functions
 * 
 */
export function lazyObserve<
  T extends HTMLElement = HTMLElement
>({
  selector,
  defaultOffset = 400,
  defaultMultiplierOffset = 200,
  defaultMultiplier = 0,
  onIntersect,
}: LazyObserveOptions<T>) {
  // Queries
  const els = document.querySelectorAll<T>(selector);


  // State
  const groups = new Map<string, T[]>();


  // Main
  if (!('IntersectionObserver' in window)) {
    els.forEach(onIntersect);
    return;
  }

  addElementsToGroups();
  iterateThroughGroups();


  // Functions
  function iterateThroughGroups() {
    groups.forEach((group, rootMargin) => {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          console.log('Element intersected:', entry.target);

          onIntersect(entry.target as T);
          obs.unobserve(entry.target);
        });
      }, { rootMargin, scrollMargin: rootMargin });

      group.forEach(el => observer.observe(el));
    });
  }

  function addElementsToGroups() {
    els.forEach(el => {
      const baseMargin       = el.dataset.offset           ? parseInt(el.dataset.offset)           : defaultOffset;
      const multiplierOffset = el.dataset.multiplierOffset ? parseInt(el.dataset.multiplierOffset) : defaultMultiplierOffset;
      const multiplier       = el.dataset.multiplier       ? parseInt(el.dataset.multiplier)       : defaultMultiplier;

      const rootMargin = `${baseMargin + multiplier * multiplierOffset}px`;
      const group = groups.get(rootMargin) ?? [];
      group.push(el);
      groups.set(rootMargin, group);

      console.log(`Added element to group with rootMargin: ${rootMargin}`, el);
    });
  }
}