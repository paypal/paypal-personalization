/* @flow */

import type { Html, Style, Script } from 'src/types';

export const html : Html = () : string => {
    return '';
};

export const style : Style = () : string => {
    return '';
};

export const script : Script = () : string => {
    return `
        const taglineElement = document.querySelector('.paypal-button-tagline .paypal-button-text');
        if (taglineElement) {
            taglineElement.innerHTML = 'tagline 1';
            
        }
    `;
};
