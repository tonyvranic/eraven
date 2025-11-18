import gsap from 'gsap';

export default function init(root) {
    // Exports
    const title1 = root.querySelector('.loader-1-title-1');
    const title2 = root.querySelector('.loader-1-title-2');
    const title3 = root.querySelector('.loader-1-title-3');
    const loader = root.querySelector('.loader-1-loader');

    const hiddenText = root.querySelector('.loader-1-title-3-slide-1');

    // Init
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            duration: 4,
            ease: 'power1.out'
        },
        onComplete: () => {
            hiddenText.classList.add('active');
        }
    });

    resetElements();
    setupTimeline();

    document.fonts.ready.then(() => {
        root.classList.add('active');
        tl.play();
    })

    // Functions
    function setupTimeline() {
        tl.to(title1, {
            autoAlpha: 1
        }).to(title1, {
            autoAlpha: 0,
            duration: 1.5
        }).to(title2, {
            autoAlpha: 1
        }).to(title2, {
            autoAlpha: 0,
            duration: 1.5
        }).to(title3, {
            autoAlpha: 1
        }).to(loader, {
            autoAlpha: 1
        })
    }

    // Helpers
    function resetElements() {
        gsap.set(
            [title1, title2, title3, loader],
            { autoAlpha: 0}
        );
    }
}