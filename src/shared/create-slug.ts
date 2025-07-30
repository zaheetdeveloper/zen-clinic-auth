export function createSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}



/**
 * Validates if the input is a valid slug.
 * Rules: lowercase letters, numbers, hyphens (no trailing or leading hyphen, no double hyphens)
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) {
    return true;
  }
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Validates if the input is a valid name.
 * Rules: Letters (both cases), numbers, and spaces only.
 */
export function isValidName(name: string): boolean {
  if (!name) {
    return true;
  }
  const nameRegex = /^[a-zA-Z0-9 ]+$/;
  return nameRegex.test(name);
}
