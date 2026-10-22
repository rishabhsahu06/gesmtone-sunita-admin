export const JEWELLERY_TYPES = [
  { id: "rings", name: "Rings" },
  { id: "pendants", name: "Pendants" },
  { id: "necklaces", name: "Necklaces" },
  { id: "bracelets", name: "Bracelets" },
  { id: "earrings", name: "Earrings" },
  { id: "anklets", name: "Anklets" },
  { id: "chokers", name: "Chokers" },
];

export const JEWELLERY_METALS = [
  { id: "gold", name: "Gold" },
  { id: "silver", name: "Silver" },
  { id: "platinum", name: "Platinum" },
  { id: "rose-gold", name: "Rose Gold" },
];

export const JEWELLERY_TAGS = [
  { id: "all", name: "All" },
  { id: "new", name: "New Arrivals" },
  { id: "popular", name: "Popular" },
  { id: "sale", name: "On Sale" },
];

export const GOLD_PURITIES = ["14k", "18k", "22k"];

export const formatJewelleryLabel = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};
