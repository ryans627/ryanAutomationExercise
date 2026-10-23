/**
 * Shared test fixtures.
 * Kept separate from `constants.ts`, which holds app-level constants only.
 */

/** Product catalog. */
export const CATALOG = [
  { name: "After Hours Hoodie", slug: "sauce-labs-hoodie", category: "Apparel", price: 44.99 },
  { name: "Bolt T-Shirt", slug: "bolt-t-shirt", category: "Apparel", price: 15.99 },
  { name: "Branch Point Decals", slug: "qa-sticker-pack", category: "Accessories", price: 4.99 },
  { name: "Bug Hunt Crew Socks", slug: "debug-socks", category: "Accessories", price: 8.99 },
  { name: "Daybreak Ceramic Mug", slug: "sauce-labs-mug", category: "Accessories", price: 14.99 },
  { name: "Gridline Journal", slug: "lab-notebook", category: "Accessories", price: 12.99 },
  { name: "Little Trek Bodysuit", slug: "onesie", category: "Apparel", price: 7.99 },
  { name: "Nightline Safety Light", slug: "bike-light", category: "Gear", price: 9.99 },
  { name: "Side Quest Tee", slug: "all-the-things-t-shirt", category: "Apparel", price: 15.99 },
  { name: "Signal Path Field Guide", slug: "automation-handbook", category: "Books", price: 24.99 },
  { name: "Summit Fleece", slug: "fleece-jacket", category: "Apparel", price: 49.99 },
  { name: "Trailmark Day Pack", slug: "backpack", category: "Gear", price: 29.99 },
] as const;

/** Default shipping information used across checkout and mobile specs. */
export const SHIPPING_INFO = {
  firstName: "Ada",
  lastName: "Lovelace",
  postalCode: "94016",
} as const;
