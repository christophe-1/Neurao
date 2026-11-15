const ROLES = ['customer', 'manager', 'admin']

/**
 * A customer, manager or admin account.
 * The constructor refuses any role outside the allowed list.
 */
export default class User {
  constructor({ id, email, passwordHash, firstName, lastName, role }) {
    if (!ROLES.includes(role)) {
      throw new Error('role doit être customer, manager ou admin')
    }

    this.id = id
    this.email = email
    this.passwordHash = passwordHash
    this.firstName = firstName
    this.lastName = lastName
    this.role = role
  }

  /** Returns the user without the password hash, safe to send to the browser. */
  toPublic() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    }
  }
}
