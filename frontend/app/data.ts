export type ProductSection = "medicines" | "health" | "personal" | "wellness";

export type Product = {
  id: string;
  name: string;
  type: string;
  section: ProductSection;
  form: string;
  price: number;
  old: number;
  rating: number;
  reviews: number;
  stock: number;
  rx: boolean;
  description: string;
  usage: string;
  safety: string;
  sheet: string;
  spriteIndex: number;
  columns: number;
  rows: number;
  cellRatio: string;
};

const commonUsage = "Read the pack instructions carefully and use only the recommended amount. Ask a pharmacist if you are unsure.";
const commonSafety = "Keep out of reach of children, store in a cool dry place and do not use after the expiry date.";

function product(
  id: string,
  name: string,
  type: string,
  section: ProductSection,
  form: string,
  price: number,
  old: number,
  rating: number,
  reviews: number,
  stock: number,
  rx: boolean,
  description: string,
  sheet: string,
  spriteIndex: number,
  rows: number,
  cellRatio = "1 / 1",
): Product {
  return {
    id, name, type, section, form, price, old, rating, reviews, stock, rx,
    description, usage: commonUsage, safety: commonSafety, sheet, spriteIndex,
    columns: 4, rows, cellRatio,
  };
}

const medicineSheet = "/assets/medicine-sprite.png";
const healthSheet = "/assets/health-sprite.png";
const personalSheet = "/assets/personal-sprite.png";
const wellnessSheet = "/assets/wellness-sprite.png";

