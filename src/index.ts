export const main = (): string => 'Hello World';
import { fetchCategoriesAZ } from './category';
import { appendSubCategory } from './subcategory';
import { fetchJSONAllBussiness } from './business';
import { writeToFile } from './utils';

async function fetchAllCategories() {
  let categories = await fetchCategoriesAZ();
  categories = await appendSubCategory(categories);
  writeToFile('./all.json', JSON.stringify(categories));
}
(async () => {
  //await fetchAllCategories();
  let businesses = await fetchJSONAllBussiness(
    'https://yellowpages.vn/cls/25960/ac-quy-nha-cung-cap-ac-quy.html'
  );
  writeToFile('./data/business.json', JSON.stringify(businesses, null, 2));
})();
