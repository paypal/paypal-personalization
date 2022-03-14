/* @flow */
export type ButtonDesignConfig = {|
  min : number,
  max : number,
  PAYPAL_LOGO? : string,
  DOM_READY? : string,
  LABEL_CONTAINER? : string,
  PAYPAL_BUTTON? : string,
  PPLogo? : (logoColor : string, PAYPAL_LOGO : string) =>  HTMLElement,
  PERSONALIZED_CONTAINER? : string,
  PERSONALIZED_MESSAGE? : string
|};

export type ButtonDesignProps = {|
  designContainer? : HTMLElement,
  paypalLabelContainerElement? : HTMLElement,
  paypalLogoStartingPosition? : string,
  buttonHeight? : number,
  labelContainerMargin? : string,
  borderRadius? : string,
  containerHeight? : number
|};
