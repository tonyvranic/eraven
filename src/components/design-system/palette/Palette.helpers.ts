export function isStepValid(
  stepValue: number,
): boolean {
  const isValidStep: boolean = stepValue > 0 && 1000 % stepValue === 0;
  return isValidStep;
}

export function getStepCount(
  stepValue: number,
  validStep: boolean,
): number {
  if (!validStep) return 0;

  const stepCount: number = 1000 / stepValue;
  return stepCount;
}

export function createSteps(
  stepValue: number,
  stepCount: number,
  validStep: boolean,
): number[] {
  if (!validStep) return [];

  const stepValues: number[] = Array.from(
    { length: stepCount },
    (_, index: number): number => (index + 1) * stepValue,
  );

  stepValues.unshift(0);
  return stepValues;
}