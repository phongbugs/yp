import fetch from 'node-fetch';
import { load, CheerioAPI } from 'cheerio';

const ypHost: string = 'https://yellowpages.vn';

interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  subCategories: SubCategory[];
}

async function fetchCategoriesByLetter(letter: string, pageIndex: number = 1): Promise<string> {
    try {
        const url: string = `${ypHost}/${letter}?page=${pageIndex}`;
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

function convertCategoriesToJson(htmlCategories: string): Category[] {
  const $ = load(htmlCategories);
  // Your logic to parse HTML and convert it to JSON goes here
  return [];
}

export { fetchCategoriesByLetter, convertCategoriesToJson };
