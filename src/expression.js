/* @flow */

import type { UserContext } from './types';

/**
 *  Expression language for determining decision for personalization based on user context
 `
  {
    tagline: {
      treatments: {
        "['AND', ['EQ', 'timeOfDay', 'afternoon'], ['GT', 'age', 40]]": {
          tag0: 0.93,
          tag1: 0.05,
          tag2: 0.02
        },
        "['AND', ['EQ', 'timeOfDay', 'evening'], ['EQ', 'timezone', 'Eastern']]": {
          tag0: 0.86,
          tag1: 0.10,
          tag2: 0.04
        },
        "['TRUE']": {
          tag0: 0.33,
          tag1: 0.33,
          tag2: 0.33
        }
      },
      tracking: {
        context:    '<url>',
        impression: '<url>',
        metric:     '<url>'
      }
    }
  }
 `
 */

// Logical Operators
const and = (params) => {
    return params.reduce((acc, val) => acc && val, true);
};
const or = (params) => {
    return params.reduce((acc, val) => acc || val, true);
};
const not = (x) => {
    return !x;
};

// Mathmetical Operators
const add = (params) => {
    return params.reduce((acc, val) => acc + val, 0);
};
const multiply = (params) => {
    return params.reduce((acc, val) => acc * val, 1);
};
const eq = (params) => {
    const [ firstParam, ...restParams ] = params;
    return restParams.reduce((acc, val) => acc === val, firstParam);
};

export const processExpression = ({ context, expression } : {| context : UserContext, expression : string |}) : boolean => {
    if (context) {
        Object.keys(context).forEach(key => {
            expression.replace(key, context[key]);
        });
    }
    const parsedExpression = JSON.parse(expression);

    const [ operand, ...params ] = parsedExpression;
    
    const complexExpression = params.reduce((acc, val) => acc || Array.isArray(val), false);
    if (complexExpression) {
        const reducedExpression = parsedExpression.map(val => {
            if (Array.isArray(val)) {
                return processExpression({ context, expression: JSON.stringify(val) });
            }

            return val;
        });

        return processExpression({ context, expression: JSON.stringify(reducedExpression) });
    }
    
    switch (operand) {
    case 'AND':
        return and(params);
    case 'OR':
        return or(params);
    case 'NOT':
        return not(params);
    case 'TRUE':
        return true;
    case 'ADD':
        return add(params);
    case 'MULT':
        return multiply(params);
    case 'EQ':
        return eq(params);
    default:
        throw new Error(`Invalid operand ${ operand }`);
    }
};
