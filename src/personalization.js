/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';

import { getPersonalizations } from './graphql';
import type { ButtonProps, Extra, MLContext, Personalization } from './types';

export const eligiblePersonalizations = ({ personalizations, props } : {| personalizations : $ReadOnlyArray<Personalization>, props : ButtonProps |}) : $ReadOnlyArray<Personalization> => {
    return personalizations.filter(personalization => {
        // $FlowIssue[unsupported-syntax]
        return import(`./experiments/${ personalization.name }`)
            .then(({ eligible }) => {
                return eligible({ props });
            })
            .catch(() => {
                throw new Error(`Invalid experiment ${ personalization.name }`);
            });
    });
};

export const fetchPersonalizations = ({ mlContext, eligibility, extra } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> => {
    return getPersonalizations({ mlContext, eligibility, extra })
        .then(personalizations => personalizations);
};
