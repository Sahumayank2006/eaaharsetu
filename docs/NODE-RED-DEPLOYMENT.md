# Node-RED Cloud Deployment Guide

## The Problem
When deploying to Vercel, your local Node-RED instance at `http://127.0.0.1:1880` is not accessible because it's running on your local machine, not on the internet.

## Solutions

### Option 1: Deploy Node-RED to a Cloud Service (Recommended)

#### FlowFuse (Recommended)
1. Sign up at https://flowfuse.com/
2. Create a new Node-RED instance
3. Import your flows from your local Node-RED
4. Get your public URL (e.g., `https://your-instance.flowfuse.cloud/`)
5. Set the environment variable in Vercel

#### Heroku
1. Create a new Heroku app
2. Use the Node-RED buildpack: https://github.com/joewils/heroku-buildpack-nodejs-nodered
3. Deploy your Node-RED flows
4. Your URL will be: `https://your-app-name.herokuapp.com/`

#### Railway
1. Sign up at https://railway.app/
2. Deploy Node-RED using their templates
3. Configure your flows
4. Get your public URL

### Option 2: Use ngrok (For Testing Only)

1. Install ngrok: https://ngrok.com/
2. Run your local Node-RED: `node-red`
3. In another terminal: `ngrok http 1880`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Use this URL + `/ui` as your environment variable

**Note:** ngrok URLs change every time you restart, so this is only for testing.

### Option 3: Self-Hosted VPS

1. Get a VPS (DigitalOcean, Linode, AWS EC2)
2. Install Node-RED on the server
3. Configure nginx/Apache as reverse proxy
4. Set up SSL certificate
5. Use your domain/IP as the Node-RED URL

## Configuring Environment Variables

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `NEXT_PUBLIC_NODERED_URL` = `https://your-nodered-url.com/ui`
4. Redeploy your application

### In Your Local Environment:
Create/update `.env.local`:
```
NEXT_PUBLIC_NODERED_URL=https://your-nodered-url.com/ui
```

## Testing Your Setup

1. Visit your Node-RED URL directly in a browser
2. Make sure the dashboard loads at `/ui` route
3. Deploy to Vercel with the new environment variable
4. Test the IoT dashboard integration

## Security Considerations

- Enable authentication in Node-RED for production
- Use HTTPS URLs only
- Consider IP whitelisting if possible
- Regularly update Node-RED and its dependencies

## Troubleshooting

- **CORS Issues**: Configure Node-RED to allow your Vercel domain
- **Authentication**: Disable or configure auth for iframe embedding
- **Mixed Content**: Ensure HTTPS if your main site uses HTTPS
- **URL Format**: Make sure URL ends with `/ui` for the dashboard

## Sample Node-RED Settings.js for Cloud Deployment

```javascript
module.exports = {
    uiPort: process.env.PORT || 1880,
    httpAdminRoot: '/admin',
    httpNodeRoot: '/api',
    ui: { path: "/ui" },
    functionGlobalContext: {},
    exportGlobalContextKeys: false,
    httpNodeCors: {
        origin: ["https://your-vercel-app.vercel.app"],
        credentials: true
    }
}
```