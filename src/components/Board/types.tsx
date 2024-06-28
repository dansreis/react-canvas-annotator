export type CanvasObject = {
  id: string;
  color: string;
  selectable?: boolean;
  coords: { x: number; y: number }[];
  opacity?: number;
  toolip?: React.ReactNode;
  content?: string;
};
