import { getCurrentUser, getCachedUser, getAuthToken } from '@/lib/auth'

// Test authentication debugging
export const debugAuth = async () => {
  console.log('=== AUTH DEBUG ===')
  
  // Check token
  const token = getAuthToken()
  console.log('1. Token exists:', token ? 'YES' : 'NO')
  
  // Check cached user
  const cachedUser = getCachedUser()
  console.log('2. Cached user:', cachedUser ? 'EXISTS' : 'NOT FOUND')
  if (cachedUser) {
    console.log('   Cached user data:', cachedUser)
  }
  
  // Check API call
  if (token) {
    console.log('3. Testing API call to /auth/me...')
    try {
      const apiUser = await getCurrentUser()
      console.log('   API result:', apiUser ? 'SUCCESS' : 'FAILED')
      if (apiUser) {
        console.log('   API user data:', apiUser)
      }
    } catch (error) {
      console.log('   API error:', error)
    }
  } else {
    console.log('3. Skipping API call (no token)')
  }
  
  console.log('=== END AUTH DEBUG ===')
}

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth
}
