/* @flow */

export const style = ({ personalization } : {| personalization : {| text : string, tracking : {| impression : string, click : string |} |} |}) : string => {
    if (personalization?.tracking?.impression) {
        return `
            .tracking-beacon {
                visibility: hidden;
                position: absolute;
                height: 1px;
                width: 1px;
            }
        `;
    } else {
        return '';
    }
};
