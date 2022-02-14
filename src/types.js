/* @flow */

import { COMMIT, COUNTRY, CURRENCY, INTENT, type LocaleType } from '@paypal/sdk-constants/src';

export type Tracking = {|
    context : string,
    treatment : string,
    metric : string
|};

export type Treatment = {|
    name : string,
    html : string,
    css : string,
    js : string
|};

export type Personalization = {|
    name : string,
    tracking : Tracking,
    treatment : Treatment
|};

export type MLContext = {|
    userAgent? : string,
    buyerCountry : $Values<typeof COUNTRY>,
    merchantCountry? : $Values<typeof COUNTRY>,
    locale : LocaleType,
    clientId : string,
    buyerIp? : string,
    currency? : $Values<typeof CURRENCY>,
    cookies? : string
|};

export type Extra = {|
    intent? : $Values<typeof INTENT>,
    commit? : $Values<typeof COMMIT>,
    vault? : boolean,
    merchantID? : $ReadOnlyArray<string>,
    buttonSessionID? : string,
    label? : string,
    period? : number,
    taglineEnabled : boolean,
    renderedButtons? : $ReadOnlyArray<string>,
    layout? : string,
    buttonSize? : string
|};

export type UserContext = {|

|};

export type Treatments = {|
    string : {|
        string : number
    |}
|};

export type ButtonProps = {|
    style : {|
        tagline : boolean
    |},
    buttonSize? : string
|};

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
    borderRadius? : string
  |};
  
