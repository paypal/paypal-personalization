/* @flow */

import type { Script } from "src/types";

import { script as getScript } from "./treatments/divideLogoAnimation";

export const script: Script = () => {
  return getScript({});
};
