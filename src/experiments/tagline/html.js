/* @flow */

export const html = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    return `
        <img class='tracking-beacon' src='${ personalization?.tracking?.impression }'' />
    `;
};
