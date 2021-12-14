/* @flow */

import type { ButtonProps } from '@paypal/checkout-components/src';

export const eligibile = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    return props.style?.tagline?.length ? true : false;
};
