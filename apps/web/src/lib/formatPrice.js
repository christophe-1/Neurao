const CENTS_PER_EURO = 100

const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

export default function formatPrice(cents) {
  return euroFormatter.format(cents / CENTS_PER_EURO)
}
