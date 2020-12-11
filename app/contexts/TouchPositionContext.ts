import { createContext } from "react";

export interface TouchPosition { pageX: number, pageY: number }

const TouchPositionContext = createContext<TouchPosition | undefined>(undefined)
export default TouchPositionContext
