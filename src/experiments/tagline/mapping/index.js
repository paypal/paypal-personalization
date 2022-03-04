/* @flow */

import type { getTaglineContentProps } from '../../../types';
import { EXPERIMENTS } from '../../../constants';

import { TAGLINES } from './taglines';

export const getTaglineContent = (props : getTaglineContentProps) : string => {
    const { locale, taglinesPredictions, experimentName } = props;
    const bestPrediction = [ ...taglinesPredictions ].sort((a, b) => a.score - b.score)[taglinesPredictions.length - 1];
    const key = bestPrediction.tagline;
    let tagline;

    switch (experimentName) {
    case EXPERIMENTS.SINGLE_BUTTON:
        tagline = TAGLINES[key][locale] || TAGLINES.pay_now_pay_later.en_US;
        break;
    case EXPERIMENTS.MULTI_BUTTON:
        tagline = TAGLINES[key][locale] || TAGLINES.two_easy_ways.en_US;
        break;
    case EXPERIMENTS.LLS_TAGLINE:
        tagline = TAGLINES[key][locale] || TAGLINES.skip_password.en_US;
        break;
    default:
        tagline = TAGLINES.safe_easy_way.en_US;
        break;
    }

    return tagline;
};
