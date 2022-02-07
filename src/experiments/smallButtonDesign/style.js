/* @flow */
import { style as getStyle } from './treatments/revealMessageTabAnimation';

export const style = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    return getStyle();
};
