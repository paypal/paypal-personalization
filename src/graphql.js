/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { request, stringifyError } from 'belter/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';

import { URI } from './config';
import { buildPayPalUrl } from './domains';
import { getLogger } from './logger';
import type { MLContext, Personalization, Extra } from './types';
// eslint-disable-next-line import/no-namespace
import * as experiments from './experiments';

function getDefaultVariables<V>() : V {
    // $FlowFixMe[incompatible-return]
    return {};
}

export function callGraphQL<T, V>({ query, variables = getDefaultVariables(), headers = {} } : {| query : string, variables : V, headers? : { [string] : string } |}) : ZalgoPromise<T> {
    const url = buildPayPalUrl(URI.GRAPHQL);
    return request({
        url,
        method:  'POST',
        json:    {
            query,
            variables
        },
        headers: {
            'x-app-name': 'personalization',
            ...headers
        }
    }).then(({ status, body }) => {
        const errors = body.errors || [];

        if (errors.length) {
            const message = errors[0].message || JSON.stringify(errors[0]);
            throw new Error(message);
        }

        if (status !== 200) {
            throw new Error(`${ url } returned status ${ status }`);
        }

        return body.data;
    });
}

const PERSONALIZATION_QUERY = `
    query GetPersonalization(
        $clientId: String,
        $buyerCountry: CountryCodes,
        $ip: String,
        $cookies: String,
        $currency: SupportedCountryCurrencies,
        $intent: FundingEligibilityIntent,
        $commit: Boolean,
        $vault: Boolean,
        $merchantID: [String],
        $buttonSessionID: String,
        $userAgent: String,
        $locale: LocaleInput!,
        $label: ButtonLabels,
        $period: String,
        $taglineEnabled: Boolean,
        $renderedButtons: [FundingButtonType]
        $layout: ButtonLayouts
        $buttonSize: ButtonSizes
    ) {
        checkoutCustomization(
            clientId: $clientId,
            merchantId: $merchantID,
            currency: $currency,
            commit: $commit,
            intent: $intent,
            vault: $vault,
            buyerCountry: $buyerCountry,
            ip: $ip,
            cookies: $cookies,
            buttonSessionId: $buttonSessionID,
            userAgent: $userAgent,
            locale: $locale,
            buttonLabel: $label,
            installmentPeriod: $period,
            taglineEnabled: $taglineEnabled,
            renderedButtons: $renderedButtons
            layout: $layout
            buttonSize: $buttonSize
        ) {
            tagline {
                text
                tracking {
                    impression
                    click
                }
            }
            buttonText {
                text
                tracking {
                    impression
                    click
                }
            }
            buttonAnimation {
                id
                text
                tracking {
                    impression
                    click
                }
            }
        }
    }
`;

function getHTMLForPersonalization({ name, personalization } : {| name : string, personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string {
    // eslint-disable-next-line import/namespace
    return experiments[name].html({ personalization });
}

function getStyleForPersonalization({ name, personalization } : {| name : string, personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string {
    // eslint-disable-next-line import/namespace
    return experiments[name].style({ personalization });
}

function getScriptForPersonalization({ name, personalization } : {| name : string, personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string {
    // eslint-disable-next-line import/namespace
    return experiments[name].script({ personalization });
}

function populatePersonalization({ name, personalization } : {| name : string, personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : Personalization {
    const html = getHTMLForPersonalization({ name, personalization });
    const css = getStyleForPersonalization({ name, personalization });
    const js = getScriptForPersonalization({ name, personalization });

    return {
        name,
        tracking:  {
            context:   '',
            treatment: '',
            metric:    ''
        },
        treatment: {
            name,
            html,
            css,
            js
        }
    };
}

function adaptPersonalizationToExperiments(personalizations) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    return ZalgoPromise.try(() => {
        const adaptedPersonalizations = [];

        Object.keys(personalizations).forEach((name) => {
            if (personalizations[name]) {
                const personalization = populatePersonalization({ name, personalization: personalizations[name] });
                adaptedPersonalizations.push(personalization);
            }
        });

        return ZalgoPromise.all(adaptedPersonalizations).then(results => results);
    });
}

export function getPersonalizations({ mlContext, eligibility, extra } : {| mlContext : MLContext, eligibility? : FundingEligibilityType, extra : Extra |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    const { userAgent, buyerCountry, buyerIp, locale, clientId, currency, cookies } = mlContext;
    const { buttonSessionID, renderedButtons, taglineEnabled, buttonSize } = extra;
    const variables = {
        clientId,
        locale,
        cookies,
        buyerCountry,
        buyerIp,
        currency,
        userAgent,
        buttonSessionID,
        renderedButtons,
        taglineEnabled,
        buttonSize,
        eligibility
    };

    return callGraphQL({
        query: PERSONALIZATION_QUERY,
        variables
    }).then((gqlResult) => {
        if (!gqlResult || !gqlResult.checkoutCustomization) {
            return [];
        }
        return adaptPersonalizationToExperiments(gqlResult && gqlResult.checkoutCustomization)
            .then(personalizations => personalizations);
    }).catch(err => {
        getLogger().error(`graphql_checkoutCustomization_error`, { err: stringifyError(err) });
        return ZalgoPromise.reject(err);
    });
}
