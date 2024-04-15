const ypHost: string = 'https://yellowpages.vn';

import fetch from 'node-fetch';
import { load } from 'cheerio';
import './extensions'
import {Category, HTMLPageResponse} from './interface';
import { log } from 'console';
async function fetchHTMLCategoriesByLetter(
  letter: string,
  pageIndex: number
): Promise<HTMLPageResponse> {
  try {
    const url: string = `${ypHost}/cate/${letter}?page=${pageIndex}`;
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
    throw error; // Re-throw the error to propagate it up the call stack
  }
}

async function fetchJSONCategoriesByLetter(
  letter: string
): Promise<Category[]> {
  let { html, pageCount } = await fetchHTMLCategoriesByLetter(letter, 1);
  let categories = parseHTMLCategories(html);
  if (pageCount > 1) log('%s:%s', letter, pageCount);
  for (let pageIndex = 2; pageIndex <= pageCount; pageIndex++) {
    var nextHtml = (await fetchHTMLCategoriesByLetter(letter, pageIndex)).html;
    var nexCategories = parseHTMLCategories(nextHtml);
    categories.push(...nexCategories);
  }
  return categories;
}

function parseHTMLCategories(html: string): Category[] {
  const $ = load(html);
  const categories: Category[] = [];
  $('.p-0.m-0.pb-3.ps-2.fw-semibold.text-capitalize').each((index, element) => {
    const category: Category = {
      name: $(element).find('a').text().trim().clean(),
      href: $(element).find('a').attr('href'),
      subCategories: [],
    };
    categories.push(category);
  });
  return categories;
}
async function fetchCategoriesAZ(): Promise<{ [letter: string]: any[] }> {
  const categoriesByLetter: { [letter: string]: any[] } = {};

  // Loop through letters from A to Z
  for (
    let letter = 'A';
    letter <= 'A';
    letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    try {
      categoriesByLetter[letter] = await fetchJSONCategoriesByLetter(letter);
    } catch (error) {
      console.error(`Error fetching categories for letter ${letter}:`, error);
    }
  }
  return categoriesByLetter;
}

export { fetchCategoriesAZ };
