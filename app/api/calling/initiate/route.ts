/**
 * API Route: POST /api/calling/initiate
 * Initiates an outbound call to a contact
 * Requires: to (phone number), from (caller ID), contactId
 */

import { NextRequest, NextResponse } from 'next/server'
import { initiateCall, formatPhoneNumber } from '@/lib/calling-service'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, from, contactId, recordCall = true } = body

    // Validate required fields
    if (!to || !from || !contactId) {
      return NextResponse.json(
        { error: 'Missing required fields: to, from, contactId' },
        { status: 400 }
      )
    }

    // Format phone numbers to E.164 format
    const formattedTo = formatPhoneNumber(to)
    const formattedFrom = formatPhoneNumber(from)

    // Initiate the call through Twilio/Exotel
    const callResponse = await initiateCall({
      to: formattedTo,
      from: formattedFrom,
      contactId,
      recordCall,
    })

    // Log the call initiation in Supabase
    const { error: logError } = await supabase.from('call_logs').insert({
      contact_id: contactId,
      call_sid: callResponse.callSid,
      call_type: 'outbound',
      status: 'initiated',
      notes: `Call initiated to ${formattedTo}`,
      created_at: new Date().toISOString(),
    })

    if (logError) {
      console.error('Error logging call:', logError)
    }

    return NextResponse.json(callResponse, { status: 200 })
  } catch (error) {
    console.error('Error initiating call:', error)
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    )
  }
}
