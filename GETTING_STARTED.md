# Getting Started with Glassbox - Complete Beginner's Guide

This guide will walk you through every step needed to run the Glassbox application on your computer, even if you've never used development tools before.

---

## What You'll Install

To run Glassbox, you need to install these programs:

1. **Node.js** - JavaScript runtime (required)
2. **pnpm** - Package manager for installing dependencies (required)
3. **Python 3** - For portfolio calculations (required)
4. **PostgreSQL** - Database for storing portfolios (required)
5. **Git** - For downloading the project (optional, can download as ZIP instead)

**Time Required:** About 30-45 minutes for complete setup

---

## Step 1: Install Node.js

Node.js allows you to run JavaScript on your computer (not just in a browser).

### For macOS:

**Option A: Using the Installer (Recommended)**

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Click the **"LTS"** (Long Term Support) button to download - this is the stable version
3. Open the downloaded `.pkg` file
4. Follow the installation wizard (click "Continue" and "Install")
5. Enter your password when prompted

**Option B: Using Homebrew (if you have it)**

```bash
brew install node
```

### For Windows:

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Click the **"LTS"** button to download
3. Open the downloaded `.msi` file
4. Follow the installation wizard
5. **Important:** Check the box "Automatically install the necessary tools" during installation

### Verify Installation

Open **Terminal** (macOS) or **Command Prompt** (Windows) and type:

```bash
node --version
```

You should see something like `v18.17.0` or higher.

Then check npm (comes with Node.js):

```bash
npm --version
```

You should see something like `9.6.7` or higher.

✅ **Success!** Node.js is installed.

---

## Step 2: Install pnpm

pnpm is a fast package manager that manages project dependencies efficiently.

### Install pnpm globally:

In your Terminal/Command Prompt, run:

```bash
npm install -g pnpm
```

Wait for installation to complete (may take 1-2 minutes).

### Verify Installation:

```bash
pnpm --version
```

You should see something like `9.0.0` or higher.

✅ **Success!** pnpm is installed.

---

## Step 3: Install Python 3

Python is needed for the portfolio optimization calculations.

### For macOS:

**Check if already installed:**

```bash
python3 --version
```

If you see `Python 3.9.x` or higher, you can skip to Step 4.

**If not installed:**

