'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

// Detect touch / low-end devices
function isTouchDevice() {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

function isLowEndDevice() {
    if (typeof navigator === 'undefined') return false;
    // Use hardware concurrency as a rough proxy (< 4 cores = low-end)
    return navigator.hardwareConcurrency != null && navigator.hardwareConcurrency < 4;
}

const preventSelectors = [
    '[data-lenis-prevent]',
    '[data-lenis-prevent-wheel]',
    '.phone-input-country-dropdown',
];

function shouldPrevent(node) {
    if (!node || typeof node.closest !== 'function') return false;
    return preventSelectors.some((sel) => Boolean(node.closest(sel)));
}

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const touch = isTouchDevice();
        const lowEnd = isLowEndDevice();

        // Tune parameters per device capability
        const lerp = lowEnd ? 0.14 : touch ? 0.12 : 0.10;
        const duration = lowEnd ? 0.8 : touch ? 1.0 : 1.2;

        const lenis = new Lenis({
            // How long the scroll inertia lasts (seconds)
            duration,
            // Smooth momentum curve — expo-out feels natural on all browsers
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            // Linear interpolation amount — higher = snappier (no lag on small screens)
            lerp,
            // Wheel scroll speed multiplier
            wheelMultiplier: 1,
            // Touch scroll speed — keep at 2 so mobile feels responsive
            touchMultiplier: 2,
            // Enable smooth wheel scroll (Chrome, Firefox, Edge)
            smoothWheel: true,
            // IMPORTANT: syncTouch must be true so iOS Safari & Android get smooth scroll
            syncTouch: true,
            // Prevent lenis on specific elements (dropdowns, carousels, etc.)
            prevent: (node) => shouldPrevent(node),
            virtualScroll: ({ event }) => {
                if (shouldPrevent(event?.target)) return false;
                return true;
            },
        });

        // Use Lenis built-in autoRaf for reliability across tab switches & visibility changes
        lenis.start();

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // Pause lenis when tab is hidden to save resources
        function onVisibilityChange() {
            if (document.hidden) {
                lenis.stop();
            } else {
                lenis.start();
            }
        }
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
