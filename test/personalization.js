/* @flow */

import { adaptPersonalizationToExperiments, eligiblePersonalizations } from '../src';

declare var beforeEach : function;
declare var describe : function;
declare var it : function;

describe(`personalization cases`, () => {
    it('should successfully filter eligible personalizations', () => {
        const payload = {
            tagline: {
                text:           'Shop now. Pay over time',
                tracking:   {
                    impression: '',
                    click:      ''
                }
            },
            buttonText:         null,
            buttonAnimation:    null
        };
        const props = {
            style: {
                tagline: true
            }
        };
        
        const personalizations = adaptPersonalizationToExperiments(payload);
        const eligible = eligiblePersonalizations({ personalizations, props });

        if (!eligible) {
            throw new Error(`Tagline experiments should have been eligible.`);
        }
    });
});
