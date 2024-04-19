import * as fs from 'fs';

function writeToFile(
  fileName: string,
  data: string,
  callback: ((error: NodeJS.ErrnoException | null) => void) | null = null
): void {
  fs.appendFile(fileName, data, (err) => {
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
async function createFolder(directoryPath) {
  try {
    // Check if the directory exists
    const stats = await fs.promises.stat(directoryPath);
    if (stats.isDirectory()) {
      console.log('Directory already exists');
    } else {
      console.error('Path exists, but is not a directory');
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory doesn't exist, create it
      try {
        await fs.promises.mkdir(directoryPath, { recursive: true });
        console.log('Directory created successfully');
      } catch (mkdirErr) {
        console.error('Error creating directory:', mkdirErr);
      }
    } else {
      console.error('Error checking directory existence:', err);
    }
  }
}

export { writeToFile, createFolder };
