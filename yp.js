const ypHost = 'https://yellowpages.vn'
const cheerio = require('cheerio');
async function fetchCategoriesByLetter(letter, pageIndex = 1){
    let url = ypHost + `/${letter}?page=${pageIndex}`
    const response = await fetch(url);
    const text = await response.text();
    console.log(text);
}
/**
 * 
 * @param {*} htmlCategories 
 * {
 *  name: string
 *  href: string
 *  subCategories: {
 *      name: string
 *      href: string
 * }
 * }
 */
function convertCategoriesToJson(htmlCategories){
    const $ = cheerio.load(htmlCategories);

}

(async() => {
    await fetchCategoriesByLetter('A')
})();
