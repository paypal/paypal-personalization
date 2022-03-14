/* @flow */
import { LOGO_CLASS, LOGO_COLOR } from '@paypal/sdk-logos';

import { CLASS } from '../../../../constants';
import type { ButtonDesignConfig, ButtonDesignProps } from '../../../../types';
import { PPLogo } from '../../../../components';

// Gets and Creates necessary HTML elements for the design
function getDesignProps(config : ButtonDesignConfig) : ButtonDesignProps | null {
    const designContainer = document.querySelector(`.${ config.PAYPAL_BUTTON }`);
    if (!designContainer) {
        return null;
    }

    const paypalLabelContainerElement = designContainer.querySelector(`.${ config.LABEL_CONTAINER }`) || null;
    if (!paypalLabelContainerElement) {
        return null;
    }

    // Compute css values
    const borderRadius = window.getComputedStyle(designContainer).borderRadius;
    const labelContainerMargin = window.getComputedStyle(paypalLabelContainerElement).marginRight;
    const buttonHeight = designContainer.offsetHeight;

    // Add necessary HTML components
    const ppLogo = config.PPLogo(
        __STYLE__.color,
        config.PAYPAL_LOGO
    );

    const messageTabElement = document.createElement('div');
    messageTabElement.classList.add('message-tab');

    const personalizedLabelContainer = document.createElement('div');
    personalizedLabelContainer.classList.add(config.PERSONALIZED_CONTAINER);

    const designMessage = document.createElement('p');
    designMessage.classList.add(config.PERSONALIZED_MESSAGE);
    // designMessage.innerHTML = 'A safer easier way to pay';
    designMessage.innerHTML = 'Life before Death, Strength before Weakness';

    personalizedLabelContainer.appendChild(designMessage);
    
    messageTabElement.appendChild(personalizedLabelContainer);
    paypalLabelContainerElement.appendChild(messageTabElement);
    paypalLabelContainerElement.appendChild(ppLogo);
    

    return {
        designContainer,
        paypalLabelContainerElement,
        buttonHeight,
        labelContainerMargin,
        borderRadius
    };
}

function applyDesign(designProps : ButtonDesignProps, config : ButtonDesignConfig) {
    const {
        designContainer,
        paypalLabelContainerElement,
        buttonHeight,
        labelContainerMargin,
        borderRadius
    } = designProps;

    const BACKGROUND_COLOR_MAP = {
        blue:  '#ffc439',
        black: '#515354'
    };

    const fontColor = __STYLE__ && __STYLE__.color === 'blue' ?  '#003087' : 'white';
    const backgroundColor = BACKGROUND_COLOR_MAP[__STYLE__ && __STYLE__.color] || '#003087';

    const designCss = `
        .${ config.PAYPAL_BUTTON } img.${ config.PAYPAL_LOGO }-paypal {
            animation: 4s fade-logo-left 1s infinite alternate;
            position:fixed;
            transform:translateX(-50%);
        }

        .${ config.PAYPAL_BUTTON } .message-tab {
            width: 0%;
            top: 0%;
            height: ${ buttonHeight }px;
            background-color: ${ backgroundColor };
            transform: translateY(-25%);
            right: -${ labelContainerMargin };
            border-radius: ${ borderRadius };
            animation: 4s expand-message-layer 1s infinite alternate;
            position: fixed;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        .${ config.PAYPAL_BUTTON } .${ config.PERSONALIZED_CONTAINER } {
            position: fixed;
            animation: 4s show-text 1s infinite alternate;
            font-size: 4.5vw;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            width: 100%;
            height: initial;
            text-align: center;
            color: ${ fontColor };
        }
        .${ config.PAYPAL_BUTTON } .${ config.PAYPAL_LOGO }-pp{
            animation: 4s reveal-pp-logo 1s infinite alternate;
            opacity:0;
        }
        @keyframes expand-message-layer {
            0%,33%{
                opacity:0;
                width:1%;
            }
            50%,100%{
                opacity:1;
                width: 90%
            }
        }
        @keyframes fade-logo-left {
            0%,33% {
                transform: translateX(-50%);
                opacity:1;
            }
            50%,100% {
                position:fixed;
                transform: translateX(-100%);
                opacity:0;
            }
        }
        @keyframes show-text {
            0%,45%{
                opacity: 0;
            }
            55%, 100% {
                opacity: 1;                    
            }
        }
        @keyframes reveal-pp-logo {
            0%,33%{
                opacity:0;
            }
            51%,100% {
                left:0px;
                opacity:1;
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
        min: 150,
        max: 300,
        PAYPAL_LOGO:  '${ LOGO_CLASS.LOGO }',
        LOGO_COLOR: '${ LOGO_COLOR }',
        DOM_READY: '${ CLASS.DOM_READY }',
        PAYPAL_BUTTON: '${ CLASS.PAYPAL_BUTTON }',
        LABEL_CONTAINER: '${ CLASS.LABEL_CONTAINER }',
        PERSONALIZED_CONTAINER: '${ CLASS.PERSONALIZED_CONTAINER }',
        PERSONALIZED_MESSAGE: '${ CLASS.PERSONALIZED_MESSAGE }',
        PPLogo: ${ PPLogo.toString() }
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
        .${ CLASS.PAYPAL_BUTTON } div.${ LOGO_CLASS.LOGO }-pp {
            position: fixed;
            opacity: 0;
        }

        .${ CLASS.PAYPAL_BUTTON } .message-tab {
            position: fixed;
            opacity: 0;
            background-color: rgb(43,114,235);
        }

        .${ CLASS.PAYPAL_BUTTON } .${ CLASS.PERSONALIZED_MESSAGE } {
            text-align: center;
            white-space: break-spaces;
            padding: 5px;
            width: 100%;
        }

        .${ CLASS.PAYPAL_BUTTON } .${ CLASS.PERSONALIZED_CONTAINER } {
            opacity: 0; 
            position: fixed;
        }

  `;
};

export const html = () : string => {
    return '';
};
