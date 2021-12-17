/* @flow */

import type { ButtonProps } from '../../types';

export const eligible = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    return props.style?.tagline || false;
};
