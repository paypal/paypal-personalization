/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';

import { getPersonalizations } from './graphql';
import type { ButtonProps, Extra, MLContext, Personalization } from './types';
// eslint-disable-next-line import/no-namespace
import * as experiments from './experiments';

export const eligiblePersonalizations = ({ personalizations = [], props } : {| personalizations : $ReadOnlyArray<Personalization>, props : ButtonProps |}) : $ReadOnlyArray<Personalization> => {
    return personalizations.filter(personalization => {
        // eslint-disable-next-line import/namespace
        return experiments[personalization.name].eligible({ props });
    });
};

export const fetchPersonalizations = ({ mlContext, eligibility, extra } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> => {
    return getPersonalizations({ mlContext, eligibility, extra })
        .then(personalizations => personalizations);
};
