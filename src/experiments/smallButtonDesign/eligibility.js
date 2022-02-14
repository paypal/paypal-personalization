/* @flow */

import type { ButtonProps } from '../../types';


export const eligible = ({ props = {} } : {| props : ButtonProps |}) : boolean => {
    const eligibleButtonSize = [ 'tiny', 'small', 'medium' ].includes(props?.buttonSize) || false;
    const taglineDisabled = !props.style?.tagline || false;
    return eligibleButtonSize && taglineDisabled;
};
