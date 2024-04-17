import { load } from 'cheerio';
import './extensions';
import { Business, HTMLPageResponse } from './interface';
import { log } from 'console';
import './utils'
async function fetchHTMLBusiness(
  url: string,
  pageIndex: number
): Promise<HTMLPageResponse> {
  try {
    url += '?page=' + pageIndex;
    log(url)
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
    let isVerify = ($(element).find('span.duocxacthuc').text().indexOf('Được xác minh') > -1)
    let strDateModified = ''
    if (!isVerify) {
      strDateModified = $(element).find('.m-0.pb-0.pt-1.hienthi_pc').text().clean()
      strDateModified = strDateModified.split(": ")[1]
    } else {
      if($(element).find('span.duocxacthuc').length > 0)
        strDateModified = $(element).find('span.duocxacthuc').next().text()
      else 
        strDateModified = $(element).find('.m-0.pb-0.pt-1.hienthi_pc').text().clean()
    }

    const business: Business = {
      name: $(element).find('.fs-5.pb-0.text-capitalize').text().trim().clean(),
      isSponsor: ($(element).find('.star_text.pe-3').length > 0 && $(element).find('.star_text.pe-3').html().indexOf('NHÀ TÀI TRỢ') > -1),
      isVerify: isVerify,
      diamondCount: 5,
      category: 'string',
      datemodified: strDateModified,
      address: $(element).find('.fa-location-arrow').next().text(),
      city: $(element).find('.fa-location-arrow').next().find('span.fw-semibold').text(),
      phone: $(element).find('.fa.fa-solid.fa-phone.text-black-50.pe-1').next().text()?.clean(),
      email: $(element).find('.fa.fa-regular.fa-envelope.pe-1').next().text()?.clean(),
      website: $(element).find('.fa.fa-solid.fa-globe.text-black-50.pe-1').next().text()?.clean(),
      intro: $(element).find('.mt-3.rounded-4.pb-2.h-auto.text_quangcao').html()?.clean(),
    };
    businesses.push(business);
  });
  log(businesses);
  return businesses;
}

async function fetchJSONAllBussiness(url: string): Promise<Business[]> {
  let { html, pageCount } = await fetchHTMLBusiness(url, 1);
  let businesses = parseHTMLBusiness(html);
  if (pageCount > 1) 
    log('%s', pageCount);
  for (let pageIndex = 2; pageIndex <= pageCount; pageIndex++) {
    var nextHtml = (await fetchHTMLBusiness(url, pageIndex)).html;
    var nextBusinesses = parseHTMLBusiness(nextHtml);
    businesses.push(...nextBusinesses);
  }
  return businesses;
}

export { fetchJSONAllBussiness };
