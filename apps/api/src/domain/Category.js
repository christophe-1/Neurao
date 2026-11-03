export default class Category {
  constructor({ id, name, slug, position }) {
    if (!Number.isInteger(position) || position < 0) {
      throw new Error('position doit être un entier supérieur ou égal à 0')
    }

    this.id = id
    this.name = name
    this.slug = slug
    this.position = position
  }
}
