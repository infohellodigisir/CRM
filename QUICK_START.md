# CRM Pro - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Twilio/Exotel account (optional, for calling features)

---

## Step 1: Clone & Install

```bash
# Navigate to project directory
cd /home/code/crm-app

# Install dependencies
npm install
```

---

## Step 2: Configure Environment Variables

Create or update `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://khfbpefakymfolvichfn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Calling API (Optional)
NEXT_PUBLIC_CALLING_API_KEY=your_twilio_api_key
NEXT_PUBLIC_CALLING_API_SECRET=your_twilio_api_secret
NEXT_PUBLIC_CALLING_ACCOUNT_SID=your_account_sid
NEXT_PUBLIC_CALLING_PHONE_NUMBER=+1-555-0100
```

---

## Step 3: Set Up Database

### Option A: Using Supabase Dashboard

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Run the SQL scripts from `README.md` to create tables

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

---

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://your-ip:3000

---

## Step 5: Access the Application

Open your browser and navigate to `http://localhost:3000`

You should see:
- ✅ Dashboard with metrics
- ✅ Sidebar navigation
- ✅ All pages accessible

---

## 📱 Explore Features

### Dashboard
- View key metrics
- See recent contacts
- Quick action buttons

### Contacts
- View all contacts in table
- Search by name, email, or company
- Add new contacts

### Deals
- Visual Kanban board
- 6 deal stages
- Track deal values

### Call Logs
- View call history
- Download recordings
- Track call duration

### Tasks
- Create and manage tasks
- Filter by status
- Track due dates

### Notes
- Create notes
- Link to contacts/deals
- Search notes

### Analytics
- Revenue metrics
- Conversion rates
- Top performers
- Pipeline summary

---

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

---

## 🔧 Configuration

### Change Port
```bash
npm run dev -- -p 3001
```

### Enable Dark Mode
The app automatically detects system preference. To manually toggle:
- Look for theme toggle in Settings (coming soon)

### Customize Colors
Edit `tailwind.config.ts`:
```typescript
theme: {
  colors: {
    primary: '#2563EB',  // Change primary color
    // ... other colors
  }
}
```

---

## 📊 Sample Data

The application comes with sample data for:
- 3 contacts
- 5 deals
- 4 call logs
- 5 tasks
- 5 notes

This data is loaded from the page components and can be replaced with real data from Supabase.

---

## 🔌 API Integration

### Fetch Contacts
```typescript
const response = await fetch('/api/contacts');
const contacts = await response.json();
```

### Initiate Call
```typescript
const response = await fetch('/api/calling/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+1-555-0101',
    from: '+1-555-0100',
    contactId: 'contact-uuid',
    recordCall: true
  })
});
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Supabase Connection Error
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Check internet connection

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## 📚 Project Structure

```
crm-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard
│   ├── contacts/          # Contacts page
│   ├── deals/             # Deals page
│   ├── calls/             # Call logs page
│   ├── tasks/             # Tasks page
│   ├── notes/             # Notes page
│   ├── analytics/         # Analytics page
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
├── public/                # Static files
├── .env.local            # Environment variables
├── package.json          # Dependencies
└── README.md             # Full documentation
```

---

## 🎨 Customization

### Change App Name
Edit `app/layout.tsx`:
```typescript
export const metadata = {
  title: 'Your CRM Name',
  description: 'Your description'
}
```

### Change Logo
Replace logo in `components/layout/Sidebar.tsx`:
```typescript
<div className="text-2xl font-bold">Your Logo</div>
```

### Change Colors
Edit `tailwind.config.ts` and update color values throughout components.

---

## 📱 Responsive Design

The app is fully responsive:
- **Mobile:** 375px and up
- **Tablet:** 768px and up
- **Desktop:** 1024px and up

Test on different devices:
```bash
# Chrome DevTools
F12 → Toggle device toolbar (Ctrl+Shift+M)
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📞 Support

- **Documentation:** See `README.md`
- **Issues:** Check `IMPLEMENTATION_SUMMARY.md`
- **Email:** infohellodigisir@gmail.com

---

## ✅ Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Set up database
4. ✅ Start development server
5. ✅ Explore the application
6. ✅ Customize for your needs
7. ✅ Deploy to production

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Happy coding! 🚀**

*Last Updated: November 27, 2025*
