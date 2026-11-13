import bcrypt from 'bcrypt'

const BCRYPT_COST = 10

/**
 * Creates a customer account with a bcrypt-hashed password.
 * Returns null if the email is already used.
 */
export default async function registerUser(
  userRepository,
  { email, password, firstName, lastName },
) {
  const existingUser = await userRepository.findByEmail(email)
  if (existingUser !== null) {
    return null
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

  const user = await userRepository.create({
    email,
    passwordHash,
    firstName,
    lastName,
    role: 'customer',
  })
  return user
}
