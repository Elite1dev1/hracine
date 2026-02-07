# Development Environment Setup

## Quick Setup for Local Development

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Make sure you have a `.env` file in the backend directory with your MongoDB connection string and other secrets.

4. Start the backend server:
   ```bash
   npm run start-dev
   ```
   The server should start on `http://localhost:7000`

5. Seed the database (creates admin accounts):
   ```bash
   npm run data:import
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. (Optional) Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:7000
   ```
   If you don't create this file, it will automatically use `http://localhost:7000` when running on localhost.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend should start on `http://localhost:3000`

### 3. Admin Login

1. Go to `http://localhost:3000/admin/login`

2. Use the default credentials:
   - **Email:** `dorothy@gmail.com`
   - **Password:** `123456`

3. If login fails, click the "Create Default Admin" button on the login page to create an admin account.

### 4. Verify Everything Works

- Backend should be running on: `http://localhost:7000`
- Frontend should be running on: `http://localhost:3000`
- Admin panel accessible at: `http://localhost:3000/admin/login`

## Troubleshooting

### Backend not connecting to database
- Check your `.env` file in the backend directory
- Make sure `MONGO_URI` is set correctly

### CORS errors
- The backend is configured to allow all origins with `app.use(cors())`
- If you still see CORS errors, make sure the backend is running on port 7000

### Admin login fails
1. Make sure you've run `npm run data:import` in the backend directory
2. Check backend console logs for detailed error messages
3. Try clicking "Create Default Admin" button on the login page
4. Verify the backend is running and accessible at `http://localhost:7000`

### API calls going to Vercel instead of localhost
- The frontend automatically detects if you're on localhost and uses `http://localhost:7000`
- If it's still using Vercel, create a `.env.local` file with `NEXT_PUBLIC_API_BASE_URL=http://localhost:7000`
- Restart the Next.js dev server after creating the env file
