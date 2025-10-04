import gsap from 'gsap';

export const DownAnimation = (element: HTMLElement) => {
    gsap.fromTo(element, {
        opacity: 0,
        y: -30,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.inOut'
    })
}