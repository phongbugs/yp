import { fetchJSONAllBusiness } from '../business';
import { Category } from '../interface';
import { writeToFile } from '../utils';

export async function run() {
  try {
    const letter = 'G';
    const category : Category = {
      name: 'Gạch bông, gạch hoa, lát nền trang trí',
      href: 'https://yellowpages.vn/cls/492109/gach-bong-gach-hoa--lat-nen-trang-tri-.html',
      subCategories: []
    };
    const businessesOfCategory = await fetchJSONAllBusiness(category.href);
    await writeToFile(
      './data/business/' + letter + '/' + category.name + '.json',
      JSON.stringify(businessesOfCategory, null, 2)
    );
  } catch (error) {
    console.error('Error fetching business data:', error);
  }
}
