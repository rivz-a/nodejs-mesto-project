require('dotenv').config();

const dotenv = require('dotenv');
dotenv.config({ path: './.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REPOSITORY, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto',
    script: 'dist/app.js',
  }],

  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPOSITORY,
      path: DEPLOY_PATH,
      'pre-deploy': `bash scripts/deployEnv.sh ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'pwd && npm ci && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
