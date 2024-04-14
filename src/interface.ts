interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  subCategories: SubCategory[];
}
const log = console.log;
export {Category, SubCategory, log}

