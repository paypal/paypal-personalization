/* @flow */

import { ZalgoPromise } from "zalgo-promise/src";
import { request, stringifyError } from "belter/src";
import { type FundingEligibilityType } from "@paypal/sdk-constants/src";

import { URI } from "./config";
import { buildPayPalUrl } from "./domains";
import { getLogger } from "./logger";
import type {
  MLContext,
  Personalization,
  PersonalizationResponse,
  Extra,
  Tracking,
  Treatments,
  UserContext,
} from "./types";
// eslint-disable-next-line import/no-namespace
import * as experiments from "./experiments";
import { TrackingBeacon, TrackingStyle } from "./components";
import { decideTreatment, determineSegmentTreatments } from "./util";

function getDefaultVariables<V>(): V {
  // $FlowFixMe[incompatible-return]
  return {};
}

export function callGraphQL<T, V>({
  query,
  variables = getDefaultVariables(),
  headers = {},
}: {|
  query: string,
  variables: V,
  headers?: { [string]: string },
|}): ZalgoPromise<T> {
  const url = buildPayPalUrl(URI.GRAPHQL);
  return request({
    url,
    method: "POST",
    json: {
      query,
      variables,
    },
    headers: {
      "x-app-name": "personalization",
      ...headers,
    },
  }).then(({ status, body }) => {
    const errors = body.errors || [];

    if (errors.length) {
      const message = errors[0].message || JSON.stringify(errors[0]);
      throw new Error(message);
    }

    if (status !== 200) {
      throw new Error(`${url} returned status ${status}`);
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
            buttonDesign {
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

/**
 * Future method when treatments are defined in experiment
 */
function getHTML({
  name,
  tracking,
  treatment,
}: {|
  name: string,
  tracking: Tracking,
  treatment: string,
|}): string {
  return (
    TrackingBeacon({ url: tracking.treatment }) +
    // eslint-disable-next-line import/namespace
    (experiments[name]?.treatments?.[treatment]?.html() || "")
  );
}

/**
 * Future method when treatments are defined in experiment
 */
function getStyle({
  name,
  treatment,
}: {|
  name: string,
  treatment: string,
|}): string {
  return (
    TrackingStyle() +
    // eslint-disable-next-line import/namespace
    (experiments[name]?.treatments?.[treatment]?.style() || "")
  );
}

/**
 * Future method when treatments are defined in experiment
 */
function getScript({
  name,
  treatment,
}: {|
  name: string,
  treatment: string,
|}): string {
  // eslint-disable-next-line import/namespace
  return experiments[name]?.treatments?.[treatment]?.script() || "";
}

function getHTMLForPersonalization({
  name,
  personalization,
}: {|
  name: string,
  personalization: PersonalizationResponse,
|}): string {
  let trackingBeacon = "";
  if (personalization?.tracking?.impression) {
    trackingBeacon = TrackingBeacon({
      url: personalization.tracking.impression,
    });
  }
  // eslint-disable-next-line import/namespace
  return trackingBeacon + (experiments[name]?.html({ personalization }) || "");
}

function getStyleForPersonalization({
  name,
  personalization,
}: {|
  name: string,
  personalization: PersonalizationResponse,
|}): string {
  let trackingStyle = "";
  if (personalization?.tracking?.impression) {
    trackingStyle = TrackingStyle();
  }
  // eslint-disable-next-line import/namespace
  return trackingStyle + (experiments[name]?.style({ personalization }) || "");
}

function getScriptForPersonalization({
  name,
  personalization,
}: {|
  name: string,
  personalization: PersonalizationResponse,
|}): string {
  // eslint-disable-next-line import/namespace
  return experiments[name]?.script({ personalization }) || "";
}

function populateClientPersonalization({
  name,
  tracking,
  treatment,
}: {|
  name: string,
  tracking: Tracking,
  treatment: string,
|}): Personalization {
  const html = getHTML({ name, tracking, treatment });
  const css = getStyle({ name, treatment });
  const js = getScript({ name, treatment });

  return {
    name,
    tracking: {
      context: "",
      treatment: "",
      metric: "",
    },
    treatment: {
      name,
      html,
      css,
      js,
    },
  };
}

function populatePersonalization({
  name,
  personalization,
}: {|
  name: string,
  personalization: {|
    text: string,
    tracking: {| impression: string, click: string |},
  |},
|}): Personalization {
  const html = getHTMLForPersonalization({ name, personalization });
  const css = getStyleForPersonalization({ name, personalization });
  const js = getScriptForPersonalization({ name, personalization });

  return {
    name,
    tracking: {
      context: "",
      treatment: "",
      metric: "",
    },
    treatment: {
      name,
      html,
      css,
      js,
    },
  };
}

export function adaptClientPersonalizationToExperiments({
  context,
  personalizations,
}: {|
  context: UserContext,
  personalizations: Object,
|}): ZalgoPromise<$ReadOnlyArray<Personalization>> {
  const adaptedPersonalizations = [];

  for (const experiment in personalizations) {
    if (personalizations.hasOwnProperty(experiment)) {
      // eslint-disable-next-line import/namespace
      if (!experiments[experiment]) {
        continue;
      }

      const tracking: Tracking = personalizations[experiment]?.tracking;
      const treatments: Treatments = personalizations[experiment]?.treatments;

      for (const expression in treatments) {
        if (treatments.hasOwnProperty(expression)) {
          const treatment = treatments[expression];

          const segmentTreatments = determineSegmentTreatments({
            context,
            expression,
          });
          if (segmentTreatments) {
            const sample = Object.keys(treatment);
            const probs = Object.keys(treatment).map((key) => treatment[key]);

            const decision = decideTreatment({ sample, probs });
            const personalization = populateClientPersonalization({
              name: experiment,
              tracking,
              treatment: decision,
            });
            adaptedPersonalizations.push(personalization);
            break;
          }
        }
      }
    }
  }

  return ZalgoPromise.all(adaptedPersonalizations).then((results) => results);
}

function adaptPersonalizationToExperiments(
  personalizations
): ZalgoPromise<$ReadOnlyArray<Personalization>> {
  return ZalgoPromise.try(() => {
    const adaptedPersonalizations = [];

    Object.keys(personalizations).forEach((name) => {
      // eslint-disable-next-line import/namespace
      if (experiments[name]) {
        const personalization = populatePersonalization({
          name,
          personalization: personalizations[name],
        });
        adaptedPersonalizations.push(personalization);
      }
    });

    return ZalgoPromise.all(adaptedPersonalizations).then((results) => results);
  });
}

export function getPersonalizations({
  mlContext,
  eligibility,
  extra,
}: {|
  mlContext: MLContext,
  eligibility?: FundingEligibilityType,
  extra: Extra,
|}): ZalgoPromise<$ReadOnlyArray<Personalization>> {
  const {
    userAgent,
    buyerCountry,
    buyerIp,
    locale,
    clientId,
    currency,
    cookies,
  } = mlContext;
  const { buttonSessionID, renderedButtons, taglineEnabled, buttonSize } =
    extra;
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
    eligibility,
  };

  return callGraphQL({
    query: PERSONALIZATION_QUERY,
    variables,
  })
    .then((gqlResult) => {
      if (!gqlResult || !gqlResult.checkoutCustomization) {
        return [];
      }
      return adaptPersonalizationToExperiments(
        gqlResult && gqlResult.checkoutCustomization
      ).then((personalizations) => personalizations);
    })
    .catch((err) => {
      getLogger().error(`graphql_checkoutCustomization_error`, {
        err: stringifyError(err),
      });
      return ZalgoPromise.reject(err);
    });
}
