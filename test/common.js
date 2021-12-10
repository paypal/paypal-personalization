/* @flow */

import { noop } from 'belter/src';

function clearErrorListener() {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onerror = noop;
}

declare var beforeEach : function;
beforeEach(() => {
    clearErrorListener();
});

window.console.karma = function consoleKarma() {
    const karma = window.karma || (window.top && window.top.karma) || (window.opener && window.opener.karma);
    karma.log('debug', arguments);
    console.log.apply(console, arguments); // eslint-disable-line no-console
};
