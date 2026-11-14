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
   * Saves the order, its lines and the new stocks in one transaction: all or nothing.
   * Returns null if the stock of one product is too low when its row is locked.
   */
  async create({ number, userId, lines, shippingMethod, totalCents, address }) {
    const transaction = await sequelize.transaction()

    try {
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

      for (const line of lines) {
        const productRow = await ProductModel.findByPk(line.product.id, { transaction, lock: true })
        if (productRow.stock < line.quantity) {
          await transaction.rollback()
          return null
        }

        await OrderItemModel.create(
          {
            orderId: orderRow.id,
            productId: line.product.id,
            quantity: line.quantity,
            unitPriceCents: line.product.unitPriceCents,
            vatRateBp: line.product.vatRateBp,
            productName: line.product.name,
          },
          { transaction },
        )

        await productRow.decrement('stock', { by: line.quantity, transaction })
      }

      await transaction.commit()
      return { id: orderRow.id, number, status: 'pending', totalCents }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
