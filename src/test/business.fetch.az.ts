import { fetchBusinessesAZ } from '../business';
import { Category } from '../interface';
import { readFile } from '../utils';
export async function run() {
  try {
    const categories: {
      [letter: string]: [Category];
    } = JSON.parse(await readFile('./data/category/AZ.json'));
    await fetchBusinessesAZ(categories);
  } catch (error) {
    console.log(error);
  }
}
