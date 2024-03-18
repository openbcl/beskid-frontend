const backendDomain: string = 'beskid-api-jpznrvho2a-ey.a.run.app';
const backendPort: number = 443;
const useTLS: boolean = true;

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
