interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  subCategories: SubCategory[];
}

interface HTMLPageResponse {
  html: string;
  pageCount: number;
}
export {Category, SubCategory, HTMLPageResponse}

