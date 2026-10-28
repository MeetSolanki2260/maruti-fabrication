import { postEvent } from "./api";
import type { EVENT_NAMES } from "../shared/constants";
export const track = (name: (typeof EVENT_NAMES)[number]) => postEvent(name);
