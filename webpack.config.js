/* @flow */
/* eslint import/no-nodejs-modules: off, import/no-default-export: off */

import type { WebpackConfig } from "@krakenjs/grumbler-scripts/config/types";
import { getWebpackConfig } from "@krakenjs/grumbler-scripts/config/webpack.config";

const FILE_NAME = "paypal-personalization";
const MODULE_NAME = "@paypal/personalization";

export const WEBPACK_CONFIG: WebpackConfig = getWebpackConfig({
  filename: `${FILE_NAME}.js`,
  modulename: MODULE_NAME,
  minify: false,
});

export const WEBPACK_CONFIG_MIN: WebpackConfig = getWebpackConfig({
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true,
  vars: {
    __MIN__: true,
  },
});

export const WEBPACK_CONFIG_TEST: WebpackConfig = getWebpackConfig({
  modulename: MODULE_NAME,
  test: true,
  vars: {
    __PAYPAL_DOMAIN__: "mock://www.paypal.com",
  },
});
