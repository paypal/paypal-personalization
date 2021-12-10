/* @flow */
/* eslint import/no-nodejs-modules: off, import/no-default-export: off */

import type { WebpackConfig } from 'grumbler-scripts/config/types';
import { getWebpackConfig } from 'grumbler-scripts/config/webpack.config';

const MODULE_NAME = '@paypal/personalization';

export const WEBPACK_CONFIG_TEST : WebpackConfig = getWebpackConfig({
    modulename: MODULE_NAME,
    test:       true,
    vars:       {
        __PAYPAL_DOMAIN__: 'mock://www.paypal.com'
    }
});
