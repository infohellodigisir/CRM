# CRM Pro - Deployment Guide

## 🚀 Deployment Options

This guide covers deploying CRM Pro to various platforms.

---

## 1. Vercel (Recommended)

### Why Vercel?
- ✅ Optimized for Next.js
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Automatic previews for PRs

### Step-by-Step Deployment

#### Option A: Using Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
cd /home/code/crm-app
vercel

# 4. Follow prompts and confirm deployment
```

#### Option B: Using GitHub Integration

```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial CRM Pro deployment"
git push origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Select your GitHub repository
# 5. Configure environment variables
# 6. Click "Deploy"
```

### Configure Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://khfbpefakymfolvichfn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_CALLING_API_KEY=your_twilio_api_key
NEXT_PUBLIC_CALLING_API_SECRET=your_twilio_api_secret
NEXT_PUBLIC_CALLING_ACCOUNT_SID=your_account_sid
NEXT_PUBLIC_CALLING_PHONE_NUMBER=+1-555-0100
```

4. Click "Save"
5. Redeploy from the "Deployments" tab

### Verify Deployment

```bash
# Your app will be available at:
https://your-project-name.vercel.app

# Check deployment status
vercel status
```

---

## 2. Netlify

### Step-by-Step Deployment

#### Option A: Using Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Deploy
cd /home/code/crm-app
netlify deploy --prod

# 4. Follow prompts
```

#### Option B: Using GitHub Integration

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to https://netlify.com
# 3. Click "New site from Git"
# 4. Select GitHub and your repository
# 5. Configure build settings:
#    - Build command: npm run build
#    - Publish directory: .next
# 6. Add environment variables
# 7. Click "Deploy site"
```

### Configure Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Click "Site settings" → "Build & deploy" → "Environment"
3. Click "Edit variables"
4. Add all environment variables
5. Trigger a new deploy

---

## 3. AWS Amplify

### Step-by-Step Deployment

```bash
# 1. Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure Amplify
amplify configure

# 3. Initialize Amplify in your project
cd /home/code/crm-app
amplify init

# 4. Add hosting
amplify add hosting

# 5. Publish
amplify publish
```

### Configure Environment Variables

1. Go to AWS Amplify Console
2. Select your app
3. Click "Environment variables"
4. Add all required variables
5. Redeploy

---

## 4. Google Cloud Run

### Step-by-Step Deployment

```bash
# 1. Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# 2. Authenticate
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Build Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/crm-app

# 5. Deploy to Cloud Run
gcloud run deploy crm-app \
  --image gcr.io/YOUR_PROJECT_ID/crm-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=your_url,NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 5. DigitalOcean App Platform

### Step-by-Step Deployment

```bash
# 1. Create app.yaml in project root
cat > app.yaml << 'YAML'
name: crm-app
services:
- name: web
  github:
    repo: your-username/crm-app
    branch: main
  build_command: npm run build
  run_command: npm start
  http_port: 3000
  envs:
  - key: NEXT_PUBLIC_SUPABASE_URL
    value: your_url
  - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
    value: your_key
YAML

# 2. Push to GitHub
git add app.yaml
git commit -m "Add DigitalOcean deployment config"
git push origin main

# 3. Go to https://cloud.digitalocean.com/apps
# 4. Click "Create App"
# 5. Select GitHub and your repository
# 6. Review configuration and deploy
```

---

## 6. Heroku

### Step-by-Step Deployment

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create Heroku app
heroku create crm-app

# 4. Add buildpack for Node.js
heroku buildpacks:add heroku/nodejs

# 5. Set environment variables
heroku config:set NEXT_PUBLIC_SUPABASE_URL=your_url
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
heroku config:set NEXT_PUBLIC_CALLING_API_KEY=your_key

# 6. Deploy
git push heroku main

# 7. View logs
heroku logs --tail
```

---

## 7. Self-Hosted (VPS)

