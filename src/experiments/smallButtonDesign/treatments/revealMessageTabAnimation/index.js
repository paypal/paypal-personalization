/* @flow */
import { LOGO_CLASS, LOGO_COLOR } from '@paypal/sdk-logos';

import { CLASS } from '../../../../constants';
import type { ButtonDesignConfig, ButtonDesignProps } from '../../../../types';

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

const PPLogo = (logoColor, PAYPAL_LOGO) => {

    const PP_LOGO_COLORS = {
        black: {
            primary:          '#ffffff',
            primaryOpacity:   '0.7',
            secondary:        '#ffffff',
            secondaryOpacity: '0.7',
            tertiary:         '#ffffff'
        },
        blue: {
            primary:          '#ffffff',
            primaryOpacity:   '0.7',
            secondary:        '#ffffff',
            secondaryOpacity: '0.7',
            tertiary:         '#ffffff'
        }
    };

    const primary = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].primary) || '#009cde';
    const secondary = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].secondary) || '#012169';
    const tertiary = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].tertiary) || '#003087';
    const primaryOpacity = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].primaryOpacity) || '1';
    const secondaryOpacity = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].secondaryOpacity) || '1';
    const tertiaryOpacity = '1';

    const ppLogo = document.createElement('div');
    ppLogo.innerHTML = `
        <svg width="24" height="32" viewBox="0 0 24 32" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
            <path fill=${ primary } opacity=${ primaryOpacity } d="M 20.924 7.157 C 21.204 5.057 20.924 3.657 19.801 2.357 C 18.583 0.957 16.43 0.257 13.716 0.257 L 5.758 0.257 C 5.29 0.257 4.729 0.757 4.634 1.257 L 1.358 23.457 C 1.358 23.857 1.639 24.357 2.107 24.357 L 6.975 24.357 L 6.694 26.557 C 6.6 26.957 6.881 27.257 7.255 27.257 L 11.375 27.257 C 11.844 27.257 12.311 26.957 12.405 26.457 L 12.405 26.157 L 13.247 20.957 L 13.247 20.757 C 13.341 20.257 13.809 19.857 14.277 19.857 L 14.84 19.857 C 18.864 19.857 21.954 18.157 22.89 13.157 C 23.358 11.057 23.172 9.357 22.048 8.157 C 21.767 7.757 21.298 7.457 20.924 7.157 L 20.924 7.157" />
            <path fill=${ secondary } opacity=${ secondaryOpacity } d="M 20.924 7.157 C 21.204 5.057 20.924 3.657 19.801 2.357 C 18.583 0.957 16.43 0.257 13.716 0.257 L 5.758 0.257 C 5.29 0.257 4.729 0.757 4.634 1.257 L 1.358 23.457 C 1.358 23.857 1.639 24.357 2.107 24.357 L 6.975 24.357 L 8.286 16.057 L 8.192 16.357 C 8.286 15.757 8.754 15.357 9.315 15.357 L 11.655 15.357 C 16.243 15.357 19.801 13.357 20.924 7.757 C 20.831 7.457 20.924 7.357 20.924 7.157" />
            <path fill=${ tertiary } opacity=${ tertiaryOpacity } d="M 9.504 7.157 C 9.596 6.857 9.784 6.557 10.065 6.357 C 10.251 6.357 10.345 6.257 10.532 6.257 L 16.711 6.257 C 17.461 6.257 18.208 6.357 18.772 6.457 C 18.958 6.457 19.146 6.457 19.333 6.557 C 19.52 6.657 19.707 6.657 19.801 6.757 C 19.894 6.757 19.987 6.757 20.082 6.757 C 20.362 6.857 20.643 7.057 20.924 7.157 C 21.204 5.057 20.924 3.657 19.801 2.257 C 18.677 0.857 16.525 0.257 13.809 0.257 L 5.758 0.257 C 5.29 0.257 4.729 0.657 4.634 1.257 L 1.358 23.457 C 1.358 23.857 1.639 24.357 2.107 24.357 L 6.975 24.357 L 8.286 16.057 L 9.504 7.157 Z" />
        </svg>
    `;

    ppLogo.classList.add(`${ PAYPAL_LOGO }-pp`);

    return ppLogo;
};

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
