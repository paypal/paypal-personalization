/* @flow */

// eslint-disable-next-line import/no-commonjs
module.exports = {
    'extends': require.resolve('grumbler-scripts/config/.eslintrc-browser'),
    'globals': {
        __PAYPAL_DOMAIN__: true
    }
};
