# Personalization
Definition, eligibility and personalization of PayPal experiments.

## Convention
### Experiments
Experiment definitions are added under the `experiments` folder.  The folder name should be the experiment name as it would be returned from calling the `checkoutCustomization`API.

#### Treatments (future)
Create a `treatments` folder within each personalization definition with as many treatments as are defined by the experiment.  For each treatment, create a folder with it's treatment name as will be defined in the response.

#### HTML
``` javascript
type Html = ({| personalization? : ?PersonalizationResponse |}) => string;
```
Define the HTML to be injected into the DOM for the experiment in a file named, `html.js` under the root folder of the defined experiment. Export a function named `html`.

#### CSS
``` javascript
type Style = ({| personalization? : ?PersonalizationResponse |}) => string;
```
Define the CSS to be injected into the `<style>` for the experiment in a file named, `style.js` under the root folder of the defined experiment.  Export a function named `style`.

#### JS
``` javascript
type Script = ({| personalization? : ?PersonalizationResponse |}) => string;
```
Define the JS to be injected into the `<script>` for the experiment in a file named, `script.js` under the root folder of the defined experiment.  Export a function named `script`.

#### Eligibility
``` javascript
type Eligibility = ({| props : ButtonProps |}) => boolean;
```
Define the client-side eligibility requirements for the experiment in a file named, `eligibility.js` under the root folder of the defined experiment.  Export a function named `isEligible`.  This function takes in the allowable `ButtonProps` defined in `types.js`.  Add to this as needed if new experiments require other button props to be passed in.

#### PersonalizationResponse
``` javascript
type PersonalizationResponse = {|
    text : string,
    tracking : {|
        impression : string,
        click : string
    |}
|};
```
**In-progress**
> For experiments that do not personalize the user experience, such as ramping scenarios, you would set eligibility requirements in the `eligibility.js` file.

## Personalization API
### Types
#### MLContext
``` javascript
type MLContext = {|
    userAgent? : string,
	  buyerCountry : $Values<typeof COUNTRY>,
	  merchantCountry? : $Values<typeof COUNTRY>,
	  locale : LocaleType,
	  clientId : string,
	  buyerIp? : string,
	  currency? : $Values<typeof CURRENCY>,
	  cookeis? : string
|}
```

#### FundingEligibilityType
``` javascript
type FundingEligibilityType = {|
    paypal? : PayPalEligibility,
    card? : CardEligibility,
    venmo? : BasicEligibility,
    applepay? : BasicEligibility,
    credit? : BasicEligibility,
    paylater? : PayLaterEligibility,
    sepa? : BasicEligibility,
    bancontact? : BasicEligibility,
    eps? : BasicEligibility,
    giropay? : BasicEligibility,
    ideal? : BasicEligibility,
    mybank? : BasicEligibility,
    p24? : BasicEligibility,
    sofort? : BasicEligibility,
    wechatpay? : BasicEligibility,
    zimpler? : BasicEligibility,
    itau? : BasicEligibility,
    payu? : BasicEligibility,
    verkkopankki? : BasicEligibility,
    blik? : BasicEligibility,
    boleto? : BasicEligibility,
    maxima? : BasicEligibility,
    oxxo? : BasicEligibility,
    trustly? : BasicEligibility,
    mercadopago? : BasicEligibility,
    multiblanco? : BasicEligibility
|};
```

#### Extra
This is defined as extra as it will most likely be removed in the future and want to be able to easily remove this data that gets passed into Personalization API.
``` javascript
type Extra = {|
    intent? : $Values<typeof INTENT>,
    commit? : $Values<typeof COMMIT>,
    vault? : boolean,
    merchantID? : $ReadOnlyArray<string>,
    buttonSessionID? : string,
    label? : string,
    period? : number,
    taglineEnabled : boolean,
    renderedButtons? : $ReadOnlyArray<string>,
    layout? : string,
    buttonSize? : string
|};
```

### Methods
#### fetchPersonalizations
Calls graphQL `checkoutCustomization` query in xobuyernodeserv to fetch server-side eligible personalization experiments. Typically server-side eligible equates to whether the merchant is eligible.
``` javascript
const fetchPersonalizations = ({ mlContext, eligibility, extra } : {| mlContext : MLContext, eligibility : FundingEligibilityType, extra : Extra |}) : ZalgoPromise<$ReadOnlyArray<Personalization>>
```

#### eligiblePersonalizations
Client-side eligibility defined in `eligiblity.js` of each experiment.  `isEligible` is called on each server-side eligible personalization.  
``` javascript
const eligiblePersonalizations = ({ personalizations = [], props } : {| personalizations : $ReadOnlyArray<Personalization>, props : ButtonProps |}) : $ReadOnlyArray<Personalization>
```

### Response
Current possible personalization experiments that could be returned. This format is likely to change in the future.
``` javascript
{
		tagline {
				text
				tracking {
						impression
						click
				}
		}
		buttonText {
				text
				tracking {
						impression
						click
				}
		}
		buttonDesign {
				id
				text
				tracking {
						impression
						click
				}
		}
}
```

## FAQ

### What belongs in this repo?
Any experiments whether for ramping or personalization.

