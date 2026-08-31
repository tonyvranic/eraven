import gsap from 'gsap';

export const animToggleContent = (
    item: Element,
    show: boolean,
) => {
    const tl = gsap.timeline({
        defaults: {
            duration: 0.22,
            ease: 'power3.out',
        }
    });

    if (show) {
        tl.to(item, {
            display: 'block',
            autoAlpha: 1,
            scale: 1,
            delay: 0.22,
        });
    } else {
        tl.to(item, {
            display: 'none',
            autoAlpha: 0,
            scale: 0.85,
        });
    }
};
