/* @flow */

import { type ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';
import type { ButtonProps } from '@paypal/checkout-components/src';

import { getPersonalizations } from './graphql';
import type { Extra, MLContext, Personalization } from './types';

export async function fetchPersonalizations({ mlContext, eligibility, extra, props } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra, props : ButtonProps |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    const personalizations = getPersonalizations({ mlContext, eligibility, extra });
    return personalizations.map(personalization => {
        const { eligible } = await import(`./experiments/${ personalization.name }`);
        return eligible({ props });
    });
}
