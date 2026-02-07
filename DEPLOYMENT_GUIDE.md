# Deployment Guide

## How the API Configuration Works

The application automatically detects the environment and uses the correct API URL:

### Development (Local)
- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:7000`
- **Detection:** Automatically detects `localhost` in the browser URL

### Production (Vercel)
- **Frontend:** Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- **Backend:** `https://shofy-backend-dlt.vercel.app`
- **Detection:** Automatically uses Vercel URL when NOT on localhost

## Deployment Steps

### 1. Frontend Deployment (Vercel)

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set the root directory to `frontend`

3. **Environment Variables (Optional but Recommended):**
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_BASE_URL` = `https://shofy-backend-dlt.vercel.app`
   - This ensures it always uses the production backend

4. **Deploy:**
   - Vercel will automatically deploy on every push to main branch

### 2. Backend Deployment (Vercel)

1. **Set root directory to `backend`** in Vercel project settings

2. **Add Environment Variables:**
   - `MONGO_URI` - Your MongoDB connection string
   - `TOKEN_SECRET` - JWT secret
   - `PORT` - Usually 7000 (Vercel will override this)
   - All other secrets from your `.env` file

3. **Deploy:**
   - Vercel will automatically deploy your backend

## How It Works

### Automatic Detection Logic:

```javascript
// If on localhost → use http://localhost:7000
// If on any other domain → use https://shofy-backend-dlt.vercel.app
```

### Priority Order:
1. **Environment Variable** (`NEXT_PUBLIC_API_BASE_URL`) - Highest priority
2. **Hostname Detection** - Checks if you're on localhost
3. **Default** - Falls back to Vercel URL

## Testing Before Deployment

1. **Test locally:**
   ```bash
   # Backend
   cd backend
   npm run start-dev
   
   # Frontend
   cd frontend
   npm run dev
   ```
   Should use `http://localhost:7000`

2. **Test production build locally:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```
   Should still use `http://localhost:7000` if running on localhost

3. **Deploy to Vercel:**
   - Once deployed, it will automatically use the Vercel backend URL
   - No code changes needed!

## Sharing with Clients

When you share your Vercel link:
- ✅ It will automatically use the production backend
- ✅ No configuration needed
- ✅ Works out of the box

## Troubleshooting

### API calls going to wrong URL:
1. Check browser console for the actual URL being used
2. Verify `NEXT_PUBLIC_API_BASE_URL` is not set incorrectly
3. Clear browser cache and hard refresh

### CORS errors in production:
- Make sure your backend CORS is configured to allow your Vercel frontend domain
- Check backend logs on Vercel

### Environment variables not working:
- Vercel requires you to set environment variables in their dashboard
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Restart deployment after adding new environment variables
