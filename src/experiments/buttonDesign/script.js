/* @flow */

import { html } from './html';
import { script as getScript } from './treatments/divideLogoAnimation';

export const script = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    return getScript();
};
