export class Cases {
  #normalized: string[];

  constructor(input: string) {
    this.#normalized = normalizeCase(input);
  }

  static toCamelCase(input: string) {
    return new Cases(input).toCamelCase();
  }

  static toPascalCase(input: string) {
    return new Cases(input).toPascalCase();
  }

  static toKebabCase(input: string) {
    return new Cases(input).toKebabCase();
  }

  static toSnakeCase(input: string) {
    return new Cases(input).toSnakeCase();
  }

  static toTitleCase(input: string) {
    return new Cases(input).toTitleCase();
  }

  toCamelCase() {
    return this.#normalized
      .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join('');
  }

  toPascalCase() {
    return this.#normalized.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }

  toKebabCase() {
    return this.#normalized.join('-');
  }

  toSnakeCase() {
    return this.#normalized.join('_');
  }

  toTitleCase() {
    return this.#normalized
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export let normalizeCase = (input: string) => {
  return (
    input
      // Replace underscores and hyphens with spaces for easy splitting
      .replace(/[_-]/g, ' ')
      // Insert spaces between lowercase-to-uppercase transitions (camelCase & PascalCase)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Insert spaces between number-letter transitions
      .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
      .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
      // Split by spaces and normalize to lowercase
      .split(/\s+/)
      .map(word => word.trim().toLowerCase())
      .filter(Boolean) // Remove empty strings
  );
};
