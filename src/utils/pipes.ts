/**
* Debounces a function call
*
* @param {Function} callback - Function to debounce
* @param {number} [delay=250] - Delay in milliseconds (default: `250`)
* @returns {Function} Debounced function
*/
export function debounce<T extends (...args: any[]) => void>(callback: T, delay: number = 250): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function(this: unknown, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(this, args), delay);
    };
}

/**
* Throttles a function call
*
* @param {Function} callback - Function to throttle
* @param {number} [delay=250] - Minimum delay between calls in milliseconds (default: `250`)
* @returns {Function} Throttled function
*/
export function throttle<T extends (...args: any[]) => void>(callback: T, delay: number = 250): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return function(this: unknown, ...args: Parameters<T>) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            callback.apply(this, args);
        }
    };
}