/**
 * Supabase Client Configuration
 * Initializes the Supabase client for database operations and authentication
 * Uses environment variables for secure credential management
 */

import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate that required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Create and export Supabase client instance
 * This client is used for all database operations and real-time subscriptions
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Type definitions for database tables
 * These types ensure type safety when working with Supabase data
 */
export interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  position: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Deal {
  id: string
  title: string
  value: number
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  contact_id: string
  expected_close_date: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CallLog {
  id: string
  contact_id: string
  duration: number
  call_type: 'inbound' | 'outbound'
  status: 'completed' | 'missed' | 'failed'
  recording_url?: string
  notes: string
  created_at: string
  user_id: string
}

export interface Task {
  id: string
  title: string
  description: string
  contact_id?: string
  deal_id?: string
  due_date: string
  status: 'pending' | 'completed'
  created_at: string
  user_id: string
}

export interface Note {
  id: string
  content: string
  contact_id?: string
  deal_id?: string
  created_at: string
  user_id: string
}
