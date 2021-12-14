/* @flow */

import type { ButtonProps } from '@paypal/checkout-components/src/ui/buttons/props';

export const eligibile = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    return props.style?.tagline;
};
