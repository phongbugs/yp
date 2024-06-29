import * as fsExtra from 'fs-extra';
import * as fs from 'fs';
import path from 'path';
const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fsExtra.existsSync(dirname)) {
    return true;
  }
  fsExtra.mkdirpSync(dirname);
};

async function writeToFile(
  fileName: string,
  data: string,
  callback: ((error: NodeJS.ErrnoException | null) => void) | null = null
): Promise<void> {
  //if (fs.existsSync(fileName)) return;
  try {
    ensureDirectoryExistence(fileName);
    await fs.promises.writeFile(fileName, data);
    //console.log(`${fileName} has been successfully written!`);
    if (callback) {
      callback(null);
    }
  } catch (err) {
    console.error('%s: -> Error writing file:', fileName, err);
    if (callback) {
      callback(err);
    }
  }
}
async function createFolder(directoryPath) {
  try {
    // Check if the directory exists
    const stats = await fs.promises.stat(directoryPath);
    if (stats.isDirectory()) {
      //console.log('Directory already exists');
    } else {
      console.error('Path exists, but is not a directory');
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory doesn't exist, create it
      try {
        await fs.promises.mkdir(directoryPath, { recursive: true });
        //console.log('Directory created successfully');
      } catch (mkdirErr) {
        console.error('Error creating directory:', mkdirErr);
      }
    } else {
      console.error('Error checking directory existence:', err);
    }
  }
}
async function readFile(fileName: string): Promise<string> {
  if (fileName.indexOf('/') > -1) fileName = fileName.replace(/\//g, '\\');
  try {
    const data = await fs.promises.readFile(fileName, 'utf-8');
    //console.log(`${fileName} has been successfully read!`);
    return data;
  } catch (err) {
    console.error('%s: -> Error reading file:', fileName, err);
    throw err;
  }
}

function normalizeDistrictName(district) {
  if (district.indexOf('Quận') === -1) return district;
  return district.replace(/Quận\s?(\d+)/i, 'Q. $1');
}

function isValidEmail(email: string): boolean {
  // Use a regular expression to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && !email.startsWith('...');
}

export { writeToFile, createFolder, readFile, normalizeDistrictName, isValidEmail };
