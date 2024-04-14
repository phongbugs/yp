import { SubCategory, log } from './interface';

async function fetchHTMLSubCategory(url: string): Promise<string> {
  try {
    log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Re-throw the error to propagate it up the call stack
  }
}
