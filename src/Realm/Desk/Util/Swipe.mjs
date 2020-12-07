/**
 * This swiper handles 4 type of swipes: left, right, down, up.
 */
export default class Fl32_Leana_Realm_Desk_Util_Swipe {
    /** @type {Function} */
    callOnDown
    /** @type {Function} */
    callOnLeft
    /** @type {Function} */
    callOnRight
    /** @type {Function} */
    callOnUp
    /** @type {Element} */
    element
    /** @type {Touch} */
    toucheStart

    constructor(element) {
        this.element = typeof (element) === 'string' ? document.querySelector(element) : element;
        this.element.addEventListener('touchstart', handleStart, {passive: true});
        this.element.addEventListener('touchend', handleEnd, {passive: true});
        // this.element.addEventListener('touchmove', handleMove, {passive: true});
        // this.element.addEventListener('touchcancel', handleCancel, {passive: true});
        const me = this;

        /**
         * @param {TouchEvent} evt
         */
        function handleStart(evt) {
            const touches = evt.changedTouches;
            me.toucheStart = touches[0];
        }

        /**
         * @param {TouchEvent} evt
         */
        function handleEnd(evt) {
            const touches = evt.changedTouches;
            /** @type {Touch} */
            const touchEnd = touches[0];
            const dX = Math.abs(touchEnd.clientX - me.toucheStart.clientX);
            const dY = Math.abs(touchEnd.clientY - me.toucheStart.clientY);
            if (dX > dY) {
                // horizontal swipe
                if (touchEnd.clientX < me.toucheStart.clientX) {    // to the left
                    if (typeof me.callOnLeft === 'function') me.callOnLeft();
                } else {    // to the right
                    if (typeof me.callOnRight === 'function') me.callOnRight();
                }
            } else {
                // vertical swipe
                if (touchEnd.clientY < me.toucheStart.clientY) {    // upward
                    if (typeof me.callOnUp === 'function') me.callOnUp();
                } else {    // downward
                    if (typeof me.callOnDown === 'function') me.callOnDown();
                }
            }
        }

        /**
         * @param {TouchEvent} evt
         */
        // function handleMove(evt) {
        //     // reserved
        // }

        /**
         * @param {TouchEvent} evt
         */
        // function handleCancel(evt) {
        //     // reserved
        // }
    }


    setOnDown(callback) {
        this.callOnDown = callback;
    }

    setOnLeft(callback) {
        this.callOnLeft = callback;
    }

    setOnRight(callback) {
        this.callOnRight = callback;
    }

    setOnUp(callback) {
        this.callOnUp = callback;
    }

}
