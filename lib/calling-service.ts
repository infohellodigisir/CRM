/**
 * Calling Service - Integration with Twilio/Exotel
 * Handles phone calls, call logs, and call recordings
 * Supports both inbound and outbound calls with recording capabilities
 */

import axios from 'axios'

// Calling API configuration from environment variables
const CALLING_API_KEY = process.env.NEXT_PUBLIC_CALLING_API_KEY
const CALLING_API_SECRET = process.env.NEXT_PUBLIC_CALLING_API_SECRET
const CALLING_ACCOUNT_SID = process.env.NEXT_PUBLIC_CALLING_ACCOUNT_SID

/**
 * Interface for call initiation request
 */
export interface InitiateCallRequest {
  to: string // Recipient phone number
  from: string // Caller phone number
  contactId: string // CRM contact ID
  recordCall: boolean // Whether to record the call
}

/**
 * Interface for call response
 */
export interface CallResponse {
  callSid: string
  status: string
  message: string
}

/**
 * Interface for call log entry
 */
export interface CallLogEntry {
  callSid: string
  from: string
  to: string
  duration: number
  status: 'completed' | 'missed' | 'failed'
  recordingUrl?: string
  timestamp: string
}

/**
 * Initiate an outbound call using Twilio API
 * @param request - Call initiation parameters
 * @returns Call response with call SID and status
 */
export async function initiateCall(request: InitiateCallRequest): Promise<CallResponse> {
  try {
    // Validate phone numbers
    if (!request.to || !request.from) {
      throw new Error('Phone numbers are required')
    }

    // Make API request to Twilio (or your calling service)
    // This is a placeholder - replace with actual Twilio API call
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${CALLING_ACCOUNT_SID}/Calls.json`,
      {
        To: request.to,
        From: request.from,
        Url: `${process.env.NEXT_PUBLIC_APP_URL}/api/calling/webhook`,
        Record: request.recordCall,
      },
      {
        auth: {
          username: CALLING_ACCOUNT_SID || '',
          password: CALLING_API_KEY || '',
        },
      }
    )

    return {
      callSid: response.data.sid,
      status: response.data.status,
      message: 'Call initiated successfully',
    }
  } catch (error) {
    console.error('Error initiating call:', error)
    throw new Error('Failed to initiate call')
  }
}

/**
 * End an active call
 * @param callSid - Twilio call SID
 * @returns Confirmation of call termination
 */
export async function endCall(callSid: string): Promise<{ success: boolean }> {
  try {
    await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${CALLING_ACCOUNT_SID}/Calls/${callSid}.json`,
      { Status: 'completed' },
      {
        auth: {
          username: CALLING_ACCOUNT_SID || '',
          password: CALLING_API_KEY || '',
        },
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Error ending call:', error)
    throw new Error('Failed to end call')
  }
}

/**
 * Get call recording URL
 * @param callSid - Twilio call SID
 * @returns Recording URL if available
 */
export async function getCallRecording(callSid: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${CALLING_ACCOUNT_SID}/Calls/${callSid}/Recordings.json`,
      {
        auth: {
          username: CALLING_ACCOUNT_SID || '',
          password: CALLING_API_KEY || '',
        },
      }
    )

    if (response.data.recordings && response.data.recordings.length > 0) {
      return response.data.recordings[0].uri
    }

    return null
  } catch (error) {
    console.error('Error fetching recording:', error)
    return null
  }
}

/**
 * Get call details and status
 * @param callSid - Twilio call SID
 * @returns Call details including duration and status
 */
export async function getCallDetails(callSid: string): Promise<CallLogEntry | null> {
  try {
    const response = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${CALLING_ACCOUNT_SID}/Calls/${callSid}.json`,
      {
        auth: {
          username: CALLING_ACCOUNT_SID || '',
          password: CALLING_API_KEY || '',
        },
      }
    )

    const data = response.data

    return {
      callSid: data.sid,
      from: data.from,
      to: data.to,
      duration: parseInt(data.duration) || 0,
      status: data.status === 'completed' ? 'completed' : 'failed',
      timestamp: data.date_created,
    }
  } catch (error) {
    console.error('Error fetching call details:', error)
    return null
  }
}

/**
 * Format phone number to E.164 format (required by Twilio)
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Add country code if not present (assuming US +1)
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`
  } else if (!cleaned.startsWith('+')) {
    return `+${cleaned}`
  }

  return cleaned
}
