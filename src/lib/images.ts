function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+field$/g, "")
    .replace(/\s+planter$/g, "")
    .replace(/\s+/g, "_");
}

const planterFileNames: Record<string, string> = {
  "Plastic Planter": "plastic_planter",
  "Candy Planter": "candy_planter",
};

export function getWaxImageUrl(wax: string): string {
  return `/images/waxes/${toSlug(wax.replace(/\s+wax$/i, ""))}.png`;
}

export function getPlanterImageUrl(planter: string): string {
  return `/images/planters/${planterFileNames[planter] ?? toSlug(planter)}.png`;
}

export function getFieldImageUrl(field: string): string {
  return `/images/fields/${toSlug(field)}.png`;
}
