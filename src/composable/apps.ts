export const apps: IApps[] = [
  {
    name: 'Auth',
    path: '/',
    icon: 'https://assets.pointhub.net/assets/images/logo/primary/icon-rounded.png',
    menu: [
      {
        name: 'Home',
        path: '/home'
      },
      {
        name: 'Credentials',
        submenu: [
          { name: 'API Keys', path: '/credentials/api-keys' },
          { name: 'OAuth 2.0', path: '/credentials/oauth2s' },
          { name: 'OAuth Consent Screen', path: '/credentials/oauth-consent-screen' }
        ]
      }
    ]
  },
  {
    name: 'App 2',
    path: 'https://www.example.com'
  },
  {
    name: 'App 3',
    path: 'https://www.example.com'
  },
  {
    name: 'App 4',
    path: 'https://www.example.com'
  }
]
