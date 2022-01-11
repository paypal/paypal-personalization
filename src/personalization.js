/* @flow */

import type { ButtonProps, Personalization } from './types';
// eslint-disable-next-line import/no-namespace
import * as experiments from './experiments';

export const eligiblePersonalizations = ({ personalizations = [], props } : {| personalizations : $ReadOnlyArray<Personalization>, props : ButtonProps |}) : $ReadOnlyArray<Personalization> => {
    return personalizations.filter(personalization => {
        // eslint-disable-next-line import/namespace
        return experiments[personalization.name].eligible({ props });
    });
};
