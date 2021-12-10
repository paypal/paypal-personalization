/* @flow */

import { type ZalgoPromise } from 'zalgo-promise/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';

import { getPersonalizations } from './graphql';
import type { Extra, MLContext, Personalization } from './types';

export function fetchPersonalizations({ mlContext, eligibility, extra } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    return getPersonalizations({ mlContext, eligibility, extra });
}
