# CRM Pro - Professional Customer Relationship Management System

A modern, fully-featured CRM application built with Next.js, Supabase, and Tailwind CSS. Inspired by Frappe CRM with integrated calling capabilities.

## 🚀 Features

### Core CRM Functionality
- **Contact Management**: Organize and manage all your customer contacts with detailed information
- **Deal Tracking**: Visual Kanban board for managing sales pipeline across multiple stages
- **Call Logs**: Complete call history with recording capabilities and duration tracking
- **Task Management**: Create and track tasks with due dates and status updates
- **Notes**: Keep detailed notes on contacts and deals for better collaboration
- **Analytics Dashboard**: Real-time metrics, revenue tracking, and performance analytics

### Calling Integration
- **Outbound Calls**: Initiate calls directly from the CRM with Twilio/Exotel integration
- **Call Recording**: Automatic call recording and storage
- **Call Logs**: Complete call history with duration, status, and notes
- **Phone Number Formatting**: Automatic E.164 format conversion for international numbers

### User Interface
- **Modern Design**: Clean, professional interface with dark mode support
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use sidebar navigation with quick access to all features
- **Real-time Updates**: Live data synchronization with Supabase

## 📋 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Hooks, Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Calling API**: Twilio/Exotel integration

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account with database
- Twilio/Exotel account (for calling features)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd /home/code/crm-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy .env.local and update with your credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_CALLING_API_KEY=your_twilio_api_key
   NEXT_PUBLIC_CALLING_ACCOUNT_SID=your_account_sid
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase database:

   ```sql
   -- Contacts Table
   CREATE TABLE contacts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255),
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(20),
     company VARCHAR(255),
     position VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     user_id UUID
   );

   -- Deals Table
   CREATE TABLE deals (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title VARCHAR(255) NOT NULL,
     value DECIMAL(12, 2),
     stage VARCHAR(50) DEFAULT 'lead',
     contact_id UUID REFERENCES contacts(id),
     expected_close_date DATE,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     user_id UUID
   );

   -- Call Logs Table
   CREATE TABLE call_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     contact_id UUID REFERENCES contacts(id),
     call_sid VARCHAR(255),
     call_type VARCHAR(20),
     status VARCHAR(50),
     duration INTEGER,
     recording_url TEXT,
     notes TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     user_id UUID
   );

   -- Tasks Table
   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title VARCHAR(255) NOT NULL,
     description TEXT,
     contact_id UUID REFERENCES contacts(id),
     deal_id UUID REFERENCES deals(id),
     due_date DATE,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW(),
     user_id UUID
   );

   -- Notes Table
   CREATE TABLE notes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     content TEXT NOT NULL,
     contact_id UUID REFERENCES contacts(id),
     deal_id UUID REFERENCES deals(id),
     created_at TIMESTAMP DEFAULT NOW(),
     user_id UUID
   );
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Pages & Features

### Dashboard (`/`)
- Overview of key metrics
- Recent contacts list
- Quick action buttons
- Sales pipeline summary

### Contacts (`/contacts`)
- View all contacts in table format
- Search and filter contacts
- Add, edit, and delete contacts
- Contact details with communication history

### Deals (`/deals`)
- Kanban board view of sales pipeline
- Drag-and-drop deal management
- Deal stages: Lead, Qualified, Proposal, Negotiation, Won, Lost
- Deal value and expected close date tracking

### Call Logs (`/calls`)
- Complete call history
- Call type (inbound/outbound) indicators
- Call duration and status
- Recording download capability
- Call notes and timestamps

### Tasks (`/tasks`)
- Task creation and management
- Due date tracking
- Status indicators (pending/completed)
- Overdue task highlighting
- Task filtering by status

### Notes (`/notes`)
- Create and manage notes
- Link notes to contacts or deals
- Search notes by content
- Timestamp tracking

### Analytics (`/analytics`)
- Revenue metrics and trends
- Conversion rate tracking
- Sales cycle analysis
- Top performer rankings
- Pipeline summary by stage

## 🔌 API Routes

### Contacts API
- `GET /api/contacts` - Fetch all contacts
- `POST /api/contacts` - Create new contact

### Calling API
- `POST /api/calling/initiate` - Initiate outbound call
  - Required: `to`, `from`, `contactId`
  - Optional: `recordCall` (default: true)

## 🎨 Styling & Customization

### Color Scheme
- Primary: Blue (#2563EB)
- Secondary: Purple (#9333EA)
- Success: Green (#16A34A)
- Warning: Orange (#EA580C)
- Danger: Red (#DC2626)

### Dark Mode
The application includes full dark mode support using Tailwind CSS dark mode utilities.

### Responsive Design
- Mobile: 375px and up
- Tablet: 768px and up
- Desktop: 1024px and up
- Large Desktop: 1280px and up

## 🔐 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) for data protection
- Input validation with Zod schemas
- CORS configuration for API routes
- Phone number validation and formatting

## 📊 Database Schema

### Contacts
- id, first_name, last_name, email, phone, company, position, created_at, updated_at, user_id

### Deals
- id, title, value, stage, contact_id, expected_close_date, created_at, updated_at, user_id

### Call Logs
- id, contact_id, call_sid, call_type, status, duration, recording_url, notes, created_at, user_id

### Tasks
- id, title, description, contact_id, deal_id, due_date, status, created_at, user_id

### Notes
- id, content, contact_id, deal_id, created_at, user_id

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
Set the following in your Vercel project settings:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_CALLING_API_KEY
- NEXT_PUBLIC_CALLING_API_SECRET
- NEXT_PUBLIC_CALLING_ACCOUNT_SID

## 📝 Configuration

### Twilio Setup
1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Configure webhook URL for call events
5. Add credentials to .env.local

### Supabase Setup
1. Create a Supabase project at https://supabase.com
2. Create the database tables (see Installation section)
3. Enable Row Level Security (RLS) for data protection
4. Get your project URL and anon key
5. Add to .env.local

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@crmapp.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] User authentication and multi-user support
- [ ] Advanced reporting and custom dashboards
- [ ] Email integration (Gmail, Outlook)
- [ ] WhatsApp integration
- [ ] Mobile app (React Native)
- [ ] AI-powered insights and recommendations
- [ ] Workflow automation
- [ ] Custom fields and modules
- [ ] API for third-party integrations
- [ ] Advanced permission management

## 📞 Contact

For questions or inquiries, reach out to:
- Email: infohellodigisir@gmail.com
- Website: https://crmapp.com

---

Built with ❤️ by the CRM Pro Team
