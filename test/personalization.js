/* @flow */

import { INTENT } from '@paypal/sdk-constants/src';
import { patchXmlHttpRequest } from 'sync-browser-mocks/dist/sync-browser-mocks';

import { fetchPersonalizations } from '../src';

import { getGraphQLApiMock } from './mocks';

declare var describe : function;
declare var it : function;

describe(`personalization cases`, () => {
    beforeEach(() => {
        patchXmlHttpRequest();
    });

    it('should successfully fetch a personalization payload', async () => {
        const graphQLMock = getGraphQLApiMock().listen();
        graphQLMock.expectCalls();

        const mlContext = {
            userAgent:    window.navigator.userAgent,
            buyerCountry: 'US',
            locale:       {
                lang:    'en',
                country: 'US'
            },
            clientId:  'ARSwS0VNqpmnu-zumKX2ZNxfKLHV9M86WS61-hWy8iMezFS8wIoFaFSwIiiKo2t73O1K_zQ6n6WbrYBD',
            buyerIp:   '',
            currency:  'USD',
            cookies:   window.document.cookie || ''
        };

        const extra = {
            commit:          false,
            intent:          INTENT.CAPTURE,
            vault:           false,
            buttonSessionID: '',
            renderedButtons: [],
            label:           'checkout',
            period:          0,
            taglineEnabled:  true,
            layout:          'horizontal',
            buttonSize:      ''
        };
        await fetchPersonalizations({ mlContext, eligibility: {}, extra })
            .then(experiments => {
                let found = false;
                experiments.forEach(experiment => {
                    if (experiment.name === 'tagline' && experiment.tracking !== null && experiment.treatment !== null) {
                        found = true;
                        graphQLMock.done();
                    }
                });

                if (!found) {
                    throw new Error(`Expected tagline experiment to be returned.`);
                }
            });

    });
});
