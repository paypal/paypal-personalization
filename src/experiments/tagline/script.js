/* @flow */

import { html } from './html';

export const script = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    return `
        const taglineElement = document.querySelector('.paypal-button-tagline');
        if (taglineElement) {
            taglineElement.innerHTML = ${ personalization.text }${ html({ personalization }) };
            
        }
    `;
};
