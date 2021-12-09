/* @flow */

import { getActualDomain } from 'cross-domain-utils/src';

import { URI } from './config';

const PAYPAL_DOMAIN = `https://www.paypal.com`;

export function buildPayPalUrl(path : string = '') : string {
    return (__TEST__ && __WEB__)
        ? `${ getActualDomain() }${ path }`
        : `${ PAYPAL_DOMAIN }${ path }`;
}

export function getPayPalLoggerUrl() : string {
    return buildPayPalUrl(URI.LOGGER);
}
