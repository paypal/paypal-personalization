/* @flow */

import { getActualDomain } from 'cross-domain-utils/src';

import { URI } from './config';

function getPayPalDomain() : string {
    return __PAYPAL_DOMAIN__;
}

export function buildPayPalUrl(path : string = '') : string {
    return (__TEST__ && __WEB__)
        ? `${ getActualDomain() }${ path }`
        : `${ getPayPalDomain() }${ path }`;
}

export function getPayPalLoggerUrl() : string {
    return buildPayPalUrl(URI.LOGGER);
}
