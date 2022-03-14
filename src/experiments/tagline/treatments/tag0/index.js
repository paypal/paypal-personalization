/* @flow */

import type { Html, Style, Script } from 'src/types';

export const html : Html = () => {
    return '';
};

export const style : Style = () => {
    return '';
};

export const script : Script = () => {
    return `
        const taglineElement = document.querySelector('.paypal-button-tagline .paypal-button-text');
        if (taglineElement) {
            taglineElement.innerHTML = 'tagline0';
            
        }
    `;
};
