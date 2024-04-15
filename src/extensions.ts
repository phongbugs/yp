// globalExtensions.ts

declare global {
  interface String {
    clean(): string;
    containsExtensions(...extensions: string[]): boolean;
  }

  interface Number {
    isEven(): boolean;
    isOdd(): boolean;
  }

  // Add more global extensions for other types here
}

String.prototype.clean = function (): string {
  return this.replace(/\t/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

String.prototype.containsExtensions = function (
  ...extensions: string[]
): boolean {
  const cleanString = this.clean();
  const lowerCaseString = cleanString.toLowerCase();
  return extensions.some((ext) => lowerCaseString.endsWith(ext.toLowerCase()));
};

Number.prototype.isEven = function (): boolean {
  return this % 2 === 0;
};

Number.prototype.isOdd = function (): boolean {
  return !this.isEven();
};

// Add more global extensions for other types here
export {};
