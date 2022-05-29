export function throttle<Fn extends (...args: any[]) => any>(
  executedFn: Fn,
  interval: number
) {
  let isThrottlingActive = false;
  let result: ReturnType<Fn>;

  return (...args: Parameters<Fn>) => {
    if (isThrottlingActive) return result;

    result = executedFn(...args);

    isThrottlingActive = true;
    setTimeout(() => {
      isThrottlingActive = false;
    }, interval);

    return result;
  };
}
