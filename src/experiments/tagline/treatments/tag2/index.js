/* @flow */

export const html = () : string => {
    return '';
};

export const style = () : string => {
    return '';
};

export const script = () : string => {
    return `
        const taglineElement = document.querySelector('.paypal-button-tagline .paypal-button-text');
        if (taglineElement) {
            taglineElement.innerHTML = 'tagline2'};
            
        }
    `;
};
