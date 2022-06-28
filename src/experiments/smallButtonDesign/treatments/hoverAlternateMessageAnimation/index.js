/* @flow */
import { LOGO_CLASS, LOGO_COLOR } from "@paypal/sdk-logos";

import { CLASS } from "../../../../constants";
import type { ButtonDesignConfig, ButtonDesignProps } from "../../types";

declare var __STYLE__;

// Gets and Creates necessary HTML elements for the design
function getDesignProps(config: ButtonDesignConfig): ButtonDesignProps | null {
  const designContainer = document.querySelector(
    `.${config.PAYPAL_BUTTON || ""}`
  );
  if (!designContainer) {
    return null;
  }

  const paypalLabelContainerElement =
    designContainer.querySelector(`.${config.LABEL_CONTAINER || ""}`) || null;
  if (!paypalLabelContainerElement) {
    return null;
  }

  // Compute css values
  const buttonHeight = designContainer.offsetHeight;

  // Add necessary HTML components

  const personalizedLabelContainer = document.createElement("div");
  personalizedLabelContainer.classList.add(config.PERSONALIZED_CONTAINER || "");

  const designMessage = document.createElement("p");
  designMessage.classList.add(config.PERSONALIZED_MESSAGE || "");
  designMessage.innerHTML = "A safer easier way to pay";
  // designMessage.innerHTML = 'Life before Death, Strength before Weakness';

  personalizedLabelContainer.appendChild(designMessage);

  paypalLabelContainerElement.appendChild(personalizedLabelContainer);

  return {
    designContainer,
    paypalLabelContainerElement,
    buttonHeight,
  };
}

function applyDesign(
  designProps: ButtonDesignProps,
  config: ButtonDesignConfig
) {
  const { designContainer, paypalLabelContainerElement, buttonHeight } =
    designProps;

  const fontColor =
    __STYLE__ && (__STYLE__.color === "blue" || __STYLE__.color === "black")
      ? "white"
      : "#003087";

  const designCss = `
        .${config.PAYPAL_BUTTON || ""} img.${config.PAYPAL_LOGO || ""}-paypal {
            position:fixed;
            transform: translateX(-50%);
            opacity:1;
            transition: transform .75s, opacity .75s;
        }

        .${config.PAYPAL_BUTTON || ""} .${config.PERSONALIZED_CONTAINER || ""} {
            position: fixed;
            opacity: 0;
            transform: translate(75%, -25%);
            font-size: 4.5vw;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            width: 100%;
            right: 0%;
            height: ${buttonHeight || ""}px;
            text-align: center;
            color: ${fontColor};
            transition: transform .75s, opacity .75s;
        }

        .${config.PAYPAL_BUTTON || ""}:hover .${
    config.PERSONALIZED_CONTAINER || ""
  } {
            opacity: 1;
            transform: translate(0%, -25%);   
        }

        .${config.PAYPAL_BUTTON || ""}:hover img.${
    config.PAYPAL_LOGO || ""
  }-paypal {
            transform: translateX(-200%);
            opacity:0;
        }

        @keyframes fade-logo-out {
            from {
                transform: translateX(-50%);
                opacity:1;
            }
            to {
                position:fixed;
                transform: translateX(-200%);
                opacity:0;
            }
        }

        @keyframes fade-logo-in {
            from {
                position:fixed;
                transform: translateX(-200%);
                opacity:0;
            }
            to {
                transform: translateX(-50%);
                opacity:1;
            }
        }

        @keyframes show-text {
            from {
                opacity: 0;
                transform: translate(75%, -25%);
            }
            to {
                opacity: 1;
                transform: translate(0%, -25%);                
            }
        }

        @keyframes hide-text {
            from {
                opacity: 1;
                transform: translate(0%, -25%);                
            }
            to {
                opacity: 0;
                transform: translate(75%, -25%);
            }
        }
    `;

  if (paypalLabelContainerElement) {
    const style = document.createElement("style");
    paypalLabelContainerElement.appendChild(style);
    style.appendChild(document.createTextNode(designCss));

    window.addEventListener("resize", () => {
      // Remove animation if size limit broken
      if (
        ((designContainer && designContainer.offsetWidth > config.max) ||
          (designContainer && designContainer.offsetWidth < config.min)) &&
        paypalLabelContainerElement.contains(style)
      ) {
        paypalLabelContainerElement.removeChild(style);
      }
    });
  }
}

export const script = (): string => {
  const config = `{
        min: 150,
        max: 300,
        PAYPAL_LOGO:  '${LOGO_CLASS.LOGO}',
        LOGO_COLOR: '${LOGO_COLOR}',
        DOM_READY: '${CLASS.DOM_READY}',
        PAYPAL_BUTTON: '${CLASS.PAYPAL_BUTTON}',
        LABEL_CONTAINER: '${CLASS.LABEL_CONTAINER}',
        PERSONALIZED_CONTAINER: '${CLASS.PERSONALIZED_CONTAINER}',
        PERSONALIZED_MESSAGE: '${CLASS.PERSONALIZED_MESSAGE}'
    }`;

  return `
    (
        function () {
            const config = ${config};
            const designProps = (${getDesignProps.toString()})(config)
            if (designProps) {
                (${applyDesign.toString()})(designProps, config)
            }
        }
    )()
    
  `;
};

export const style = (): string => {
  return `
        .${CLASS.PAYPAL_BUTTON} img.${LOGO_CLASS.LOGO}-paypal {
            transform: translateX(-50%);
        }

        .${CLASS.PAYPAL_BUTTON} .${CLASS.PERSONALIZED_MESSAGE} {
            text-align: center;
            white-space: break-spaces;
            padding: 5px;
            width: 100%;
            margin: 0px;
            height: fit-content;
        }

        .${CLASS.PAYPAL_BUTTON} .${CLASS.PERSONALIZED_CONTAINER} {
            opacity: 0; 
            position: fixed;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }

  `;
};

export const html = (): string => {
  return "";
};
