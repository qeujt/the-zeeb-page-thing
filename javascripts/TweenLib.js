// tweenService.js — lightweight tweening/easing utility for web development
//
// Usage:
//   const tween = Tween(500, Easing.quadOut, v => (el.style.opacity = v), () => console.log('done'));
//   tween.play();      // nothing animates until you call this
//   tween.cancel();    // or tween.disconnect() / tween()

const Easing = {
    linear: t => t,

    quadIn: t => t ** 2,
    quadOut: t => t * (2 - t),
    quadInOut: t => (t < 0.5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t),

    cubicIn: t => t ** 3,
    cubicOut: t => (--t) ** 3 + 1,
    cubicInOut: t => (t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) ** 2 + 1),

    quartIn: t => t ** 4,
    quartOut: t => 1 - (--t) ** 4,
    quartInOut: t => (t < 0.5 ? 8 * t ** 4 : 1 - 8 * (--t) ** 4),

    quintIn: t => t ** 5,
    quintOut: t => 1 + (--t) ** 5,
    quintInOut: t => (t < 0.5 ? 16 * t ** 5 : 1 + 16 * (--t) ** 5),

    sineIn: t => 1 - Math.cos((t * Math.PI) / 2),
    sineOut: t => Math.sin((t * Math.PI) / 2),
    sineInOut: t => -(Math.cos(Math.PI * t) - 1) / 2,

    expoIn: t => (t === 0 ? 0 : 2 ** (10 * (t - 1))),
    expoOut: t => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
    expoInOut: t => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2;
    },

    circIn: t => 1 - Math.sqrt(1 - t ** 2),
    circOut: t => Math.sqrt(1 - (--t) ** 2),
    circInOut: t =>
        t < 0.5
            ? (1 - Math.sqrt(1 - 4 * t ** 2)) / 2
            : (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2,

    backIn: t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t ** 3 - c1 * t ** 2;
    },
    backOut: t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
    },
    backInOut: t => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2
            : ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },

    elasticIn: t => {
        const c4 = (2 * Math.PI) / 3;
        if (t === 0) return 0;
        if (t === 1) return 1;
        return -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
    },
    elasticOut: t => {
        const c4 = (2 * Math.PI) / 3;
        if (t === 0) return 0;
        if (t === 1) return 1;
        return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    elasticInOut: t => {
        const c5 = (2 * Math.PI) / 4.5;
        if (t === 0) return 0;
        if (t === 1) return 1;
        return t < 0.5
            ? -(2 ** (20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
            : (2 ** (-20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    },

    bounceOut: t => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t ** 2;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) ** 2 + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) ** 2 + 0.9375;
        return n1 * (t -= 2.625 / d1) ** 2 + 0.984375;
    },
    bounceIn: t => 1 - Easing.bounceOut(1 - t),
    bounceInOut: t =>
        t < 0.5 ? (1 - Easing.bounceOut(1 - 2 * t)) / 2 : (1 + Easing.bounceOut(2 * t - 1)) / 2,
};

function Tween(duration, easingFn, onUpdate, onComplete, onCancel) {
    let start = null;
    let rafId = null;
    let cancelled = false;
    let finished = false;
    let playing = false;

    function frame(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        onUpdate(easingFn(progress));

        if (progress < 1) {
            rafId = requestAnimationFrame(frame);
        } else {
            finished = true;
            playing = false;
            rafId = null;
            if (onComplete) onComplete();
        }
    }

    function handle() {
        handle.cancel();
    }

    handle.play = function () {
        if (playing || finished || cancelled) return handle; // already started/done, nothing to do
        playing = true;
        start = performance.now();
        rafId = requestAnimationFrame(frame);
        return handle;
    };

    handle.cancel = function () {
        if (cancelled || finished) return;
        cancelled = true;
        playing = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        if (onCancel) onCancel();
    };

    handle.disconnect = handle.cancel;

    Object.defineProperties(handle, {
        cancelled: { get: () => cancelled, enumerable: true },
        finished: { get: () => finished, enumerable: true },
        playing: { get: () => playing, enumerable: true },
    });

    return handle;
}

// Optional: support module usage (bundlers/Node) alongside plain <script> global usage
export { Easing, Tween };