### Prerequisites
- Ubuntu 20.04+ or similar Linux
- Node.js 18+
- Nginx or Apache
- SSL certificate (Let's Encrypt)

### Step-by-Step Deployment

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Clone repository
cd /var/www
git clone https://github.com/your-username/crm-app.git
cd crm-app

# 5. Install dependencies
npm install

# 6. Create .env.local
cat > .env.local << 'ENV'
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_CALLING_API_KEY=your_key
ENV

# 7. Build application
npm run build

# 8. Start with PM2
pm2 start npm --name "crm-app" -- start

# 9. Save PM2 configuration
pm2 save
pm2 startup

# 10. Configure Nginx
sudo nano /etc/nginx/sites-available/crm-app
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/crm-app /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 8. Docker Deployment

### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  crm-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      NEXT_PUBLIC_CALLING_API_KEY: ${NEXT_PUBLIC_CALLING_API_KEY}
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build image
docker build -t crm-app .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  crm-app

# Or use docker-compose
docker-compose up -d
```

---

## Pre-Deployment Checklist

- ✅ All environment variables configured
- ✅ Database tables created in Supabase
- ✅ Supabase credentials verified
- ✅ Twilio/Exotel credentials (if using calling)
- ✅ Build succeeds locally (`npm run build`)
- ✅ No console errors
- ✅ All pages load correctly
- ✅ Search functionality works
- ✅ API routes respond correctly
- ✅ Dark mode works
- ✅ Responsive design verified
- ✅ SSL certificate ready (for self-hosted)
- ✅ Domain configured
- ✅ Email notifications configured (optional)

---

## Post-Deployment Verification

### Test Application

```bash
# 1. Visit your deployed URL
https://your-app-url.com

# 2. Test all pages
- Dashboard
- Contacts
- Deals
- Call Logs
- Tasks
- Notes
- Analytics

# 3. Test functionality
- Search contacts
- Filter tasks
- View analytics
- Check responsive design

# 4. Check browser console
- No errors
- No warnings
- Network requests successful

# 5. Test on mobile
- Use device or DevTools
- Verify responsive layout
- Test touch interactions
```

### Monitor Performance

```bash
# Check Core Web Vitals
# Use Google PageSpeed Insights
https://pagespeed.web.dev

# Monitor uptime
# Use services like:
# - UptimeRobot
# - Pingdom
# - StatusCake
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading

```bash
# Verify .env.local exists
cat .env.local

# Check variable names (must start with NEXT_PUBLIC_ for client-side)
# Restart dev server after changing .env.local
```

### Database Connection Error

```bash
# Verify Supabase credentials
# Check database tables exist
# Verify RLS policies (if enabled)
# Check network connectivity
```

### Calling API Not Working

```bash
# Verify Twilio/Exotel credentials
# Check API keys in environment variables
# Verify phone number format (E.164)
# Check API rate limits
```

---

## Performance Optimization

### Before Deployment

```bash
# Analyze bundle size
npm run build
npm install -g next-bundle-analyzer

# Check performance
npm run build
npm start
# Use Chrome DevTools Lighthouse
```

### After Deployment

- Enable caching headers
- Use CDN for static assets
- Monitor Core Web Vitals
- Set up error tracking (Sentry)
- Monitor performance (New Relic, DataDog)

---

## Security Checklist

- ✅ Environment variables not in code
- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Input validation active
- ✅ SQL injection prevention
- ✅ XSS protection enabled
- ✅ CSRF tokens configured
- ✅ Security headers set
- ✅ Regular backups scheduled

---

## Backup & Recovery

### Database Backups

```bash
# Supabase automatic backups
# Go to Supabase dashboard
# Settings → Backups
# Enable automatic backups

# Manual backup
pg_dump -h db.supabase.co -U postgres dbname > backup.sql
```

### Code Backups

```bash
# GitHub is your backup
# Ensure all code is committed
git push origin main

# Additional backup
tar -czf crm-app-backup.tar.gz /home/code/crm-app
```

---

## Monitoring & Logging

### Application Logs

```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail

# Self-hosted with PM2
pm2 logs crm-app
```

### Error Tracking

```bash
# Setup Sentry
npm install @sentry/nextjs

# Configure in next.config.ts
# Monitor errors in production
```

---

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Use managed database (Supabase)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching

---

## Support & Troubleshooting

**Documentation:** See README.md and QUICK_START.md

**Issues:** Check GitHub Issues or contact support

**Email:** infohellodigisir@gmail.com

---

*Last Updated: November 27, 2025*
*Version: 1.0.0*
