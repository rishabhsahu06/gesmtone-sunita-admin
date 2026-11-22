/** Shared stone form state + API mapping for create/edit */

export const INITIAL_STONE_FORM = {
  name: "",
  description: "",
  originalPrice: "",
  discountedPrice: "",
  primaryCategory: "",
  primaryCategoryImage: "",
  secondaryCategory: "",
  stock: "",
  weight: "",
  weightRatti: "",
  weightCarat: "",
  shape: "",
  origin: "",
  certification: "",
  poojaEnergization: "",
  colour: "",
  treatment: "",
  treatmentType: "",
  composition: "",
  returnPolicy: "",
  dimensionType: "",
  dimensions: {
    length: "",
    width: "",
    height: "",
  },
  specificGravity: "",
  isAvailable: true,
  productBenefits: [],
  images: [],
};

const toStr = (value) =>
  value === null || value === undefined ? "" : String(value);

const toNum = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export function mapProductToForm(product = {}) {
  return {
    ...INITIAL_STONE_FORM,
    name: toStr(product.name),
    description: toStr(product.description),
    originalPrice: toStr(product.originalPrice),
    discountedPrice: toStr(product.discountedPrice),
    primaryCategory: toStr(product.primaryCategory),
    primaryCategoryImage: toStr(product.primaryCategoryImage),
    secondaryCategory: toStr(product.secondaryCategory),
    stock: toStr(product.stock),
    weight: toStr(product.weight),
    weightRatti: toStr(product.weightRatti),
    weightCarat: toStr(product.weightCarat),
    shape: toStr(product.shape),
    origin: toStr(product.origin),
    certification: toStr(product.certification),
    poojaEnergization: toStr(product.poojaEnergization),
    colour: toStr(product.colour),
    treatment: toStr(product.treatment),
    treatmentType: toStr(product.treatmentType),
    composition: toStr(product.composition),
    returnPolicy: toStr(product.returnPolicy),
    dimensionType: toStr(product.dimensionType),
    dimensions: {
      length: toStr(product.dimensions?.length),
      width: toStr(product.dimensions?.width),
      height: toStr(product.dimensions?.height),
    },
    specificGravity: toStr(product.specificGravity),
    isAvailable: product.isAvailable ?? true,
    productBenefits: Array.isArray(product.productBenefits)
      ? product.productBenefits
      : [],
    images: Array.isArray(product.images) ? product.images : [],
  };
}

function prepareDimensions(dimensions = {}) {
  const { length, width, height } = dimensions;
  if (!length && !width && !height) return undefined;
  return {
    length: length ? Number.parseFloat(length) : 0,
    width: width ? Number.parseFloat(width) : 0,
    height: height ? Number.parseFloat(height) : 0,
  };
}

/**
 * Build create/update API payload from form state.
 * @param {object} form
 * @param {{ requireImages?: boolean }} [options]
 */
export function buildStonePayload(form, options = {}) {
  const { requireImages = false } = options;

  const payload = {
    productType: "gemstone",
    name: form.name?.trim() || undefined,
    description: form.description?.trim() || undefined,
    originalPrice: toNum(form.originalPrice),
    discountedPrice: toNum(form.discountedPrice),
    primaryCategory: form.primaryCategory?.trim() || undefined,
    primaryCategoryImage: form.primaryCategoryImage?.trim() || undefined,
    secondaryCategory: form.secondaryCategory?.trim() || undefined,
    stock: toNum(form.stock),
    weight: toNum(form.weight),
    weightRatti: toNum(form.weightRatti),
    weightCarat: toNum(form.weightCarat),
    shape: form.shape?.trim() || undefined,
    origin: form.origin?.trim() || undefined,
    certification: form.certification?.trim() || undefined,
    poojaEnergization: form.poojaEnergization?.trim() || undefined,
    colour: form.colour?.trim() || undefined,
    treatment: form.treatment?.trim() || undefined,
    treatmentType: form.treatmentType?.trim() || undefined,
    composition: form.composition?.trim() || undefined,
    returnPolicy: form.returnPolicy?.trim() || undefined,
    dimensionType: form.dimensionType?.trim() || undefined,
    dimensions: prepareDimensions(form.dimensions),
    specificGravity: toNum(form.specificGravity),
    isAvailable: form.isAvailable,
    images: form.images?.length ? form.images : undefined,
    productBenefits: form.productBenefits?.length
      ? form.productBenefits
      : undefined,
  };

  if (requireImages && !payload.images?.length) {
    throw new Error("Please upload at least one stone photo.");
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

/** Fields needed for stones/jewellery admin tables */
export const ADMIN_LIST_FIELDS = [
  "name",
  "slug",
  "description",
  "originalPrice",
  "discountedPrice",
  "primaryCategory",
  "secondaryCategory",
  "stock",
  "isAvailable",
  "weight",
  "weightRatti",
  "weightCarat",
  "shape",
  "origin",
  "images",
  "jewelleryType",
  "metal",
  "jewelleryTag",
  "goldPurity",
  "size",
  "productType",
].join(",");

export function mapStoneListItem(product) {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.discountedPrice || product.originalPrice,
    originalPrice: product.originalPrice,
    discountedPrice: product.discountedPrice,
    category: product.primaryCategory,
    secondaryCategory: product.secondaryCategory,
    stock: product.stock,
    weight: product.weight,
    weightRatti: product.weightRatti,
    weightCarat: product.weightCarat,
    shape: product.shape,
    origin: product.origin,
    images: product.images,
    isAvailable: product.isAvailable,
  };
}

export function mapJewelleryListItem(item) {
  return {
    id: item._id,
    name: item.name,
    description: item.description,
    price: item.discountedPrice || item.originalPrice,
    originalPrice: item.originalPrice,
    discountedPrice: item.discountedPrice,
    jewelleryType: item.jewelleryType,
    metal: item.metal,
    jewelleryTag: item.jewelleryTag,
    goldPurity: item.goldPurity,
    size: item.size,
    stock: item.stock,
    images: item.images,
    isAvailable: item.isAvailable,
  };
}
