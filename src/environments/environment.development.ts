const backendDomain: string = 'localhost';
const backendPort: number = 3000;
const useTLS: boolean = false;

const processBackendDomainAndPort = () => {
  if (useTLS && backendPort === 443 || !useTLS && backendPort === 80) {
    return backendDomain;
  } else {
    return `${backendDomain}:${backendPort}`
  }
}

export const environment = {
  production: false,
  domain: backendDomain,
  backend: processBackendDomainAndPort(),
  api: `${useTLS ? 'https' : 'http'}://${processBackendDomainAndPort()}`,
};
