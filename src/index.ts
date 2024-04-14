export const main = (): string => 'Hello World';
import { fetchCategoriesByLetter, convertCategoriesToJson } from './yp';

(async () => {
  await fetchCategoriesByLetter('A');
})();
