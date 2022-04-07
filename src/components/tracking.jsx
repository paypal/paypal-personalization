/* @flow */
/* @jsx node */

import { html, node } from '@krakenjs/jsx-pragmatic/src';

export function TrackingStyle() : string {
    return `
        .tracking-beacon {
            visibility: hidden;
            position: absolute;
            height: 1px;
            width: 1px;
        }
    `;
}

export function TrackingBeacon({ url } : {| url : string |}) : string {
    return (
        <img class='tracking-beacon' src={ url } />
    ).render(html());
}
