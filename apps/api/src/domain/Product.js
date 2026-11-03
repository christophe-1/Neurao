export default class Product {
  constructor({
    id,
    reference,
    name,
    slug,
    description,
    unitPriceCents,
    vatRateBp,
    image,
    stock,
    isActive,
    categoryId,
  }) {
    if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) {
      throw new Error('unitPriceCents doit être un entier supérieur ou égal à 0')
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('stock doit être un entier supérieur ou égal à 0')
    }
    if (isActive !== true && isActive !== false) {
      throw new Error('isActive doit être vrai ou faux')
    }

    this.id = id
    this.reference = reference
    this.name = name
    this.slug = slug
    this.description = description
    this.unitPriceCents = unitPriceCents
    this.vatRateBp = vatRateBp
    this.image = image
    this.stock = stock
    this.isActive = isActive
    this.categoryId = categoryId
  }

  isAvailable() {
    return this.isActive === true && this.stock > 0
  }
}
