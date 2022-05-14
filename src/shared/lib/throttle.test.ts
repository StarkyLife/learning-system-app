import { throttle } from "./throttle";

jest.useFakeTimers();

it("should call test fn with all args and return result", () => {
  const FN_ARGUMENTS = ["hello", 1];
  const FN_RESULT = "result";

  const TEST_FN = jest.fn().mockReturnValue(FN_RESULT);
  const INTERVAL = 100;

  const throttledFn = throttle(TEST_FN, INTERVAL);
  const result = throttledFn(...FN_ARGUMENTS);

  expect(TEST_FN).toHaveBeenCalledWith(...FN_ARGUMENTS);
  expect(result).toEqual(FN_RESULT);
});

it("should be called once if executed twice with less than 100 ms interval", () => {
  const TEST_FN = jest.fn();
  const INTERVAL = 100;

  const throttledFn = throttle(TEST_FN, INTERVAL);

  throttledFn();
  throttledFn();

  expect(TEST_FN).toHaveBeenCalledTimes(1);
});

it("should be called twice if executed twice with 100 ms interval", () => {
  const TEST_FN = jest.fn();
  const INTERVAL = 100;

  const throttledFn = throttle(TEST_FN, INTERVAL);

  throttledFn();
  jest.advanceTimersByTime(INTERVAL);
  throttledFn();

  expect(TEST_FN).toHaveBeenCalledTimes(2);
});
