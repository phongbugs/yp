export const main = (): string => 'Hello World';
import { fetchCategoriesAZ } from './category';
import { appendSubCategory } from './subcategory';
import { writeToFile } from './utils';
(async () => {
  //let html = await fetchCategoriesByLetter('A');
  //writeToFile('aa.html', html)
  //let categories = parseHTMLCategoriesByLetter(html)
  //console.log(categories);
  let categories = await fetchCategoriesAZ();
  categories = await appendSubCategory(categories);
  writeToFile('./categories3.json', JSON.stringify(categories));
})();
