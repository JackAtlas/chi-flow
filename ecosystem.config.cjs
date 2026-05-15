module.exports = {
  apps: [
    {
      name: 'chi-flow',
      cwd: '/var/www/chi-flow',
      script: 'pnpm',
      args: '--filter web start',
      env: {
        NODE_ENV: 'production',
        HOSTNAME: 'chi-flow.jackatlas.xyz'
      }
    }
  ]
}
