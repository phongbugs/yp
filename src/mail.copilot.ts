import { load } from 'cheerio';
import './extensions';
import { Business, Category } from './interface'; // Assuming Business interface has an email field
import { log } from 'console';
import './utils';
import { fetchHTMLBusiness } from './business';
import { createFolder, writeToFile } from './utils';

function parseHTMLBusiness(html: string): Pick<Business, 'email'>[] {
  const $ = load(html);
  const emails: Pick<Business, 'email'>[] = [];
  $('.yp_noidunglistings').each((index, element) => {
    try {
      let e = $(element);
      let email = e
        .find('.fa.fa-regular.fa-envelope.pe-1')
        .next()
        .text()
        ?.clean();
      if (email) {
        emails.push({ email });
      }
    } catch (err) {
      log(err);
    }
  });
  return emails;
}

async function fetchJSONAllBusinessEmail(
  url: string
): Promise<Pick<Business, 'email'>[]> {
  let { html, pageCount } = await fetchHTMLBusiness(url, 1);
  let emails = parseHTMLBusiness(html);
  if (pageCount > 1) log('%s', pageCount);
  for (let pageIndex = 2; pageIndex <= pageCount; pageIndex++) {
    var nextHtml = (await fetchHTMLBusiness(url, pageIndex)).html;
    var nextEmails = parseHTMLBusiness(nextHtml);
    emails.push(...nextEmails);
  }
  return emails;
}

async function fetchBusinessesEmailAZ(categories: {
  [letter: string]: Category[];
}): Promise<void> {
  for (
    let letter = 'A';
    letter <= 'Z';
    letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    try {
      let categoryArray = categories[letter];
      createFolder('./data/business/' + letter);
      for (let category of categoryArray) {
        try {
          let businessesOfCategory = await fetchJSONAllBusinessEmail(category.href);
          writeToFile(
            './data/business/' + letter + '/' + category.name + '.json',
            JSON.stringify(businessesOfCategory, null, 2)
          );
          for (let subCategory of category.subCategories) {
            let businessesOfSubCategories = await fetchJSONAllBusinessEmail(
              subCategory.href
            );
            writeToFile(
              './data/business/' + letter + '/' + subCategory.name + '.json',
              JSON.stringify(businessesOfSubCategories, null, 2)
            );
          }
        } catch (error) {
          console.error('Error processing category:', error);
        }
      }
    } catch (error) {
      console.error(`Error fetching categories for letter ${letter}:`, error);
    }
  }
}

export { fetchBusinessesEmailAZ };
