'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            lerp: 0.06,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            smoothWheel: true,
            syncTouch: false,
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
