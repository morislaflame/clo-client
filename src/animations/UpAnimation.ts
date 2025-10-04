import gsap from 'gsap';

export const UpAnimation = (element: HTMLElement) => {
    gsap.fromTo(element, {
        opacity: 0,
        y: 25,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.inOut'
    })
}