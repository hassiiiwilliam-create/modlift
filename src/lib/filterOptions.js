const DRIVETRAIN_OPTIONS = [
  { value: 'AWD', label: 'AWD (All Wheel Drive)' },
  { value: '4WD', label: '4WD (4x4)' },
  { value: 'FWD', label: 'FWD (Front Wheel)' },
  { value: 'RWD', label: 'RWD (Rear Wheel)' },
]

const FITMENT_PREFERENCES = [
  { value: 'factory', label: 'Factory / OEM+' },
  { value: 'flush', label: 'Flush' },
  { value: 'poke', label: 'Poke' },
  { value: 'tucked', label: 'Tucked' },
  { value: 'aggressive', label: 'Aggressive' },
  { value: 'no_rub', label: 'No Rub / No Trim' },
  { value: 'minor_trim', label: 'Minor Trim OK' },
]

const PRODUCT_TAGS = [
  { value: 'new_arrival', label: 'New Arrival' },
  { value: 'best_seller', label: 'Best Seller' },
  { value: 'lift_compatible', label: 'Lift Kit Compatible' },
  { value: 'limited', label: 'Limited Edition' },
  { value: 'discounted', label: 'Discounted' },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getDrivetrainOptions() {
  // simulate async call for future data source
  await delay(50)
  return DRIVETRAIN_OPTIONS
}

export async function getFitmentPreferences() {
  await delay(50)
  return FITMENT_PREFERENCES
}

export async function getProductTags() {
  await delay(50)
  return PRODUCT_TAGS
}
