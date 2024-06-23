import { load } from 'cheerio';
import './extensions';
import { Business, Category, HTMLPageResponse } from './interface';
import { log } from 'console';
import './utils';
import { createFolder, readFile, writeToFile } from './utils';
async function fetchHTMLBusiness(
  url: string,
  pageIndex: number
): Promise<HTMLPageResponse> {
  try {
    url += '?page=' + pageIndex;
    log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = load(html);
    const pageCount =
      pageIndex == 1
        ? +$('#paging a')
            .eq($('#paging a').length - 2)
            .text()
        : 0;
    return { html, pageCount };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

function parseHTMLBusiness(html: string): Business[] {
  const $ = load(html);
  const businesses: Business[] = [];
  $('.yp_noidunglistings').each((index, element) => {
    try {
      let e = $(element);
      let isVerify =
        e.find('span.duocxacthuc')?.text()?.indexOf('Được xác minh') > -1;
      let strDateModified = '';
      if (!isVerify) {
        strDateModified = e.find('.m-0.pb-0.pt-1.hienthi_pc')?.text()?.clean();
        if (strDateModified && strDateModified !== '') {
          strDateModified = strDateModified.replace(
            'Ngày cập nhật gần nhất: ',
            ''
          );
        }
        // isVerify and exist datemodified
      } else {
        if (e.find('span.duocxacthuc').length > 0)
          strDateModified = e
            .find('span.duocxacthuc')
            .find('.text-black-50')
            .html()
            ?.split(': ')[1]
            .slice(0, -1);
        else strDateModified = 'Đã Xác Minh & Nhà Tài Trợ';
      }
      log('strDateModified: %s', strDateModified);

      const business: Business = {
        name: e.find('.fs-5.pb-0.text-capitalize').text().trim().clean(),
        isSponsor:
          e.find('.star_text.pe-3').length > 0 &&
          e.find('.star_text.pe-3').html().indexOf('NHÀ TÀI TRỢ') > -1,
        isVerify: isVerify,
        diamondCount: +e.find('img.pe-3')?.attr('title')?.match(/\d+/),
        category: e.find('.yp_nganh_text').html(),
        dateModified: strDateModified
          ? strDateModified
          : 'Đã Xác Minh & Nhà Tài Trợ',
        address: e.find('.fa-location-arrow').next().text(),
        city: e
          .find('.fa-location-arrow')
          .next()
          .find('span.fw-semibold')
          .text(),
        phone: e
          .find('.fa.fa-solid.fa-phone.text-black-50.pe-1')
          .next()
          .text()
          ?.clean(),
        email: e.find('.fa.fa-regular.fa-envelope.pe-1').next().text()?.clean(),
        website: e
          .find('.fa.fa-solid.fa-globe.text-black-50.pe-1')
          .next()
          .text()
          ?.clean(),
        intro: e
          .find('.mt-3.rounded-4.pb-2.h-auto.text_quangcao')
          .html()
          ?.clean(),
      };
      businesses.push(business);
    } catch (err) {
      log(err);
      businesses.push();
    }
  });
  return businesses;
}

async function fetchJSONAllBusiness(url: string): Promise<Business[]> {
  let { html, pageCount } = await fetchHTMLBusiness(url, 1);
  let businesses = parseHTMLBusiness(html);
  if (pageCount > 1) log('%s', pageCount);
  for (let pageIndex = 2; pageIndex <= pageCount; pageIndex++) {
    var nextHtml = (await fetchHTMLBusiness(url, pageIndex)).html;
    var nextBusinesses = parseHTMLBusiness(nextHtml);
    businesses.push(...nextBusinesses);
  }
  return businesses;
}
async function fetchBusinessesAZ(categories :{ [letter: string]: Category[] }): Promise<void> {
  for (
    let letter = 'A';
    letter <= 'Z';
    letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    try {
     let categoryArray = categories[letter];
     createFolder('./data/business/' + letter)
     //createFolder('./data/mails/' + letter)
     for (let category of categoryArray) {
       try {
        let businessesOfCategory = await fetchJSONAllBusiness(category.href);
        writeToFile('./data/business/' + letter + '/' + category.name + '.json', JSON.stringify(businessesOfCategory, null, 2));
        for(let subCategory of category.subCategories){
          let businessesOfSubCategories = await fetchJSONAllBusiness(subCategory.href);
          writeToFile('./data/business/' + letter + '/' + subCategory.name + '.json', JSON.stringify(businessesOfSubCategories, null, 2));
            // const emailList = businessesOfSubCategories
            //   .map((business) => business.email)
            //   .filter((email) => isValidEmail(email))
            //   .join('\n');

            // function isValidEmail(email: string): boolean {
            //   // Use a regular expression to validate the email format
            //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            //   return emailRegex.test(email) && !email.startsWith("...");
            // }

            // writeToFile('./data/mails/' + letter + '/' + subCategory.name + '.txt', emailList);
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
function isValidEmail(email: string): boolean {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !email.startsWith("...");
}
async function getMailFromBusinessAZ(categories: { [letter: string]: Category[] }, city: string, district: string): Promise<void> {
  for (
    let letter = 'A';
    letter <= 'Z';
    letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    let emailListLetter = []; 
    try {
      let categoryArray = categories[letter];
      let mailFolder = `./data/mails_${district}/${letter}`
      createFolder(mailFolder)
      for (let category of categoryArray) {
        try {
          let businessesOfCategory: Business[] = JSON.parse(await readFile('./data/business/' + letter + '/' + category.name + '.json'));
          let emailListCategory = [...new Set(businessesOfCategory
            .filter((business) => business.address.includes(district))
            .map((business) => business.email)
            .filter((email) => isValidEmail(email)))];
          for (let subCategory of category.subCategories) {
            let businessesOfSubCategories : Business[] = JSON.parse(await readFile('./data/business/' + letter + '/' + subCategory.name + '.json'));
            const subCategoryEmailList = [...new Set(businessesOfSubCategories
              .filter((business) => business.address.includes(district))
              .map((business) => business.email)
              .filter((email) => isValidEmail(email)))];
            emailListCategory.push(...subCategoryEmailList);
          }
          emailListCategory = [...new Set(emailListCategory)];
          writeToFile(mailFolder +'/' + category.name + '.txt', emailListCategory.join('\n'));
          emailListLetter.push(...emailListCategory);
        } catch (error) {
          console.error('Error processing category:', error);
        }
      }
      writeToFile(mailFolder +'/' + letter + '.txt', emailListLetter.join('\n'));
    } catch (error) {
      console.error(`Error fetching categories for letter ${letter}:`, error);
    }
  }
}

async function getMailFromBusinessAZ2(categories :{ [letter: string]: Category[] }, city: string, district: string): Promise<void> {
  for (
    let letter = 'A';
    letter <= 'B';
    letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    try {
     let categoryArray = categories[letter];
     for (let category of categoryArray) {
       try {
        for(let subCategory of category.subCategories){
            const emailList = await readFile('./data/mails/' + letter + '/' + subCategory.name + '.txt');
            const uniqueEmails = [...new Set(emailList.split('\n'))];
            const duplicateEmails = emailList.split('\n').filter((email, index, arr) => arr.indexOf(email) !== index);
            log('Unique Emails:');
            log(uniqueEmails);
            log('Duplicate Emails:');
            log(duplicateEmails);
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
export { fetchJSONAllBusiness , fetchBusinessesAZ, fetchHTMLBusiness, getMailFromBusinessAZ};
