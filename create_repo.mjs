import { Octokit } from '@octokit/rest'

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    const user = await octokit.rest.users.getAuthenticated();
    console.log('✓ GitHub user:', user.data.login);
    
    try {
      const repo = await octokit.rest.repos.get({
        owner: user.data.login,
        repo: 'richell-birthday-card'
      });
      console.log('✓ Repository already exists at:', repo.data.html_url);
    } catch (e) {
      if (e.status === 404) {
        const repo = await octokit.rest.repos.createForAuthenticatedUser({
          name: 'richell-birthday-card',
          description: 'A beautiful birthday greeting card web application for Richell Gayatgay',
          private: false
        });
        console.log('✓ Repository created at:', repo.data.html_url);
      } else {
        throw e;
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

main();
