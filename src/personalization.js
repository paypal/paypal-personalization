/* @flow */

import { type ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';
import type { ButtonProps } from '@paypal/checkout-components/src/ui/buttons/props';

import { getPersonalizations } from './graphql';
import type { Extra, MLContext, Personalization } from './types';

export function fetchPersonalizations({ mlContext, eligibility, extra, props } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra, props : ButtonProps |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    return getPersonalizations({ mlContext, eligibility, extra })
        .then(personalizations => {
            return personalizations.map(personalization => {
                // $FlowIssue[unsupported-syntax]
                return import(`./experiments/${ personalization.name }`)
                    .then(({ eligible }) => {
                        return eligible({ props });
                    });
            });
        });
}
