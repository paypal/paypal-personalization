/* @flow */

import type { Personalization } from './types';
// eslint-disable-next-line import/no-namespace
import * as experiments from './experiments';

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

export function adaptPersonalizationToExperiments(personalizations : Object) : $ReadOnlyArray<Personalization> {
    const adaptedPersonalizations = [];

    Object.keys(personalizations).forEach((name) => {
        if (personalizations[name]) {
            const personalization = populatePersonalization({ name, personalization: personalizations[name] });
            adaptedPersonalizations.push(personalization);
        }
    });

    return adaptedPersonalizations;
}
