// This file should be called automatically by "npm run <...>"-command (adjusts environment files based on hosts environment or given args)

const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');
const process = require('process');

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

const host = process.argv[2] || 'beskid.bcl-leipzig.net';
const tls = ['true', 'yes', '1'].includes((process.argv[3]?.toLowerCase() || 'true').trim());
const port = process.argv[4] ? parseInt(process.argv[4]) : tls ? 443 : 3000;
const protocol = tls ? 'https' : 'http';
const backend = tls && port === 443 || !tls && port === 80 ? host : `${host}:${port}`;
const api = `${protocol}://${backend}`

const envConfigFile = `export const environment = {
  production: false,
  domain: '${host}',
  backend: '${backend}',
  api: '${api}',
};`;

console.log(envConfigFile);

fs.writeFileSync('./src/environments/environment.ts', envConfigFile);