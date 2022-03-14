/* @flow */

import type { ButtonProps, Eligibility } from 'src/types';

export const eligible : Eligibility = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    return props.style?.tagline || false;
};
