/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { request, stringifyError } from 'belter/src';
import { type FundingEligibilityType } from '@paypal/sdk-constants/src';

import { URI } from './config';
import { buildPayPalUrl } from './domains';
import { getLogger } from './logger';
import type { MLContext, Personalization, Extra } from './types';

export const LocationType = {
    'BEFORE': ('before' : 'before'),
    'AFTER':  ('after' : 'after'),
    'INNER':  ('inner' : 'inner')
};


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

function getHTMLForPersonalization({ personalization } : {| personalization : Personalization |}) : ZalgoPromise<string> {
    return ZalgoPromise.try(() => {
        // $FlowIssue[unsupported-syntax]
        return import(`./experiments/${ personalization.name }`)
            .then(({ html }) => {
                return html;
            })
            .catch(() => {
                throw new Error(`Invalid experiment ${ personalization.name }`);
            });
    });
}

function getStyleForPersonalization({ personalization } : {| personalization : Personalization |}) : ZalgoPromise<string> {
    return ZalgoPromise.try(() => {
        // $FlowIssue[unsupported-syntax]
        return import(`./experiments/${ personalization.name }`)
            .then(({ style }) => {
                return style;
            })
            .catch(() => {
                throw new Error(`Invalid experiment ${ personalization.name }`);
            });
    });
}

function getScriptForPersonalization({ personalization } : {| personalization : Personalization |}) : ZalgoPromise<string> {
    return ZalgoPromise.try(() => {
        // $FlowIssue[unsupported-syntax]
        return import(`./experiments/${ personalization.name }`)
            .then(({ script }) => {
                return script;
            })
            .catch(() => {
                throw new Error(`Invalid experiment ${ personalization.name }`);
            });
    });
}

function adaptPersonalizationToExperiments(personalization) : ?ZalgoPromise<$ReadOnlyArray<Personalization>> {
    const personalizations = [];

    return ZalgoPromise.hash({
        html: getHTMLForPersonalization({ personalization }),
        css:  getStyleForPersonalization({ personalization }),
        js:   getScriptForPersonalization({ personalization })
    }).then(({ html, css, js }) => {
        Object.keys(personalization).forEach(experiment => {
            if (personalization[experiment]) {
                personalizations.push({
                    name:      experiment,
                    tracking:  personalization[experiment] && personalization[experiment].tracking,
                    treatment: {
                        name:   experiment,
                        html,
                        css,
                        js
                    }
                });
            }
        });

        return personalizations;
    });
}

export function getPersonalizations({ mlContext, eligibility, extra } : {| mlContext : MLContext, eligibility? : FundingEligibilityType, extra : Extra |}) : ZalgoPromise<$ReadOnlyArray<Personalization>> {
    const { userAgent, buyerCountry, locale, clientId, buyerIp: ip, currency, cookies } = mlContext;
    const { commit, intent, vault, buttonSessionID, renderedButtons, label, period, taglineEnabled, layout, buttonSize } = extra;
    const variables = {
        clientId,
        locale,
        buyerCountry,
        currency,
        intent,
        commit,
        vault,
        ip,
        cookies,
        userAgent,
        buttonSessionID,
        renderedButtons,
        label,
        period,
        taglineEnabled,
        layout,
        buttonSize,
        eligibility
    };

    // Placeholder for future API changes
    if (eligibility) {
        variables.eligibility = eligibility;
    } else {
        delete variables.eligibility;
    }

    return callGraphQL({
        query: PERSONALIZATION_QUERY,
        variables
    }).then((gqlResult) => {
        if (!gqlResult || !gqlResult.checkoutCustomization) {
            throw new Error(`GraphQL checkoutCustomization returned no checkoutCustomization object`);
        }
        return adaptPersonalizationToExperiments(gqlResult && gqlResult.checkoutCustomization);
    }).catch(err => {
        getLogger().error(`graphql_checkoutCustomization_error`, { err: stringifyError(err) });
        return ZalgoPromise.reject(err);
    });
}
