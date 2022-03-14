/* @flow */

import type { Style } from 'src/types';

import { style as getStyle } from './treatments/divideLogoAnimation';

export const style : Style = () => {
    return getStyle();
};
