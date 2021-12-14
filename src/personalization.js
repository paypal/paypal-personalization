/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';
import type { ButtonProps } from '@paypal/checkout-components/src/ui/buttons/props';

import { getPersonalizations } from './graphql';
import type { Extra, MLContext, Personalization } from './types';

const filteredPersonalizations = ({ personalizations, props }) : $ReadOnlyArray<Personalization> => {
    return personalizations.filter(personalization => {
        // $FlowIssue[unsupported-syntax]
        return import('./experiments/tagline')
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
            return filteredPersonalizations({ personalizations, props });
        });
}
