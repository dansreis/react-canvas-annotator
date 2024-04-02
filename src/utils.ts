import { PiRectangle, PiCircle, PiCoffeeThin } from "react-icons/pi";
import { IoHandRightOutline } from "react-icons/io5";
import { LiaMousePointerSolid } from "react-icons/lia";
import { FaDrawPolygon } from "react-icons/fa";
import { GrZoomIn, GrZoomOut } from "react-icons/gr";
import { TbZoomReset } from "react-icons/tb";
import { TbMessageOff, TbMessage } from "react-icons/tb";
import { ImPriceTags } from "react-icons/im";
import { CgUnavailable } from "react-icons/cg";

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

export const AvailableIcons = {
  rectangle: PiRectangle,
  circle: PiCircle,
  hand: IoHandRightOutline,
  pointer: LiaMousePointerSolid,
  polygon: FaDrawPolygon,
  zoomIn: GrZoomIn,
  zoomOut: GrZoomOut,
  zoomReset: TbZoomReset,
  annotation: TbMessage,
  annotationDisabled: TbMessageOff,
  tags: ImPriceTags,
  coffee: PiCoffeeThin,
  unavailable: CgUnavailable,
};
