import fetch from 'node-fetch';
import cheerio from 'cheerio';

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

async function fetchCategoriesByLetter(letter: string, pageIndex: number = 1): Promise<void> {
    let url: string = `${ypHost}/${letter}?page=${pageIndex}`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        console.log(html);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function convertCategoriesToJson(htmlCategories: string): Category[] {
    const $ = cheerio.load(htmlCategories);
    // Your logic to parse HTML and convert it to JSON goes here
    return [];
}

(async () => {
    await fetchCategoriesByLetter('A');
})();