1. Visit [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Click **"Download Python 3.x.x"** (get the latest version)
3. Open the downloaded `.pkg` file
4. Follow the installation wizard
5. **Important:** Check the box "Add Python to PATH" during installation

### For Windows:

1. Visit [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Click **"Download Python 3.x.x"**
3. Open the downloaded `.exe` file
4. **IMPORTANT:** Check the box **"Add Python to PATH"** at the bottom
5. Click **"Install Now"**
6. Follow the installation wizard

### Verify Installation:

```bash
python3 --version
```

You should see `Python 3.9.x` or higher.

Also verify pip (Python package installer):

```bash
pip3 --version
```

✅ **Success!** Python is installed.

---

## Step 4: Install PostgreSQL

PostgreSQL is the database where your portfolios are stored.

### For macOS:

**Option A: Using Postgres.app (Easiest for beginners)**

1. Visit [https://postgresapp.com/](https://postgresapp.com/)
2. Click **"Download"**
3. Open the downloaded file and drag **Postgres.app** to Applications
4. Open **Postgres.app** from Applications
5. Click **"Initialize"** to create a default database server
6. The elephant icon will appear in your menu bar when running

**Option B: Using Homebrew**

```bash
brew install postgresql@15
brew services start postgresql@15
```

### For Windows:

1. Visit [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Download the **PostgreSQL installer**
3. Run the installer
4. During installation:
   - Remember your **password** (you'll need this!)
   - Use default port **5432**
   - Click through the rest of the wizard
5. **Do NOT** install Stack Builder when prompted at the end

### Verify Installation:

```bash
psql --version
```

You should see `psql (PostgreSQL) 12.x` or higher.

✅ **Success!** PostgreSQL is installed.

---

## Step 5: Download the Glassbox Project

### Option A: Using Git (Recommended)

**Install Git first** (if not already installed):

- **macOS:** `brew install git` or download from [https://git-scm.com/](https://git-scm.com/)
- **Windows:** Download from [https://git-scm.com/](https://git-scm.com/)

**Clone the repository:**

```bash
# Navigate to where you want the project (e.g., Desktop)
cd ~/Desktop

# Clone the project
git clone <your-repository-url>

# Enter the project directory
cd glassbox
```

### Option B: Download as ZIP

1. Go to your project's repository page
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to your desired location (e.g., Desktop)
5. Open Terminal/Command Prompt and navigate to the folder:

```bash
cd ~/Desktop/glassbox
```

✅ **Success!** Project downloaded.

---

## Step 6: Install Project Dependencies

Now we'll install all the JavaScript packages the project needs.

### In the Terminal/Command Prompt, run:

```bash
# Make sure you're in the glassbox directory
cd /path/to/glassbox

# Install all dependencies (this will take 3-5 minutes)
pnpm install
```

You'll see lots of text scrolling - this is normal! Wait for it to complete.

### Install Python Dependencies for Backend:

```bash
# Navigate to backend Python directory
cd apps/backend/python

# Install Python packages
pip3 install -r requirements.txt
```

This installs:
- `numpy` - Math calculations
- `pandas` - Data processing
- `yfinance` - Stock market data
- `PyPortfolioOpt` - Portfolio optimization
- `scipy` - Scientific computing
- `scikit-learn` - Machine learning utilities

✅ **Success!** All dependencies installed.

---

## Step 7: Set Up the Database

### Create the Database:

**For macOS (Postgres.app):**

1. Open **Postgres.app** (should be running with elephant icon in menu bar)
2. Double-click on the default database to open **psql**
3. In the psql terminal, run:

```sql
CREATE DATABASE glassbox;
```

**For macOS/Windows (command line):**

```bash
# Create database
createdb glassbox

# Or use psql:
psql -U postgres
CREATE DATABASE glassbox;
\q
```

### Configure Backend Environment:

```bash
# Go to backend directory
cd apps/backend

# Copy environment template
cp .env.example .env.local

# Open .env.local in a text editor
```

**Edit `.env.local` file** with your database connection:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/glassbox"

# Change "yourpassword" to your actual PostgreSQL password
# If using Postgres.app on Mac, you might not need a password:
DATABASE_URL="postgresql://localhost:5432/glassbox"

# JWT Secret (can be any random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Google OAuth (optional - leave blank for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"
```

### Run Database Migrations:

```bash
# Still in apps/backend directory

# Generate Prisma client
pnpm prisma generate

# Create database tables
pnpm prisma migrate dev
```

You should see messages about creating tables.

✅ **Success!** Database is set up.

---

## Step 8: Run the Application

Now everything is ready! Let's start the app.

### Option A: Run Everything at Once (Recommended)

From the **root directory** (`glassbox/`):

```bash
pnpm dev
```

This starts both frontend and backend simultaneously using Turborepo.

### Option B: Run Frontend and Backend Separately

**Terminal 1 - Backend:**

```bash
# From root directory
pnpm run be

# Backend will start on http://localhost:4000
```

**Terminal 2 - Frontend:**

```bash
# From root directory (open a new terminal tab)
pnpm run fe

# Frontend will start on http://localhost:3000
```

### Access the Application:

1. Open your web browser
2. Go to **http://localhost:3000**
3. You should see the Glassbox landing page! 🎉

### Verify Backend is Working:

1. Go to **http://localhost:4000/api** (Swagger API documentation)
2. You should see the API documentation page

✅ **Success!** Glassbox is running!

---

## Step 9: Using the Application

### Build Your First Portfolio:

1. Click **"Start Analysis"** on the landing page
2. Add stock tickers:
   - Type "AAPL" (Apple) and enter a quantity (e.g., 10)
   - Type "MSFT" (Microsoft) and enter a quantity (e.g., 20)
   - Click **"Add to Portfolio"** for each
3. Click **"Analyze Portfolio"**
4. View your efficient frontier results and beta hedging recommendations!

### Save Portfolios:

- After viewing results, click **"Save Portfolio"**
- View saved portfolios in the **"Portfolio Library"** page

---

## Troubleshooting

### "Command not found: node"

- **Solution:** Node.js not installed or not in PATH
- Reinstall Node.js and make sure to check "Add to PATH" option

### "Command not found: pnpm"

- **Solution:** Run `npm install -g pnpm` again
- May need to restart Terminal/Command Prompt

### "Command not found: python3"

- **macOS:** Try `python` instead of `python3`
- **Windows:** Make sure "Add Python to PATH" was checked during installation

### "ECONNREFUSED" or "Cannot connect to database"

- **Solution:** PostgreSQL is not running
- **macOS:** Open Postgres.app and click "Start"
- **Windows:** Open Services, find PostgreSQL, and click "Start"

### "Module not found" errors

- **Solution:** Dependencies not fully installed
- Run `pnpm install` again from root directory
- Run `pip3 install -r requirements.txt` from `apps/backend/python`

### Port already in use (EADDRINUSE)

- **Solution:** Another app is using port 3000 or 4000
- **Option 1:** Stop the other application
- **Option 2:** Change port in code:
  - Frontend: Edit `apps/web/package.json` → change port in dev script
  - Backend: Edit `apps/backend/src/main.ts` → change port number

### Python script fails with "ModuleNotFoundError: No module named 'numpy'"

- **Solution:** Python dependencies not installed
- Navigate to `apps/backend/python` and run:
  ```bash
  pip3 install -r requirements.txt
  ```

### "Prisma Client not found"

- **Solution:** Run from `apps/backend`:
  ```bash
  pnpm prisma generate
  ```

---

## Stopping the Application

### If running with `pnpm dev`:

Press **Ctrl + C** in the terminal to stop all servers.

### If running separately:

Press **Ctrl + C** in each terminal window running frontend/backend.

---

## Next Steps

- **Read the Documentation:** Check `.claude/` folder for product and design docs
- **Explore the API:** Visit http://localhost:4000/api for Swagger docs
- **Customize Settings:** Edit environment variables in `apps/backend/.env.local`
- **Build for Production:** Run `pnpm build` when ready to deploy

---

## Quick Command Reference

```bash
# Start development (everything)
pnpm dev

# Start only frontend (port 3000)
pnpm run fe

# Start only backend (port 4000)
pnpm run be

# Install dependencies
pnpm install

# Build everything
pnpm build

# Run linter
pnpm lint

# Type check
pnpm type-check

# View database
cd apps/backend
pnpm prisma studio
```

---

## Need Help?

- Check individual README files in `apps/web`, `apps/backend`, and `apps/cli`
- Review documentation in `.claude/` directory
- Check that all prerequisites are installed correctly
- Make sure PostgreSQL is running before starting the backend

---

**Congratulations!** You've successfully set up and run Glassbox. Happy portfolio optimizing! 🎉📈
