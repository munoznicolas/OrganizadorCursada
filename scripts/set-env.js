const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: true,
  cloudflare: {
    apiEndpoint: "${process.env.CLOUDFLARE_API_ENDPOINT || '/api'}",
    googleClientId: "${process.env.GOOGLE_CLIENT_ID || ''}"
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile, { encoding: 'utf8' });
console.log(`[set-env] File environment.prod.ts generated successfully for Cloudflare.`);
