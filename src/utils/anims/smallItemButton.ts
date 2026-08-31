import gsap from 'gsap';

/**
 * Spring animates the item on hover a bit upwards 
 * and on click with a quick spring scale down and 
 * back up with a slight random rotation.
 */
export const animSmallItemButton = (item: Element) => {
    // Hover animations
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        y: -5,
        duration: 1,
        ease: 'elastic.out(1.1, 0.3)',
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        y: 0,
        duration: 1,
        ease: 'elastic.out(1.1, 0.3)',
      });
    });


  // Add click animation
  item.addEventListener('mousedown', () => {
    const tl = gsap.timeline();

    tl.to(item, {
      scale: 0.8,
      rotate: () => 16 * ((Math.random() - 0.5) * 2),
      duration: 0.13,
      ease: 'power3.out',
    });

    tl.to(item, {
      scale: 1,
      rotate: 0,
      duration: 1.2,
      ease: 'elastic.out(1.1, 0.3)',
    });
  });
};