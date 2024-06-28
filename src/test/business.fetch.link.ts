import { fetchJSONAllBusiness } from '../business';

export async function run() {
  try {
    await fetchJSONAllBusiness('https://yellowpages.vn/cls/492109/gach-bong-gach-hoa--lat-nen-trang-tri-.html');
  } catch (error) {
    console.error('Error fetching business data:', error);
  }
}
