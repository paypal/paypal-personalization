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
    |}
|};

export type PersonalizationResponse = {|
    text : string,
    tracking : {|
        impression : string,
        click : string
    |}
|};

export type Eligibility = ({| props : ButtonProps |}) => boolean;

export type Html = ({| personalization? : ?PersonalizationResponse |}) => string;
export type Style = ({| personalization? : ?PersonalizationResponse |}) => string;
export type Script = ({| personalization? : ?PersonalizationResponse |}) => string;
