import fetch from 'node-fetch';
import { load } from 'cheerio';
import './extensions';
import { Business, HTMLPageResponse } from './interface';
import { log } from 'console';
async function fetchHTMLBusiness(
  url: string,
  pageIndex: number
): Promise<HTMLPageResponse> {
  try {
    url += '?page=' + pageIndex;
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
    const business: Business = {
      name: $(element).find('.fs-5.pb-0.text-capitalize').text().trim().clean(),
      isSponsor:
        $(element).find('.star_text.pe-3').html().indexOf('NHÀ TÀI TRỢ') > -1,
      isVerify:
        $(element).find('span.duocxacthuc').text().indexOf('Được xác minh') >
        -1,
      diamondCount: 5,
      category: 'string',
      datemodified: 'string',
      address: $(element).find('.fa-location-arrow').next().text(),
      city:  $(element).find('.fa-location-arrow').next().find('span.fw-semibold').text(),
      phone: 'string',
      email: 'string',
      website: 'string',
      intro: 'string',
    };
    businesses.push(business);
  });
  return businesses;
}

async function fetchJSONAllBussiness(url: string): Promise<Business[]> {
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

export { fetchJSONAllBussiness };
