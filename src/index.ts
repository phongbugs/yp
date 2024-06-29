import { exit } from 'process';

export const main = (): string => 'Hello World';
(async () => {
  try {
    //await (await import('./test/business.fetch.link')).run();
    //await (await import('./test/business.fetch.az')).run();
    await (await import('./test/business.filter.mail')).run();
    //await (await import('./test/createfolders'));
    exit(0);
  } catch (error) {
    console.error('Error loading business module:', error);
  }
})();
