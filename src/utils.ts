import * as fs from 'fs';

function writeToFile(
  fileName: string,
  data: string,
  callback: ((error: NodeJS.ErrnoException | null) => void) | null = null
): void {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`${fileName} has been successfully written!`);
    }
    if (callback) {
      callback(err);
    }
  });
}
export { writeToFile };
