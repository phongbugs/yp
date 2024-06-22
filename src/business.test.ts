import { expect } from 'chai';
import { detectLiveEmailAZ } from '../src/business';

describe('detectLiveEmailAZ', function() {
  it('should not have duplicate emails in the email list', async function() {
    // Mock the categories object
    const categories = {
      A: [
        {
          name: 'Category A',
          subCategories: [
            { name: 'Subcategory A1', href: 'subcategory-a1' },
            { name: 'Subcategory A2', href: 'subcategory-a2' },
          ],
        },
      ],
      B: [
        {
          name: 'Category B',
          subCategories: [
            { name: 'Subcategory B1', href: 'subcategory-b1' },
            { name: 'Subcategory B2', href: 'subcategory-b2' },
          ],
        },
      ],
    };

    // Call the function
    await detectLiveEmailAZ(categories);

    // Assert that there are no duplicate emails in the email list
    // Replace `emailList` with the actual variable name in your code
    // Replace `letter` and `subCategoryName` with the actual values in your code
    const emailList = await readFile('./data/mails/A/Subcategory A1.txt');
    const emails = emailList.split('\n');
    const uniqueEmails = [...new Set(emails)];
    expect(uniqueEmails).to.have.lengthOf(emails.length);
  });
});
