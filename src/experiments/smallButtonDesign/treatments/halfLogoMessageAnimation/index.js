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

  const personalizedLabelContainer = document.createElement("div");
  personalizedLabelContainer.classList.add(config.PERSONALIZED_CONTAINER || "");

  const designMessage = document.createElement("p");
  designMessage.classList.add(config.PERSONALIZED_MESSAGE || "");
  // designMessage.innerHTML = 'A safer easier way to pay';
  designMessage.innerHTML = "Journey before Destination";

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
            animation: 4s fade-logo-left 1s infinite alternate;
            position:fixed;
            transform:translateX(-50%);
        }

        .${config.PAYPAL_BUTTON || ""} .${config.PERSONALIZED_CONTAINER || ""} {
            position: fixed;
            animation: 4s show-text 1s infinite alternate;
            font-size: 4.5vw;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            width: 60%;
            right: 0%;
            height: ${buttonHeight || ""}px;
            transform: translateY(-25%);
            text-align: center;
            color: ${fontColor};
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }

        @keyframes fade-logo-left {
            0%,33% {
                transform: translateX(-50%);
            }
            50%,100% {
                position:fixed;
                transform: translateX(-150%);
            }
        }
        @keyframes show-text {
            0%, 40%{
                opacity: 0;
            }
            55%, 100% {
                opacity: 1;                    
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


        .${CLASS.PAYPAL_BUTTON} .${CLASS.PERSONALIZED_MESSAGE} {
            text-align: center;
            white-space: break-spaces;
            width: 100%;
            right: 0%;
            margin: 0px;
            padding: 3px;
            height: fit-content;
        }

        .${CLASS.PAYPAL_BUTTON} .${CLASS.PERSONALIZED_CONTAINER} {
            opacity: 0; 
            position: fixed;
        }

  `;
};

export const html = (): string => {
  return "";
};
