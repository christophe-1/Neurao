import sequelize from '../database/sequelize.js'
import {
  Order as OrderModel,
  OrderItem as OrderItemModel,
  Product as ProductModel,
  ShippingMethod as ShippingMethodModel,
} from '../database/models/index.js'

/** Creates orders in MySQL with Sequelize, inside a transaction. */
export default class SequelizeOrderRepository {
  /** Returns the first active shipping method (id, name, priceCents). */
  async findDefaultShippingMethod() {
    const row = await ShippingMethodModel.findOne({
      where: { isActive: true },
      order: [['id', 'ASC']],
    })
    if (row === null) {
      throw new Error('Aucun mode de livraison actif : lancer les seeders')
    }
    return { id: row.id, name: row.name, priceCents: row.priceCents }
  }

  /**
   * Saves the order, its line and the new stock in one transaction: all or nothing.
   * Returns null if the stock is too low when the product row is locked.
   */
  async create({ number, userId, product, quantity, shippingMethod, totalCents, address }) {
    const transaction = await sequelize.transaction()

    try {
      const productRow = await ProductModel.findByPk(product.id, { transaction, lock: true })
      if (productRow.stock < quantity) {
        await transaction.rollback()
        return null
      }

      const orderRow = await OrderModel.create(
        {
          number,
          status: 'pending',
          shippingCostCents: shippingMethod.priceCents,
          totalCents,
          shippingName: address.fullName,
          shippingAddress: address.address,
          shippingPostalCode: address.postalCode,
          shippingCity: address.city,
          shippingCountryCode: address.countryCode,
          billingName: address.fullName,
          billingAddress: address.address,
          billingPostalCode: address.postalCode,
          billingCity: address.city,
          billingCountryCode: address.countryCode,
          userId,
          shippingMethodId: shippingMethod.id,
        },
        { transaction },
      )

      await OrderItemModel.create(
        {
          orderId: orderRow.id,
          productId: product.id,
          quantity,
          unitPriceCents: product.unitPriceCents,
          vatRateBp: product.vatRateBp,
          productName: product.name,
        },
        { transaction },
      )

      await productRow.decrement('stock', { by: quantity, transaction })

      await transaction.commit()
      return { id: orderRow.id, number, status: 'pending', totalCents }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
