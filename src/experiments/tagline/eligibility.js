/* @flow */

export const eligibility = ({ props = {} } : {| props : {| tagline : string |} |}) : boolean => {
    return props.tagline?.length ? true : false;
};
