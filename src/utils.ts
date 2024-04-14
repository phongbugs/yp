declare global {
  interface String {
    clean(): string;
  }
}

String.prototype.clean = function (): string {
  return this.replace(/\t/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};
export {};
