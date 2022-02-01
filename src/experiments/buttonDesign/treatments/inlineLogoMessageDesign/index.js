/* @flow */
import { LOGO_CLASS } from '@paypal/sdk-logos';

import { CLASS } from '../../../../constants';
import type { ButtonDesignConfig, ButtonDesignProps } from '../../types';

// Gets and Creates necessary HTML elements for the design
function getDesignProps(config : ButtonDesignConfig) : ?ButtonDesignProps {
    const designContainer = document.querySelector(`.${ CLASS.PAYPAL_BUTTON }`);

    if (!designContainer) {
        return null;
    }

    const designContainerWidth = designContainer.offsetWidth;
    if (designContainerWidth < config.min || designContainerWidth > config.max) {
        return null;
    }

    const paypalLabelContainerElement = designContainer.querySelector(`.${ CLASS.LABEL_CONTAINER }`) || null;
    if (!paypalLabelContainerElement) {
        return null;
    }

    // get starting position for element so it doesn't flicker when animation begins
    const paypalLogoElement = (paypalLabelContainerElement && paypalLabelContainerElement.querySelector(`.${ LOGO_CLASS }`)) || null;
    if (!paypalLogoElement) {
        return null;
    }

    const paypalLogoStartingPosition =  `${ ((paypalLogoElement.offsetLeft / paypalLabelContainerElement.offsetWidth) * 100) }%`;

    // create personalized label container
    const personalizedLabelContainer = document.createElement('div');
    personalizedLabelContainer.classList.add(CLASS.PERSONALIZED_CONTAINER);

    const designMessage = document.createElement('span');
    designMessage.innerHTML = 'Life before Death';

    personalizedLabelContainer.appendChild(designMessage);
    paypalLabelContainerElement.appendChild(personalizedLabelContainer);

    return {
        designContainer,
        paypalLabelContainerElement,
        paypalLogoStartingPosition
    };
}

function applyDesign(designProps : ButtonDesignProps, config : ButtonDesignConfig) {
    const {
        designContainer,
        paypalLabelContainerElement,
        paypalLogoStartingPosition
    } = designProps;

    const designCss = `
        .${ CLASS.DOM_READY } .${ CLASS.PAYPAL_BUTTON } img.${ LOGO_CLASS } {
            animation: inline-logo-message-animation-left-side 1.2s 1.8s 1 forwards;
        }
        
        .${ CLASS.PAYPAL_BUTTON } .${ CLASS.PERSONALIZED_CONTAINER } {
            animation: inline-logo-message-animation-right-side 1.2s 1.8s 1 forwards;
        }

        @keyframes inline-logo-message-animation-left-side {
            0% {
                position: fixed;
                left: ${ paypalLogoStartingPosition };
            }
            100% {
                position: fixed;
                left: 0%;
            }
        }
        
        @keyframes inline-logo-message-animation-right-side {
            0%{
                opacity: 0;
                position: fixed;
                right: ${ paypalLogoStartingPosition };
            }
            100% {
                opacity: 1;
                position: fixed;
                right: 0%;
            }
        }
    `;

    if (paypalLabelContainerElement) {
        const style = document.createElement('style');
        paypalLabelContainerElement.appendChild(style);
        style.appendChild(document.createTextNode(designCss));

      
        window.addEventListener('resize', () => {
            // Remove animation if size limit broken
            if (
                (designContainer.offsetWidth > config.max || designContainer.offsetWidth < config.min)
              && paypalLabelContainerElement.contains(style)
            ) {
                paypalLabelContainerElement.removeChild(style);
            }
        });
    }
}

export const script = () : string => {

    const config = `{
        min: 200,
        max: 750,
        PAYPAL_LOGO:  '${ LOGO_CLASS.LOGO }',
        DOM_READY: '${ CLASS.DOM_READY }',
        PAYPAL_BUTTON: '${ CLASS.PAYPAL_BUTTON }',
        LABEL_CONTAINER: '${ CLASS.LABEL_CONTAINER }',
        PERSONALIZED_CONTAINER: '${ CLASS.PERSONALIZED_CONTAINER }'
    }`;

    return `
    (
        function () {
            const config = ${ config };
            const designProps = (${ getDesignProps.toString() })(config)
            if (designProps) {
                (${ applyDesign.toString() })(designProps, config)
            }
        }
    )()
    
  `;

};

export const style = () : string => {
    return `
        .${ CLASS.PAYPAL_BUTTON } .${ CLASS.DOM_READY } img.${ LOGO_CLASS.LOGO } {
            position: relative;
        }

        .${ CLASS.PAYPAL_BUTTON } .${ CLASS.PERSONALIZED_CONTAINER } {
            position: absolute;
            opacity: 0; 
            color: #142C8E;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 14px;
        }

        .${ CLASS.PAYPAL_BUTTON } .${ CLASS.PERSONALIZED_CONTAINER } span {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
  `;
};

export const html = () : string => {
    return '';
};
