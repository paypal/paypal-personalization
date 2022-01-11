/* @flow */

type Tracking = {|
    context : string,
    treatment : string,
    metric : string
|};

type Treatment = {|
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

export type ButtonProps = {|
    style : {|
        tagline : boolean
    |}
|};
