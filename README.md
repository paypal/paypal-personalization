# Personalization
Definition, eligibility and personalization of PayPal experiments.

## Defining experiments
Experiment definitions are added under the `experiments` folder.  The folder name should be the experiment name as it would be returned from calling the `checkoutCustomization`API.

Experiments can be defined in multiple ways. You can inject HTML, CSS and JavaScript. Typically the injected JavaScript will use the use what has been defined in the `html.js` file to be injected at the approriate location in the DOM.  The `eligibility.js` file is used to provide any client-side eligibility requirements, such as for taglines, that the `tagline` style has been set in the props.

**In-progress**
> For experiments that do not personalize the user experience, such as ramping scenarios, you would set eligibility requirements in the `eligibility.js` file.

## Personalization API

### Request

### Response

## FAQ

### What belongs in this repo?
Any experiments whether for ramping or personalization.

