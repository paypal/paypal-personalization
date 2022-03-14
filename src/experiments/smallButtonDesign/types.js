/* @flow */

export type ButtonDesignConfig = {|
  min : number,
  max : number,
  PAYPAL_LOGO? : string,
  DOM_READY? : string
|};

export type ButtonDesignProps = {|
  designContainer : HTMLElement,
  paypalLabelContainerElement : HTMLElement,
  paypalLogoStartingPosition : string
|};
