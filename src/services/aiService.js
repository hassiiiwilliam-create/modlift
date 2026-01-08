import { supabase } from '../supabaseClient'

/**
 * Send chat messages to the AI assistant via Supabase Edge Function
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<{message: string, role: string}>} - AI response
 */
export const sendChatMessage = async (messages) => {
  const { data, error } = await supabase.functions.invoke('chat', {
    body: { messages }
  })

  if (error) {
    console.error('AI service error:', error)
    throw error
  }

  return data
}
