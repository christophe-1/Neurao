const CENTS_PER_EURO = 100

const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

/** Formats a price in cents as euros, for example 2490 → "24,90 €". */
export default function formatPrice(cents) {
  return euroFormatter.format(cents / CENTS_PER_EURO)
}
