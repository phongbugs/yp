export const main = (): string => 'Hello World';
import { fetchCategoriesAZ } from './category';
import { appendSubCategory } from './subcategory';
import { detectLiveEmailAZ, fetchBusinessesAZ } from './business';
import { writeToFile } from './utils';
import { categoriesByLetter } from './subcategories';
import { categoriesByLetterTpHCM } from './subcategories.tphcm';
import { categoriesByLetterVN } from './subcategories.vn';
import { Category } from './interface';
import { log } from 'console';
import * as fs from 'fs';
import { fetchBusinessesEmailAZ } from './mail.copilot';

async function fetchAllCategories() {
  let categories = await fetchCategoriesAZ();
  categories = await appendSubCategory(categories);
  writeToFile('./all.json', JSON.stringify(categories));
}

function filterCategoriesByCity(
  categories: { [letter: string]: Category[] },
  city: string
): { [letter: string]: Category[] } {
  const filteredCategories: { [letter: string]: Category[] } = {};

  for (const letter in categories) {
    if (categories.hasOwnProperty(letter)) {
      const filtered = categories[letter]
        .map((category) => {
          const filteredSubCategories = category.subCategories.filter(
            (subCategory) => !subCategory.name.includes(city)
          );

          return {
            ...category,
            subCategories: filteredSubCategories,
          };
        })
        .filter((category) => category.subCategories.length > 0);

      if (filtered.length > 0) {
        filteredCategories[letter] = filtered;
      }
    }
  }

  return filteredCategories;
}
(async () => {
  //await fetchAllCategories();
  // let businesses = await fetchJSONAllBussiness(
  //   'https://yellowpages.vn/cls/25960/ac-quy-nha-cung-cap-ac-quy.html'
  // );
  // writeToFile('./data/business.json', JSON.stringify(businesses, null, 2));

  await fetchBusinessesAZ(categoriesByLetterVN);
  //await detectLiveEmailAZ(categoriesByLetterTpHCM);
  //await fetchBusinessesEmailAZ(categoriesByLetterTpHCM);

  // filter tphcm for duy 1st
  //let a = filterCategoriesByCity(categoriesByLetter, 'ở');
  //fs.writeFileSync('filteredCategories.json', JSON.stringify(a, null, 2));

  //console.log(categoriesByLetter);
})();
