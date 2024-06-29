import { getMailFromBusinessAZ } from '../business';
import { Category } from '../interface';
import { readFile } from '../utils';
export async function run() {
  try {
    const categories: {
      [letter: string]: [Category];
    } = JSON.parse(await readFile('./data/category/AZ.json'));
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 1');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 2');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 3');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 4');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 5');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 6');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 7');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 8');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 9');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 10');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 11');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Quận 12');

    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Tân Phú');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Tân Bình');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Phú Nhuận');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Bình Tân');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Bình Thạnh');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Bình Chánh');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Thủ Đức');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Gò Vấp');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Cần Giờ');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Hóc Môn');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Nhà Bè');
    await getMailFromBusinessAZ(categories, 'Hồ Chí Minh', 'Củ Chi');
  } catch (error) {
    console.log(error);
  }
}
