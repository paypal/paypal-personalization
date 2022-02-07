/* @flow */

import { script as getScript } from './treatments/revealMessageTabAnimation';

export const script = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    return getScript();
};
