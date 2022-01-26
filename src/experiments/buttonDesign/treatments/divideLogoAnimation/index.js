/* @flow */
import { LOGO_CLASS } from '@paypal/sdk-logos';

import type { ButtonDesignConfig, ButtonDesignProps } from '../../types';

// Gets and Creates necessary HTML elements for the design
function getDesignProps(config : ButtonDesignConfig) : ButtonDesignProps {
    const designContainer = document.querySelector('.paypal-button[data-funding-source="paypal"]');
    if (!designContainer) {
        return null;
    }

    const designContainerWidth = designContainer.offsetWidth;
    if (designContainerWidth < config.min || designContainerWidth > config.max) {
        return null;
    }

    const paypalLabelContainerElement = designContainer.querySelector('.paypal-button-label-container') || null;
    if (!paypalLabelContainerElement) {
        return null;
    }

    // get starting position for element so it doesn't flicker when animation begins
    const paypalLogoElement = (paypalLabelContainerElement && paypalLabelContainerElement.querySelector(`.${ config.PAYPAL_LOGO }`)) || null;
    if (!paypalLogoElement) {
        return null;
    }

    const paypalLogoStartingPosition =  `${ ((paypalLogoElement.offsetLeft / paypalLabelContainerElement.offsetWidth) * 100) }%`;

    // create personalized label container
    const personalizedLabelContainer = document.createElement('div');
    personalizedLabelContainer.classList.add('personalized-label-container');

    const designMessage = document.createElement('span');
    designMessage.innerHTML = 'Strength before Weakness';

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
        .dom-ready .paypal-button[data-funding-source="paypal"] img.${ config.PAYPAL_LOGO } {
            animation: 3s divide-logo-animation-left-side 1.8s infinite alternate;
        }
        
        .paypal-button[data-funding-source="paypal"] .personalized-label-container {
            animation: 3s divide-logo-animation-right-side 2s infinite alternate;
        }

        @keyframes divide-logo-animation-left-side {
            0% {
                position: fixed;
                left: ${ paypalLogoStartingPosition };
            }
            33% {
                position: fixed;
                left: ${ paypalLogoStartingPosition };
            }
            66% {
                position: fixed;
                left: 0%;
            }
            100% {
                position: fixed;
                left: 0%;
            }
        }
        
        @keyframes divide-logo-animation-right-side {
            0%{
                opacity: 0;
                position: fixed;
                right: ${ paypalLogoStartingPosition };
            }
            33%{
                opacity: 0;
                position: fixed;
                right: ${ paypalLogoStartingPosition };
            }
            66% {
                opacity: 1;
                position: fixed;
                right: 0%;
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
    DOM_READY: 'dom-ready'
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
  .paypal-button[data-funding-source="paypal"] .dom-ready img.${ LOGO_CLASS.LOGO }{
      position: relative;
  }

  .paypal-button[data-funding-source="paypal"] .personalized-label-container {
      position: absolute;
      opacity: 0; 
      color: #142C8E;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 14px;
  }

  .paypal-button[data-funding-source="paypal"] .personalized-label-container span {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
  }
  `;
};

export const html = () : string => {
    return '';
};
