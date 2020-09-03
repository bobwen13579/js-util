const path = require('path');
const [dir] = process.argv.slice(2);
const fsWithCallbacks = require('fs');
const { readdir, stat, rename } = fsWithCallbacks.promises;

const renameFile = (dir, callback) => {
  readdir(dir)
    .then((files) => {
      files.map((fileName) => {
        // 拼接成文件路径
        const filedir = path.join(dir, fileName);
        stat(filedir).then((stats) => {
          if (stats.isFile()) {
            const newName = callback(fileName);
            rename(filedir, newName);
          } else if (stats.isDirectory()) {
            renameFile(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
          } else console.log('忽略非文件');
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

renameFile(dir, (filename) => {
  const matchs = filename.match(/\d{3,3}/g);
  if (!matchs) return;
  const replaceName = matchs.join('');
  // const newFilePath = join(dir, file.replace(match, replaceName));
  const image = `output/${replaceName}.png`;
  return image;
});
