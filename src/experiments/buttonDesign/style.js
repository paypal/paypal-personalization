/* @flow */
import { style as getStyle } from './treatments/divideLogoAnimation';

export const style = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    return getStyle();
};
