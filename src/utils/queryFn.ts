// Default
export function queryFn(
  root: Element,
  selector: string,
  options: { all: true }
): NodeListOf<HTMLElement> | null;

// All
export function queryFn(
  root: Element,
  selector: string,
  options?: { all?: false }
): HTMLElement | null;

// Closest
export function queryFn(
  root: Element,
  selector: string,
  options: { all?: false, closest: true }
): HTMLElement | null;


export function queryFn(
  root: Element,
  selector: string,
  { 
    all = false,
    closest = false
  }: { 
    all?: boolean;
    closest?: boolean;
  } = {}
) {
  // All
  if (all) {
    const result = root.querySelectorAll(selector);

    if (result.length === 0) {
      console.warn(`No elements found matching "${selector}".`);
      return null;
    }

    return result;
  }

  // Closest
  if (closest) {
    const result = root.closest(selector);

    if (!result) {
      console.warn(`No element found matching "${selector}".`);
      return null;
    }

    return result;
  }

  // Default
  const result = root.querySelector(selector);

  if (!result) {
    console.warn(`No element found matching "${selector}".`);
    return null;
  }

  return result;
}