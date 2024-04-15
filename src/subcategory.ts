import { Category, SubCategory } from './interface';
import { load } from 'cheerio';
import './utils';
import './extensions';
import { log } from 'console';
import { writeToFile } from './utils';
async function fetchHTMLSubCategory(url: string): Promise<string> {
  try {
    log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Re-throw the error to propagate it up the call stack
  }
}

async function fetchJSONSubCategories(url: string): Promise<SubCategory[]> {
  let html = await fetchHTMLSubCategory(url);
  let subCategories = parseHTMLSubCategories(html);
  return subCategories;
}

function parseHTMLSubCategories(html: string): SubCategory[] {
  const $ = load(html);
  const subCategories: SubCategory[] = [];
  const elements = $('.m-0.pt-4')
    .filter(function () {
      const classAttributeValue = $(this).attr('class');
      return classAttributeValue && classAttributeValue.split(' ').length === 2;
    })
    .slice(1)
    .remove();

  elements.each((index, element) => {
    const category: SubCategory = {
      name: $(element).find('a').text().trim().clean(),
      href: $(element).find('a').attr('href'),
    };
    if (category.name && category.href) subCategories.push(category);
  });
  return subCategories;
}

async function appendSubCategory(categoriesByLetter: {
  [letter: string]: Category[];
}): Promise<{ [letter: string]: any[] }> {
  for (let letter in categoriesByLetter) {
    // Access each array corresponding to the current letter
    let categoryArray = categoriesByLetter[letter];

    // Iterate over each object in the array
    let subCategories: SubCategory[] = [];
    let subCategoryIndex = 0;
    for (let category of categoryArray) {
      try {
        let html = await fetchHTMLSubCategory(category.href);
        writeToFile(category.href.split('/').pop(), html);
        subCategories = parseHTMLSubCategories(html);
        categoriesByLetter[letter][subCategoryIndex].subCategories =
          subCategories;
        subCategoryIndex++;
        //log(categoriesByLetter[letter][subCategoryIndex].subCategories)
      } catch (error) {
        // Handle any errors that might occur
        console.error('Error processing category:', error);
      }
    }
    writeToFile('./data/category/' + letter + '.json', JSON.stringify(categoriesByLetter[letter], null, 2));
  }
  // Return the modified categoriesByLetter object
  return categoriesByLetter;
}

export { appendSubCategory };
