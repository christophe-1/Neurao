import bcrypt from 'bcrypt'

/**
 * Checks the email and password, then opens a session in Redis.
 * Returns null for an unknown email or a wrong password.
 */
export default async function loginUser(userRepository, sessionRepository, { email, password }) {
  const user = await userRepository.findByEmail(email)
  if (user === null) {
    return null
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) {
    return null
  }

  const sessionId = await sessionRepository.create({ userId: user.id, role: user.role })
  return { user, sessionId }
}
