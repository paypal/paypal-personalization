/* @flow */

export const PPLogo = (logoColor : string, PAYPAL_LOGO : string) : HTMLElement => {

    const PP_LOGO_COLORS = {
        black: {
            primary:          '#ffffff',
            primaryOpacity:   '0.7',
            secondary:        '#ffffff',
            secondaryOpacity: '0.7',
            tertiary:         '#ffffff'
        },
        blue: {
            primary:          '#ffffff',
            primaryOpacity:   '0.7',
            secondary:        '#ffffff',
            secondaryOpacity: '0.7',
            tertiary:         '#ffffff'
        }
    };

    const primary = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].primary) || '#009cde';
    const secondary = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].secondary) || '#012169';
    const tertiary = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].tertiary) || '#003087';
    const primaryOpacity = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].primaryOpacity) || '1';
    const secondaryOpacity = (PP_LOGO_COLORS[logoColor] && PP_LOGO_COLORS[logoColor].secondaryOpacity) || '1';
    const tertiaryOpacity = '1';

    const ppLogo = document.createElement('div');
    ppLogo.innerHTML = `
      <svg width="24" height="32" viewBox="0 0 24 32" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
          <path fill=${ primary } opacity=${ primaryOpacity } d="M 20.924 7.157 C 21.204 5.057 20.924 3.657 19.801 2.357 C 18.583 0.957 16.43 0.257 13.716 0.257 L 5.758 0.257 C 5.29 0.257 4.729 0.757 4.634 1.257 L 1.358 23.457 C 1.358 23.857 1.639 24.357 2.107 24.357 L 6.975 24.357 L 6.694 26.557 C 6.6 26.957 6.881 27.257 7.255 27.257 L 11.375 27.257 C 11.844 27.257 12.311 26.957 12.405 26.457 L 12.405 26.157 L 13.247 20.957 L 13.247 20.757 C 13.341 20.257 13.809 19.857 14.277 19.857 L 14.84 19.857 C 18.864 19.857 21.954 18.157 22.89 13.157 C 23.358 11.057 23.172 9.357 22.048 8.157 C 21.767 7.757 21.298 7.457 20.924 7.157 L 20.924 7.157" />
          <path fill=${ secondary } opacity=${ secondaryOpacity } d="M 20.924 7.157 C 21.204 5.057 20.924 3.657 19.801 2.357 C 18.583 0.957 16.43 0.257 13.716 0.257 L 5.758 0.257 C 5.29 0.257 4.729 0.757 4.634 1.257 L 1.358 23.457 C 1.358 23.857 1.639 24.357 2.107 24.357 L 6.975 24.357 L 8.286 16.057 L 8.192 16.357 C 8.286 15.757 8.754 15.357 9.315 15.357 L 11.655 15.357 C 16.243 15.357 19.801 13.357 20.924 7.757 C 20.831 7.457 20.924 7.357 20.924 7.157" />
          <path fill=${ tertiary } opacity=${ tertiaryOpacity } d="M 9.504 7.157 C 9.596 6.857 9.784 6.557 10.065 6.357 C 10.251 6.357 10.345 6.257 10.532 6.257 L 16.711 6.257 C 17.461 6.257 18.208 6.357 18.772 6.457 C 18.958 6.457 19.146 6.457 19.333 6.557 C 19.52 6.657 19.707 6.657 19.801 6.757 C 19.894 6.757 19.987 6.757 20.082 6.757 C 20.362 6.857 20.643 7.057 20.924 7.157 C 21.204 5.057 20.924 3.657 19.801 2.257 C 18.677 0.857 16.525 0.257 13.809 0.257 L 5.758 0.257 C 5.29 0.257 4.729 0.657 4.634 1.257 L 1.358 23.457 C 1.358 23.857 1.639 24.357 2.107 24.357 L 6.975 24.357 L 8.286 16.057 L 9.504 7.157 Z" />
      </svg>
  `;

    ppLogo.classList.add(`${ PAYPAL_LOGO }-pp`);

    return ppLogo;
};