/* @flow */

import type { Script } from 'src/types';

export const script : Script = ({ personalization }) => {
    return `
        const taglineElement = document.querySelector('.paypal-button-tagline .paypal-button-text');
        if (taglineElement) {
            taglineElement.innerHTML = ${ personalization ? personalization.text : '' }};
            
        }
    `;
};
