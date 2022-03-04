/* @flow */

import { INTENT } from '@paypal/sdk-constants/src';
import { patchXmlHttpRequest } from 'sync-browser-mocks/dist/sync-browser-mocks';

import { fetchPersonalizations } from '../src';
import { EXPERIMENTS } from '../src/constants';
import { TAGLINES } from '../src/experiments/tagline/mapping/taglines';
import { getTaglineContent } from '../src/experiments/tagline/mapping';


import { getGraphQLApiMock } from './mocks';

declare var beforeEach : function;
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

describe('method to return the correct tagline translation according to the mapping id', () => {
    it('should return the french translation for Pay now or pay later', () => {
        const mlModelReturn = {
            locale:              'fr_FR',
            taglinesPredictions: [
                {
                    tagline:    'buy_now_pay_later',
                    score:      0.5106762924323349
                },
                {
                    tagline:    'pay_now_pay_later',
                    score:      0.550356122821681
                },
                {
                    tagline:    'safe_easy_way',
                    score:      0.5048634661983218
                },
                {
                    tagline:    'shop_now_pay_over_time',
                    score:      0.5073325073436752
                }
            ]
        };

        const tagline = getTaglineContent({ ...mlModelReturn, experimentName: EXPERIMENTS.SINGLE_BUTTON });
        if (tagline !== TAGLINES.pay_now_pay_later.fr_FR) {
            throw new Error(`Expected '${ TAGLINES.pay_now_pay_later.fr_FR }' tagline to be returned.`);
        }
    });

    it('should return the default translation (en_US) for Pay now or pay later if there is no translation', () => {
        const mlModelReturn = {
            locale:              'pt_BR',
            taglinesPredictions: [
                {
                    tagline:    'buy_now_pay_later',
                    score:      0.5106762924323349
                },
                {
                    tagline:    'pay_now_pay_later',
                    score:      0.550356122821681
                },
                {
                    tagline:    'safe_easy_way',
                    score:      0.5048634661983218
                },
                {
                    tagline:    'shop_now_pay_over_time',
                    score:      0.5073325073436752
                }
            ]
        };

        const tagline = getTaglineContent({ ...mlModelReturn, experimentName: EXPERIMENTS.SINGLE_BUTTON });
        if (tagline !== TAGLINES.pay_now_pay_later.en_US) {
            throw new Error(`Expected '${ TAGLINES.pay_now_pay_later.en_US }' tagline to be returned.`);
        }
    });
});
