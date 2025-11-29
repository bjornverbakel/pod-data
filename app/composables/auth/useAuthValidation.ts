export const useAuthValidation = () => {
  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Please enter your email.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address.'
    return null
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Please enter a password.'
    if (password.length < 6) return 'Password must be at least 6 characters long'

    const hasLetter = /[a-zA-Z]/.test(password)
    const hasDigit = /\d/.test(password)

    if (!hasLetter || !hasDigit) {
      return 'Password must contain at least one letter and one number'
    }
    return null
  }

  const validatePasswordMatch = (p1: string, p2: string) => {
    if (p1 !== p2) return 'Passwords do not match'
    return null
  }

  const validateRequired = (fields: Record<string, any>) => {
    for (const value of Object.values(fields)) {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Please fill in all required fields.'
      }
    }
    return null
  }

  const validateCaptcha = (token: string) => {
    if (!token) return 'Please complete the security check'
    return null
  }

  const validateUsername = (username: string) => {
    if (!username) return 'Please enter a username.'
    if (username.length > 32) return 'Username must be 32 characters or less.'
    const usernameRegex = /^[a-z0-9_-]+$/
    if (!usernameRegex.test(username)) return 'Username contains invalid characters.'
    return null
  }

  const resolveAuthError = (error: any) => {
    if (!error) return null

    // const msg = error.message?.toLowerCase() || ''
    // // Handle rate limiting/timeout errors
    // if ((error as any).status === 429 || msg.includes('too many requests') || msg.includes('rate limit')) {
    //   return 'Too many requests. Please wait a moment before trying again.'
    // }

    // Return original message for other errors
    return error.message
  }

  return {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateRequired,
    validateCaptcha,
    validateUsername,
    resolveAuthError,
  }
}
