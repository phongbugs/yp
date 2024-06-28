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
  name: string | null;
  isSponsor: boolean | null;
  isVerify: boolean | null;
  diamondCount: number | null;
  category: string | null;
  dateModified: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  intro: string | null;
  city: string | null;
}
interface HTMLPageResponse {
  html: string;
  pageCount: number;
}
export { Category, SubCategory, HTMLPageResponse, Business };
