export const main = (): string => 'Hello World';
import { fetchCategoriesAZ } from '../category';
import { appendSubCategory } from '../subcategory';
import { fetchBusinessesAZ, getMailFromBusinessAZ } from '../business';
import {
  writeToFile,
  readFile,
  normalizeDistrictName,
  isValidEmail,
} from '../utils';
import { categoriesByLetter } from '../subcategories';
import { categoriesByLetterTpHCM } from '../subcategories.tphcm';
import { categoriesByLetterVN } from '../subcategories.vn';
import { Business, Category } from '../interface';
import { log } from 'console';
import * as fs from 'fs';
import { fetchBusinessesEmailAZ } from '../mail.copilot';

async function fetchAllCategories() {
  let categories = await fetchCategoriesAZ();
  categories = await appendSubCategory(categories);
  writeToFile('./category/AZ.json', JSON.stringify(categories));
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
  // Step 1: Fetch all categories
  //await fetchAllCategories();
  // Step 2: read categories from file
  let categories: {
    [letter: string]: { name: string; subCategories: Category[] };
  } = JSON.parse(await readFile('./data/category/AZ.json'));
  // test read business json
  try {
    let letter = 'G';
    let category: Category = {
      name: 'Gạch Bông, Gạch Hoa (Lát Nền, Trang Trí) (28)',
      href: '',
      subCategories: [],
    };
    let emailListLetter = [];
    let district = 'Quận 6';
    let mailFolder = `./data/mails/mails_${district}/${letter}`;
    let categories: { [letter: string]: Category[] } = {
      G: [
        {
          name: 'Gạch Bông, Gạch Hoa (Lát Nền, Trang Trí) (28)',
          subCategories: [],
          href: '',
        },
      ],
    };
    let businessesOfCategoryStr = (
      await readFile(
        './data/business/' + letter + '/' + category.name + '.json'
      )
    ).trim();
    //console.log(businessesOfCategoryStr);
    let businessesOfCategory: Business[] = JSON.parse(businessesOfCategoryStr);
    console.log(businessesOfCategory.length);
    console.log(businessesOfCategory.filter((business) => business.email));

    //   let emailListCategory = [
    //     ...new Set(
    //       businessesOfCategory
    //         .filter((business) =>
    //           normalizeDistrictName(business.address).includes(district)
    //         )
    //         .map((business) => business.email)
    //         .filter((email) => isValidEmail(email))
    //     ),
    //   ];
    //   for (let subCategory of category.subCategories) {
    //     let businessesOfSubCategories: Business[] = JSON.parse(
    //       JSON.stringify(
    //         await readFile(
    //           './data/business/' + letter + '/' + subCategory.name + '.json'
    //         )
    //       )
    //     );
    //     const subCategoryEmailList = [
    //       ...new Set(
    //         businessesOfSubCategories
    //           .filter((business) =>
    //             normalizeDistrictName(business.address).includes(district)
    //           )
    //           .map((business) => business.email)
    //           .filter((email) => isValidEmail(email))
    //       ),
    //     ];
    //     emailListCategory.push(...subCategoryEmailList);
    //   }
    //   emailListCategory = [...new Set(emailListCategory)];
    //   await writeToFile(
    //     mailFolder +
    //       '/' +
    //       category.name +
    //       '( ' +
    //       emailListCategory.length +
    //       ' ).txt',
    //     emailListCategory.join('\n')
    //   );
    //   emailListLetter.push(...emailListCategory);
  } catch (error) {
    console.log(error);
  }

  //console.log(await readFile('./data/business/' + letter + '/' + category.name + '.json'));
  // Step 3: Fetch all businesses
  //await fetchBusinessesAZ(categories);
  // Step 4: Get mail from businesses
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 1')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 2')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 3')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 4')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 5')
  //await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 6')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 7')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 8')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 9')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 10')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 11')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 12')

  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Tân Phú')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Tân Bình')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Phú Nhuận')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Bình Tân')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Bình Thạnh')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Bình Chánh')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Thủ Đức')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Gò Vấp')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Cần Giờ')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Hóc Môn')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Nhà Bè')
  // await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Củ Chi')

  // let businesses = await fetchJSONAllBussiness(
  //   'https://yellowpages.vn/cls/25960/ac-quy-nha-cung-cap-ac-quy.html'
  // );
  // writeToFile('./data/business.json', JSON.stringify(businesses, null, 2));

  //await fetchBusinessesAZ(categoriesByLetterVN);
  //await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận Gò Vấp');
  //await detectLiveEmailAZ(categoriesByLetterTpHCM);
  //await fetchBusinessesEmailAZ(categoriesByLetterTpHCM);

  // filter tphcm for duy 1st
  //let a = filterCategoriesByCity(categoriesByLetter, 'ở');
  //fs.writeFileSync('filteredCategories.json', JSON.stringify(a, null, 2));

  //console.log(categoriesByLetter);
})();
