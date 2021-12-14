/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';

import { getPersonalizations } from './graphql';
import type { ButtonProps, Extra, MLContext, Personalization } from './types';

const eligiblePersonalizations = ({ personalizations, props }) : $ReadOnlyArray<Personalization> => {
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

export function fetchPersonalizations({ mlContext, eligibility, extra, props } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra, props : ButtonProps |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    return getPersonalizations({ mlContext, eligibility, extra })
        .then(personalizations => {
            return eligiblePersonalizations({ personalizations, props });
        });
}
