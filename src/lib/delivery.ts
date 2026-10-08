import { JaipurValidationResult } from '@/types';

export const FREE_DELIVERY_THRESHOLD = 1499;
export const STANDARD_DELIVERY_CHARGE = 49;

/**
 * Calculates delivery charge based on the strict Royes Creations business rule:
 * - Subtotal <= ₹1499 => ₹49 delivery charge
 * - Subtotal > ₹1499  => ₹0 (FREE delivery)
 */
export function calculateDeliveryCharge(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal > FREE_DELIVERY_THRESHOLD) {
    return 0;
  }
  return STANDARD_DELIVERY_CHARGE;
}

/**
 * Amount remaining to unlock free delivery
 */
export function getAmountNeededForFreeDelivery(subtotal: number): number {
  if (subtotal <= 0) return FREE_DELIVERY_THRESHOLD + 1;
  if (subtotal > FREE_DELIVERY_THRESHOLD) return 0;
  return FREE_DELIVERY_THRESHOLD + 1 - subtotal;
}

/**
 * Jaipur Area Lookup with PIN codes
 */
export const JAIPUR_PINCODES: Record<string, string> = {
  '302001': 'C-Scheme / Ashok Nagar / GPO',
  '302002': 'Tripolia Bazar / City Palace / Johari Bazar',
  '302003': 'Chandpole / Chokhi Dhani Road / Subhash Nagar',
  '302004': 'Raja Park / Adarsh Nagar / Tilak Nagar',
  '302005': 'Bapu Nagar / Gandhi Nagar / JLN Marg',
  '302006': 'Civil Lines / Sodala / Swej Farm',
  '302007': 'Sindhi Camp / Station Road / Sansar Chandra Road',
  '302011': 'Tonk Phatak / Barkat Nagar',
  '302012': 'Jhotwara / Khatipura / Ambabari',
  '302013': 'Murlipura / Harmada / Dahar Ka Balaji',
  '302015': 'Tonk Road / Bajaj Nagar / Mahaveer Nagar',
  '302016': 'Bani Park / Kanti Nagar',
  '302017': 'Malviya Nagar / Jagatpura Road / Calgiri Marg',
  '302018': 'Lal Kothi / Jyoti Nagar / Vidhan Sabha',
  '302019': 'Shyam Nagar / Nirman Nagar / Janpath',
  '302020': 'Mansarovar / New Aatish Market / Shipra Path',
  '302021': 'Vaishali Nagar / Chitrakoot / Hanuman Nagar',
  '302022': 'Sitapura Industrial Area / RIICO / Pratap Nagar Sector 1-10',
  '302023': 'VKI Area / Vishwakarma Industrial Area',
  '302024': 'Heera Pura / Ajmer Road / DCM',
  '302025': 'Pratap Nagar / Haldighati Marg / Sanganer Extension',
  '302026': 'Mahapura / SEZ / Mahindra World City',
  '302027': 'Kukas / Delhi Road / Amer Extension',
  '302028': 'Amer / Amber Fort Area',
  '302029': 'Sanganer Town / Diggi Road / Airport Area',
  '302030': 'Sirsi Road / Bindayaka',
  '302031': 'Bhakrota / Mahapura Link Road',
  '302032': 'Ajitgarh / Shahpura Link',
  '302033': 'Pratap Nagar Housing Board / Kumbha Marg',
  '302034': 'Muhana Mandi / Diggi Malpura Road',
  '302039': 'Vidhyadhar Nagar / Sector 1-9 / Alka Cinema',
};

/**
 * Validates if the given pincode and city are legitimately in Jaipur, Rajasthan
 */
export function validateJaipurLocation(
  pincode: string,
  city?: string,
  state?: string
): JaipurValidationResult {
  const cleanPin = pincode ? pincode.trim().replace(/\s+/g, '') : '';
  const cleanCity = city ? city.trim().toLowerCase() : '';
  const cleanState = state ? state.trim().toLowerCase() : '';

  // 1. PIN code format check (6 digits)
  if (!/^\d{6}$/.test(cleanPin)) {
    return {
      isValid: false,
      message: 'Please enter a valid 6-digit PIN code.',
    };
  }

  // 2. State validation (if provided)
  if (cleanState && !['rajasthan', 'raj', 'rj'].includes(cleanState)) {
    return {
      isValid: false,
      message: 'Royes Creations currently ships only within Jaipur, Rajasthan.',
    };
  }

  // 3. City validation (if provided)
  if (cleanCity && !cleanCity.includes('jaipur')) {
    return {
      isValid: false,
      message: 'Delivery is currently available exclusively within Jaipur city.',
    };
  }

  // 4. PIN code range check
  // Known Jaipur urban pincodes: 302001 - 302039
  // Peri-urban / rural Jaipur pincodes: 303001 - 303999
  const isUrbanJaipur = cleanPin.startsWith('302');
  const isGreaterJaipur = cleanPin.startsWith('303');

  if (isUrbanJaipur || isGreaterJaipur) {
    const areaName = JAIPUR_PINCODES[cleanPin] || (isUrbanJaipur ? 'Jaipur City' : 'Jaipur Rural / Outer');
    return {
      isValid: true,
      message: `Verified delivery address in ${areaName}`,
      areaName,
    };
  }

  return {
    isValid: false,
    message: `PIN code ${cleanPin} is outside our Jaipur delivery network. We currently deliver exclusively within Jaipur.`,
  };
}
