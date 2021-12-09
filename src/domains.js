/* @flow */

import { getActualDomain } from 'cross-domain-utils/src';

import { URI } from './config';

export function buildPayPalUrl(path : string = '') : string {
    return (__TEST__ && __WEB__)
        ? `${ getActualDomain() }${ path }`
        : `${ __PAYPAL_DOMAIN__ }${ path }`;
}

export function getPayPalLoggerUrl() : string {
    return buildPayPalUrl(URI.LOGGER);
}
