export const arrayToRGBA = (hex: string, alpha: number) => {
  // Remove '#' if present
  const tmpHex = hex.replace("#", "");

  // Parse hexadecimal color
  const bigint = parseInt(tmpHex, 16);

  // Extract RGB components
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Construct RGBA string
  return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
