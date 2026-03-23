'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {

    useEffect(() => {
        const preventSelectors = ['[data-lenis-prevent]', '[data-lenis-prevent-wheel]', '.phone-input-country-dropdown'];

        const shouldPreventLenis = (node) => {
            if (!node || typeof node.closest !== 'function') {
                return false;
            }
            return preventSelectors.some((selector) => Boolean(node.closest(selector)));
        };

        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            lerp: 0.06,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            smoothWheel: true,
            syncTouch: false,
            prevent: (node) => shouldPreventLenis(node),
            virtualScroll: ({ event }) => {
                if (shouldPreventLenis(event?.target)) {
                    return false;
                }
                return true;
            },
        });

        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
