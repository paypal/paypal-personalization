/* @flow */

export const html = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    if (personalization?.tracking?.impression) {
        return `
            <img class='tracking-beacon' src='${ personalization?.tracking?.impression }' />
        `;
    } else {
        return '';
    }
};
