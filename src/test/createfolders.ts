import * as fs from 'fs-extra';
import * as path from 'path';

const filePath = 'H:\\VSCode\\yp\\data\\business\\M\\Máy Phát Điện Năng Lượng Mặt Trời\\ Gió (14).json';

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirpSync(dirname);
};

const createFile = (filePath: string) => {
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, '{}', { flag: 'w' });
  console.log(`File created at ${filePath}`);
};

createFile(filePath);
