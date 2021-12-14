/* @flow */

import type { ButtonProps } from '@paypal/checkout-components/src/ui/buttons/props';

export const eligible = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    return props.style?.tagline;
};
