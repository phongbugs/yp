/* eslint-disable max-len */
import { load } from 'cheerio';
import './extensions';
import { Business, Category, HTMLPageResponse } from './interface';
import { log } from 'console';
import './utils';
import * as fs from 'fs';
import { createFolder, isValidEmail, normalizeDistrictName, readFile, writeToFile } from './utils';
async function fetchHTMLBusiness(url: string, pageIndex: number): Promise<HTMLPageResponse> {
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
      const e = $(element);
      const isVerify = e.find('span.duocxacthuc')?.text()?.indexOf('Được xác minh') > -1;
      let strDateModified = '';
      if (!isVerify) {
        strDateModified = e.find('.m-0.pb-0.pt-1.hienthi_pc')?.text()?.clean();
        if (strDateModified && strDateModified !== '') {
          strDateModified = strDateModified.replace('Ngày cập nhật gần nhất: ', '');
        }
        // isVerify and exist datemodified
      } else {
        if (e.find('span.duocxacthuc').length > 0)
          strDateModified = e.find('span.duocxacthuc').find('.text-black-50').html()?.split(': ')[1].slice(0, -1);
        else strDateModified = 'Đã Xác Minh & Nhà Tài Trợ';
      }
      //log('strDateModified: %s', strDateModified);

      const business: Business = {
        name: e.find('.fs-5.pb-0.text-capitalize').text().trim().clean(),
        isSponsor: e.find('.star_text.pe-3').length > 0 && e.find('.star_text.pe-3').html().indexOf('NHÀ TÀI TRỢ') > -1,
        isVerify: isVerify,
        diamondCount: +e.find('img.pe-3')?.attr('title')?.match(/\d+/),
        category: e.find('.yp_nganh_text').html(),
        dateModified: strDateModified ? strDateModified : 'Đã Xác Minh & Nhà Tài Trợ',
        address: e.find('.fa-location-arrow').next().text(),
        city: e.find('.fa-location-arrow').next().find('span.fw-semibold').text(),
        phone: e.find('.fa.fa-solid.fa-phone.text-black-50.pe-1').next().text()?.clean(),
        email: e.find('.fa.fa-regular.fa-envelope.pe-1').next().text()?.clean(),
        website: e.find('.fa.fa-solid.fa-globe.text-black-50.pe-1').next().text()?.clean(),
        intro: e.find('.mt-3.rounded-4.pb-2.h-auto.text_quangcao').html()?.clean()
      };
      businesses.push(business);
    } catch (err) {
      log(err);
      //businesses.push();
    }
  });
  return businesses;
}

async function fetchJSONAllBusiness(url: string): Promise<Business[]> {
  const { html, pageCount } = await fetchHTMLBusiness(url, 1);
  const businesses = parseHTMLBusiness(html);
  if (pageCount > 1) log('%s', pageCount);
  for (let pageIndex = 2; pageIndex <= pageCount; pageIndex++) {
    const nextHtml = (await fetchHTMLBusiness(url, pageIndex)).html;
    const nextBusinesses = parseHTMLBusiness(nextHtml);
    businesses.push(...nextBusinesses);
  }
  return businesses;
}
async function fetchBusinessesAZ(categories: { [letter: string]: Category[] }): Promise<void> {
  for (let letter = 'A'; letter <= 'Z'; letter = String.fromCharCode(letter.charCodeAt(0) + 1)) {
    try {
      const categoryArray = categories[letter];
      createFolder('./data/business/' + letter);
      for (const category of categoryArray) {
        try {
          //if(category.href.indexOf('https://yellowpages.vn/cls/492109/gach-bong-gach-hoa--lat-nen-trang-tri-.html') === -1) continue;
          let fileName = './data/business/' + letter + '/' + category.name + '.json';
          if (!fs.existsSync(fileName)) {
            console.log('[%s] Category.name', letter, category.name);
            const businessesOfCategory = await fetchJSONAllBusiness(category.href);
            await writeToFile(fileName,
              JSON.stringify(businessesOfCategory, null, 2)
            );
          }
          for (const subCategory of category.subCategories) {
            fileName = './data/business/' + letter + '/' + subCategory.name + '.json';
            if (!fs.existsSync(fileName)) {
              console.log('[%s] subCategory.name', letter, subCategory.name);
              const businessesOfSubCategories = await fetchJSONAllBusiness(subCategory.href);
              await writeToFile(fileName,
                JSON.stringify(businessesOfSubCategories, null, 2)
              );
            }
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
async function getMailFromBusinessAZ(
  categories: { [letter: string]: Category[] },
  city: string,
  district: string
): Promise<void> {
  for (let letter = 'A'; letter <= 'Z'; letter = String.fromCharCode(letter.charCodeAt(0) + 1)) {
    const emailListLetter = [];
    try {
      district = normalizeDistrictName(district);
      const categoryArray = categories[letter];
      const mailFolder = `./data/mails/mails_${district}/${letter}`;
      createFolder(mailFolder);
      for (const category of categoryArray) {
        try {
          const businessesOfCategory: Business[] = JSON.parse(
            await readFile('./data/business/' + letter + '/' + category.name + '.json')
          );
          let emailListCategory = [
            ...new Set(
              businessesOfCategory
                .filter((business) => normalizeDistrictName(business.address).includes(district))
                .map((business) => business.email)
                .filter((email) => isValidEmail(email))
            )
          ];
          for (const subCategory of category.subCategories) {
            const businessesOfSubCategories: Business[] = JSON.parse(
              await readFile('./data/business/' + letter + '/' + subCategory.name + '.json')
            );
            const subCategoryEmailList = [
              ...new Set(
                businessesOfSubCategories
                  .filter((business) => normalizeDistrictName(business.address).includes(district))
                  .map((business) => business.email)
                  .filter((email) => isValidEmail(email))
              )
            ];
            emailListCategory.push(...subCategoryEmailList);
          }
          emailListCategory = [...new Set(emailListCategory)];
          await writeToFile(
            mailFolder + '/' + category.name + '(' + emailListCategory.length + ').txt',
            emailListCategory.join('\n')
          );
          emailListLetter.push(...emailListCategory);
        } catch (error) {
          console.error('Error processing category:', error);
        }
      }
      await writeToFile(mailFolder + '/' + letter + '(' + emailListLetter.length + ').txt', emailListLetter.join('\n'));
    } catch (error) {
      console.error(`Error fetching categories for letter ${letter}:`, error);
    }
  }
}

export { fetchJSONAllBusiness, fetchBusinessesAZ, fetchHTMLBusiness, getMailFromBusinessAZ };
