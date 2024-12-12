// This file should be called automatically by "npm run <...>"-command (adjusts environment files based on hosts environment or given args)

const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

const data = `export const version = '';
export const commit = '';
export const branch = '';`

fs.readFile('.git/HEAD', (err, head) => {
  if (err) return console.log(err);
  const rev = head.toString();
  if (rev.indexOf(':') > -1) {
    fs.readFile('.git/' + rev.substring(5).replace(/\n/g, ''), (err, hash) => {
      if (err) return console.log(err);
      fs.writeFile(
        path.join(__dirname, 'src', 'environments', 'info.ts'),
        data.replace(/version.*/g, `version = '${packageJson.version}';`)
          .replace(/commit.*/g, `commit = '${hash.toString().slice(0, 7)}';`)
          .replace(/branch.*/g, `branch = '${rev.substring(5).replace(/\n/g, '').split('/').pop()}';`),
        'utf8', (err) => (err) && console.log(err)
      );
    });
  }
});