export const products: Product[] = [
  product("paracetamol", "Paracetamol 500mg", "Pain Relief", "medicines", "20 Tablets", 180, 220, 4.8, 128, 42, false, "Temporary relief for mild to moderate pain, headaches, body aches and fever.", medicineSheet, 0, 3),
  product("cetirizine", "Cetirizine 10mg", "Cold & Allergy", "medicines", "10 Tablets", 320, 360, 4.7, 96, 24, false, "Helps relieve common allergy symptoms including sneezing, itchy eyes and a runny nose.", medicineSheet, 1, 3),
  product("vitamin-d3", "Vitamin D3 1000 IU", "Vitamins", "medicines", "30 Capsules", 650, 720, 4.9, 134, 18, false, "Supports healthy bones, teeth, muscles and normal immune function.", medicineSheet, 2, 3),
  product("ibuprofen", "Ibuprofen 400mg", "Pain Relief", "medicines", "10 Tablets", 250, 280, 4.6, 112, 31, false, "Provides temporary relief from pain, inflammation and fever when used as directed.", medicineSheet, 3, 3),
  product("azithromycin", "Azithromycin 500mg", "Prescription", "medicines", "3 Tablets", 980, 1050, 4.7, 75, 12, true, "A prescription antibiotic supplied only after pharmacist verification of a valid prescription.", medicineSheet, 4, 3),
  product("omega-3", "Omega 3 Fish Oil", "Vitamins", "medicines", "30 Softgels", 1450, 1600, 4.8, 89, 16, false, "Omega-3 fish oil supplement supporting heart, brain and general wellbeing.", medicineSheet, 5, 3),
  product("vitamin-c", "Vitamin C 1000mg", "Vitamins", "medicines", "30 Tablets", 890, 950, 4.8, 106, 27, false, "Daily vitamin C support for immunity and antioxidant protection.", medicineSheet, 6, 3),
  product("calcium-d", "Calcium + Vitamin D", "Vitamins", "medicines", "60 Tablets", 1250, 1380, 4.7, 68, 19, false, "Supports strong bones and teeth as part of a balanced diet.", medicineSheet, 7, 3),
  product("cough-syrup", "Cough Relief Syrup", "Cold & Allergy", "medicines", "100ml Bottle", 480, 530, 4.6, 54, 23, false, "A soothing formulation for temporary cough relief.", medicineSheet, 8, 3),
  product("antiseptic", "Antiseptic Solution", "First Aid", "medicines", "100ml Bottle", 380, 420, 4.7, 47, 35, false, "For cleansing minor cuts, grazes and everyday skin wounds.", medicineSheet, 9, 3),
  product("thermometer", "Digital Thermometer", "Health Devices", "medicines", "1 Unit", 850, 920, 4.8, 83, 14, false, "A convenient digital thermometer for quick temperature readings at home.", medicineSheet, 10, 3),
  product("first-aid-kit", "First Aid Kit", "First Aid", "medicines", "Complete Kit", 1650, 1800, 4.9, 72, 9, false, "A compact kit containing essential supplies for minor everyday injuries.", medicineSheet, 11, 3),

  product("health-thermometer", "Digital Thermometer Pro", "Health Devices", "health", "1 Unit", 1050, 1190, 4.8, 91, 16, false, "Fast, clear temperature readings for reliable home monitoring.", healthSheet, 0, 2),
  product("health-first-aid", "Family First Aid Kit", "First Aid", "health", "Complete Kit", 1950, 2180, 4.9, 66, 10, false, "A family-sized first aid kit for home, travel and everyday emergencies.", healthSheet, 1, 2),
  product("face-masks", "Surgical Face Masks", "Hygiene", "health", "50 Masks", 950, 1080, 4.7, 84, 30, false, "Comfortable disposable masks for daily hygiene and protection.", healthSheet, 2, 2),
  product("antiseptic-plus", "Antiseptic Solution Plus", "First Aid", "health", "200ml Bottle", 620, 690, 4.7, 59, 29, false, "A practical antiseptic solution for household first aid care.", healthSheet, 3, 2),
  product("bp-monitor", "Blood Pressure Monitor", "Health Devices", "health", "1 Unit", 6850, 7250, 4.8, 102, 6, false, "Automatic upper-arm blood pressure monitoring with a clear digital display.", healthSheet, 4, 2),
  product("glucose-meter", "Glucose Meter Set", "Health Devices", "health", "Complete Set", 3950, 4250, 4.7, 77, 8, false, "A complete home blood-glucose monitoring starter set.", healthSheet, 5, 2),
  product("hand-sanitizer", "Hand Sanitizer", "Hygiene", "health", "250ml Bottle", 460, 510, 4.6, 49, 40, false, "Quick-drying hand sanitizer for convenient everyday hygiene.", healthSheet, 6, 2),
  product("hot-water-bottle", "Hot Water Bottle", "Home Care", "health", "2 Litre", 1250, 1390, 4.7, 63, 16, false, "A durable hot water bottle for warmth and temporary comfort.", healthSheet, 7, 2),

  product("face-cleanser", "Daily Face Cleanser", "Skin Care", "personal", "150ml Bottle", 1250, 1390, 4.8, 92, 22, false, "A gentle daily cleanser that removes dirt and excess oil.", personalSheet, 0, 2),
  product("moisturiser", "Moisturising Lotion", "Skin Care", "personal", "200ml Bottle", 1450, 1590, 4.9, 118, 18, false, "Lightweight daily hydration for smooth and comfortable skin.", personalSheet, 1, 2),
  product("herbal-shampoo", "Herbal Shampoo", "Hair Care", "personal", "200ml Bottle", 1180, 1320, 4.7, 86, 25, false, "Gentle herbal shampoo for regular hair and scalp cleansing.", personalSheet, 2, 2),
  product("conditioner", "Hair Conditioner", "Hair Care", "personal", "180ml Bottle", 1260, 1380, 4.6, 71, 20, false, "Helps leave hair feeling soft, smooth and manageable.", personalSheet, 3, 2),
  product("toothpaste", "Fluoride Toothpaste", "Oral Care", "personal", "120g Tube", 490, 540, 4.8, 104, 38, false, "Everyday fluoride toothpaste for cavity protection and fresh breath.", personalSheet, 4, 2),
  product("toothbrush", "Soft Toothbrush Twin Pack", "Oral Care", "personal", "2 Brushes", 420, 470, 4.7, 67, 32, false, "Soft-bristle toothbrushes for comfortable daily cleaning.", personalSheet, 5, 2),
  product("baby-lotion", "Baby Care Lotion", "Baby Care", "personal", "200ml Bottle", 1350, 1490, 4.9, 88, 17, false, "Mild moisturising lotion developed for delicate baby skin.", personalSheet, 6, 2),
  product("baby-wash", "Gentle Baby Wash", "Baby Care", "personal", "250ml Bottle", 1480, 1620, 4.8, 74, 15, false, "A gentle head-to-toe baby wash for everyday cleansing.", personalSheet, 7, 2),

  product("multivitamin", "Daily Multivitamin", "Vitamins", "wellness", "30 Tablets", 1180, 1290, 4.8, 99, 22, false, "A convenient daily multivitamin to support general wellbeing.", wellnessSheet, 0, 2, "3 / 4"),
  product("wellness-vitamin-c", "Vitamin C 1000mg", "Vitamins", "wellness", "30 Tablets", 890, 950, 4.9, 121, 27, false, "Daily vitamin C support for immunity and antioxidant protection.", wellnessSheet, 1, 2, "3 / 4"),
  product("wellness-omega", "Omega 3 Fish Oil", "Nutrition", "wellness", "30 Softgels", 1450, 1600, 4.8, 95, 16, false, "Nutritional omega-3 support for an active lifestyle.", wellnessSheet, 2, 2, "3 / 4"),
  product("protein", "Protein Nutrition Powder", "Nutrition", "wellness", "500g Pack", 3850, 4200, 4.7, 82, 12, false, "Protein nutrition powder for an active and balanced routine.", wellnessSheet, 3, 2, "3 / 4"),
  product("yoga-mat", "Yoga Exercise Mat", "Fitness", "wellness", "1 Mat", 2750, 3100, 4.8, 64, 10, false, "Comfortable exercise mat for yoga, stretching and home workouts.", wellnessSheet, 4, 2, "3 / 4"),
  product("resistance-bands", "Resistance Band Set", "Fitness", "wellness", "5 Bands", 1850, 2050, 4.6, 58, 14, false, "Five resistance levels for strength, mobility and home exercise.", wellnessSheet, 5, 2, "3 / 4"),
  product("sleep-tea", "Herbal Sleep Tea", "Sleep Support", "wellness", "20 Tea Bags", 980, 1080, 4.7, 79, 19, false, "A calming herbal tea blend for a relaxing evening routine.", wellnessSheet, 6, 2, "3 / 4"),
  product("eye-mask", "Sleep Eye Mask", "Sleep Support", "wellness", "1 Unit", 650, 720, 4.6, 52, 28, false, "Soft eye mask designed to block unwanted light during sleep.", wellnessSheet, 7, 2, "3 / 4"),
];

export const productById = (id: string) => products.find((item) => item.id === id);
export const productsBySection = (section: ProductSection) => products.filter((item) => item.section === section);

export const sectionDetails = {
  health: {
    title: "Health Essentials",
    eyebrow: "EVERYDAY HEALTHCARE",
    description: "Trusted devices, hygiene and first-aid essentials for your home and family.",
    icon: "✚",
  },
  personal: {
    title: "Personal Care",
    eyebrow: "CARE FOR EVERY DAY",
    description: "Gentle skin, hair, oral and baby-care products for the whole family.",
    icon: "◌",
  },
  wellness: {
    title: "Wellness",
    eyebrow: "LIVE WELL EVERY DAY",
    description: "Nutrition, fitness and sleep-support products for a healthier daily routine.",
    icon: "⌁",
  },
};
