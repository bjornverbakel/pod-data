export default defineEventHandler(async (event) => {
  const { token } = await readBody(event)

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is required',
    })
  }

  const validation = await verifyTurnstileToken(token)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid captcha token',
    })
  }

  return { success: true }
})
