/* @flow */

import type { ButtonProps } from '../../types';

export const eligible = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    const taglineElement = document.querySelector('.paypal-button-tagline');
    return props.style?.tagline && Boolean(taglineElement);
};
