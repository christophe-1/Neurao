const ROLES = ['customer', 'manager', 'admin']

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
