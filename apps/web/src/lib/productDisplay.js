/** Returns the colour of the range of a product from the start of its name, as in the mock-ups. */
export function rangeColor(name) {
  if (name.startsWith('Focus')) {
    return 'corail'
  }
  if (name.startsWith('Vital')) {
    return 'orange'
  }
  if (name.startsWith('Flora')) {
    return 'turquoise'
  }
  if (name.startsWith('MgPlus')) {
    return 'lavande'
  }
  return 'miel'
}

/** Returns the minimum age written in the description ("dès 11 ans" or "dès 4 ans"), or null. */
export function minimumAge(description) {
  if (description.includes('dès 11 ans')) {
    return 'dès 11 ans'
  }
  if (description.includes('dès 4 ans')) {
    return 'dès 4 ans'
  }
  return null
}
