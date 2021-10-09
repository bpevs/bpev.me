/**
 * Return a function that won't be triggered as long as it continues to be invoked
 * @param func Function to be debounced
 * @param wait Milliseconds wait time
 * @param immediate Trigger `func` on leading edge instead of trailing
 * @returns debounced function
 */
export default function debounce(
  func: (...args: (any | void)[]) => any | void,
  wait: number,
  immediate?: boolean,
): () => void {
  let timer: number;

  return function debounced(...args: any[]) {
    const later = () => {
      window.clearTimeout(timer);
      if (!immediate) func.apply(null, args);
    };

    if (immediate && !timer) {
      func.apply(null, args);
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(later, wait);
  };
}
