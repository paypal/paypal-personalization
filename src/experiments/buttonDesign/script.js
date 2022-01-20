/* @flow */

import { html } from './html';
import { script } from './treatments/divideLogoAnimation';

export const script = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {   
    return script();
};
