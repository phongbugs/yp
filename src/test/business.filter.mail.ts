import { getMailFromBusinessAZ } from '../business';
import { Category } from '../interface';
import { readFile } from '../utils';
export async function run() {
  try {
    const categories: {
      [letter: string]: [Category];
    } = JSON.parse(await readFile('./data/category/AZ.json'));
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Gò Vấp');
  } catch (error) {
    console.log(error);
  }
}
