interface SubCategory {
  name: string;
  href: string;
}
interface Category {
  name: string;
  href: string;
  subCategories: SubCategory[];
}

interface Business {
  name: string,
  isSponsor: boolean,
  isVerify: boolean,
  diamondCount: number
  category: string,
  dateModified: string,
  address: string,
  phone: string,
  email: string,
  website: string,
  intro: string,
  city: string
}
interface HTMLPageResponse {
  html: string;
  pageCount: number;
}
export {Category, SubCategory, HTMLPageResponse, Business}

