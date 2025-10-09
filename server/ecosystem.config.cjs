module.exports = {
  apps: [
    {
      name: 'maninfini-backend',
      script: 'src/index.ts',
      cwd: '/root/websites/maninfinitrends/server',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/maninfini-backend-error.log',
      out_file: '/var/log/pm2/maninfini-backend-out.log',
      log_file: '/var/log/pm2/maninfini-backend.log',
      time: true
    }
  ]
};
