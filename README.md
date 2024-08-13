# marketplace_api

MarketplaceApi - JavaScript client for marketplace_api

# About  
The Marketplace API delivers data that helps users find and evaluate health care insurance plans, providers, and coverage information on the marketplace. It’s used by [HealthCare.gov](https://healthcare.gov) and other third party services. Request an API token [here](https://developer.cms.gov/marketplace-api/key-request.html), or learn more from [the developer site](https://developer.cms.gov/marketplace-api/).  
## Retention  
Marketplace API data includes at minimum the last three years of data.  ## Limitations  API keys are rate limited. This rate limit is passed along in the Header information provided. If you have concerns with the rate limit, please reach out to the [Marketplace API team](mailto:marketplace-api@cms-provider-directory.uservoice.com).  
# Quickstart  
This section will cover a short workflow for a common scenario — looking up insurance plans for a person's household with premiums and estimated tax credits, obtaining details about a particular plan, and looking up the drug coverage for a specific plan. Other endpoints,   like looking up doctors and providers, or getting recent state medicaid information,  are covered in the docs.  
## Search for health insurance plans  
We begin by searching for the health insurance plans for a 27 year-old woman living in North Carolina by posting a single person household to the plan search endpoint  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" # rate limited test key curl --request POST \\\\   --url \"https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${apikey}\" \\\\   --header 'content-type: application/json' \\\\   --data '{     \"household\": {       \"income\": 52000,       \"people\": [         {           \"age\": 27,           \"aptc_eligible\": true,           \"gender\": \"Female\",           \"uses_tobacco\": false         }       ]     },     \"market\": \"Individual\",     \"place\": {       \"countyfips\": \"37057\",       \"state\": \"NC\",       \"zipcode\": \"27360\"     },     \"year\": 2019 }' ```  This **POST** request returns health insurance information and pricing estimates for the plans for which she can sign up. More discussion about building the household JSON object can be found later on this page. Don't know the county [FIPS](https://en.m.wikipedia.org/wiki/FIPS_county_code) code? To look it up for this person's zip code, we use the counties by zip endpoint.  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" zipcode=\"27360\" curl \"https://marketplace.api.healthcare.gov/api/v1/counties/by/zip/${zipcode}?apikey=${apikey}\" ```  This helps gather the necessary information to build the household object to submit to the API.  ## Get details about a specific health insurance plan  With a plan search completed, let's look more closely at a particular plan. For example, **Blue Cross Blue Shield of North Carolina Blue Value Catastrophic** was one of the first returned from the example above. We will use it as an example to drill down  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" planid=\"11512NC0100031\" year=\"2019\" curl \"https://marketplace.api.healthcare.gov/api/v1/plans/${planid}?year=${year}&apikey=${apikey}\" ```  Using this endpoint will provide more granular information about the particular plan for a searching user, like issuer information, cost sharing deductibles, eligible dependents, website urls, quality ratings, and more.  
## Standard Plans  
Some plans are considered **standard plans.** These can be identified in the results of a plan search or plan details endpoint.  If a plan has a **design_type** that is one of the following, it is considered a standard plan: \"DESIGN1\", \"DESIGN2\", \"DESIGN3\", \"DESIGN4\", \"DESIGN5\".  If a plan has a **design_type** of \"NOT_APPLICABLE\", then it is not considered a standard plan.  
## Get drug coverage information about a health insurance plan  
Now that we have a plan of interest, let's look up what drugs it covers. We want to know if **ibuprofen** is covered under the insurance plan. First, we can mimic a user interaction with an autocomplete for ibuprofen for a typeahead.  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" query=\"ibuprof\" curl \"https://marketplace.api.healthcare.gov/api/v1/drugs/autocomplete?q=${query}&apikey=${apikey}\" ```  Among other things, this provides us with an **RxCUI**, a unique identifier for a clinical drug. We can use it along with the plan id to query the API for whether or not **ibuprofen** is covered under this plan  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" drugs=\"1049589\" planids=\"11512NC0100031\" year=\"2019\" curl \"https://marketplace.api.healthcare.gov/api/v1/drugs/covered?year=${year}&drugs=${drugs}&planids=${planids}&apikey=${apikey}\" ```  The API confirms that ibuprofen is covered.  # More information about households  
The household in the example above was sufficient to query Marketplace API, but there are more optional fields that can provide more accurate search results and premium estimates, or can be used by application developers to specify scenarios. For example, if a household does not live together, certain plans may no longer be eligible to them.  We begin with an example, describing what some of the less intuitive fields means. Here's the JSON of a fully filled in household, using all possible features  ``` {   \"aptc_override\": 288.61,   \"household\": {     \"effective_date\": \"2019-05-01\",     \"has_married_couple\": true,     \"income\": 52000,     \"unemployment_received\": Adult,     \"people\": [       {         \"age\": 27,         \"dob\": \"1992-01-01\",         \"aptc_eligible\": true,         \"does_not_cohabitate\": false,         \"gender\": \"Female\",         \"has_mec\": false,         \"is_parent\": false,         \"is_pregnant\": false,         \"relationship\": \"Self\",         \"uses_tobacco\": false,         \"utilization\": \"Medium\"       },       {         \"age\": 25,         \"dob\": \"1994-03-03,         \"aptc_eligible\": true,         \"does_not_cohabitate\": false,         \"gender\": \"Male\",         \"has_mec\": false,         \"is_parent\": false,         \"is_pregnant\": false,         \"relationship\": \"Spouse\",         \"uses_tobacco\": false,         \"utilization\": \"Medium\"       }     ]   },   \"market\": \"Individual\",   \"place\": {     \"countyfips\": \"37057\",     \"state\": \"NC\",     \"zipcode\": \"27360\"   },   \"year\": 2019 } ```  
## APTC Override 
The `aptc_override` is an optional override to specify the Advanced Premium Tax Credit for a user, if the exact value is already known. For persons in the household, `aptc_eligible` denotes if the person is eligible for the Advanced Premium Tax Credit.  ## Unemployment Received As part of the American Rescue Plan, if the household has received unemployment benefits during 2021 the household income must be capped to 133% of the Federal Poverty Level for the household size in APTC and CSR estimations.  If the recipient is an adult tax payer, both ATPC and CSRs will be affected.  If only a tax dependent received unemployment, the only effect will be to CSR eligibility. If both an adult and dependent have received unemployment, \"Adult\" should be passed so that the maximum APTC and CSRs are received. This field defaults to None if not included and only affects the 2021 market year.  ## Effective Date This is the date a plan or coverage goes into effect and is used in premium calculations and determining eligibility. If omitted, the value defaults to the effective date of the plan, which is generally Jan 1 of the market year. The `effective_date` is required to correctly calculate the number of months since an individual has used tobacco. The number of months is the difference of the last tobacco use date until the `effective_date`. Considering the number of months since last tobacco use can impact the rate charged by a plan, this field is required to be included for a more accurate search result.  ## Age Calculation Either an `age` or `dob` value must be provided.  If `age` is provided that value is used in determining eligibility and premiums. If a `dob` is provided, a more accurate age is calculated using the combination of `dob`, the effective date, and plan specific rating-age adjustments.  If both fields are populated, `age` takes precedence and no calculation will occur.  Plan rates can have age adjustments affecting what premiums get returned.  Additionally, effective date in relation to age affects premium calculation and eligibility.  Therefore, determining the correct age is important for accurate results.  ## Cohabitation `does_not_cohabitate` indicates whether the person is living with the household.  ## Minimal Essential Coverage (MEC) `has_mec` indicates whether a person has Medicaid/CHIP and may possibly not be included in the household for premium determination and insurance eligibility.  ## Relationship `relationship` — which is not required to issue a request — is the relationship of a household member to the person applying for health insurance. For the main enrollee, the `Self` relationship is used.  Each plan on the marketplace defines a set of dependent relationships within a household as eligible to enroll in that plan.  If it is known by the caller what relationships exist within a household when making a request to Marketplace API, the API can more accurately determine household eligibility for plans.  If the relationship field is used in a request, it must be a valid relationship for the provided market year (see list below). When a household request is sent without relationships present in the household, Marketplace API will make as accurate an eligibility determinaton as possible without the relationship values.  The total set of dependent relationships that plans may use to restrict eligibility may change over the years. For 2020 and 2021, the possible relationship types that plans may utilize are as follows  2020                              | 2021 --------------------------------- | --------------------------- `Self`                            | `Self` `Brother or Sister`               | `Brother or Sister` `Child`                           | `Child` `Collateral Dependent`            | `Collateral Dependent` `Ex-Spouse`                       | `Ex-Spouse` `Foster Child`                    | `Foster Child` `Grandson or Granddaughter`       | `Grandson or Granddaughter` `Life Partner`                    | `Life Partner` `Nephew or Niece`                 | `Nephew or Niece` `Other Relationship`              | `Other Relationship` `Other Relative`                  | `Other Relative` `Sponsored Dependent`             | `Sponsored Dependent` `Spouse`                          | `Spouse` `Stepson or Stepdaughter`         | `Stepson or Stepdaughter` `Ward`                            | `Ward` `Adopted Child`                   | `Annultant`                       | `Brother-in-Law or Sister-in-Law` | `Court Appointed Guardian`        | `Dependent of a Minor Dependent`  | `Guardian`                        | `Son-in-Law or Daughter-in-Law`   | `Stepparent`                      |  As can be seen from this list, the list of potential relationships has been simplified between 2020 and 2021. When a relationship is not one of the obvious choices in this list, the fallback values of `Other Relative` and `Other Relationship` may be used.  ## Utilization Finally, `utilization` is one of `{\"Low\", \"Medium\", \"High\"}` and is a description of how much a person intends to use their health insurance.  
# Understanding Errors 
The Marketplace API returns standard HTTP status codes which indicate whether a specific HTTP request has successfully completed. For some errors, additional information is provided in the response body, including an application error code and a brief message.  
## HTTP Response Status Codes 
Responses are grouped in five classes:   - Successful responses (200–299)   - Client errors (400–499)   - Server errors (500–599)  ## Marketplace API Error Codes The various codes are listed below:  1000 - errInternalServerError | ----- The Internal Server Error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.   ```     Request:  GET /api/v1/drugs/search?q=...     Response: {                 \"code\": \"1000\",                 \"status\": \"500\",                 \"message\": \"Internal server error\",                 \"error\": \"sql: Scan called without calling Next\"               } ``` 1001 - errCountyNotFound | ----- This error code is returned by the [County Lookup by FIPS](#reference/geography/county-lookup-by-fips/get) endpoint when no county is found using the  FIPS provided in the request. For example:   ```     Request:   GET /api/v1/counties/35094     Response:  {                   \"code\": \"1001\",                   \"status\": \"404\",                   \"message\": \"county not found\"                   \"error\": \"sql: No records found\"                 } ``` 1002 - errStateNotFound | ----- This error code is returned by the [Lookup State](#reference/geography/lookup-state/get) endpoint when no state is found using the state provided in the request. For example:   ```     Request:   GET /api/v1/states/NP     Response:  {                   \"code\": \"1002\",                   \"status\": \"404\",                   \"message\": \"state not found\"                   \"error\": \"sql: No records found\"                 } ``` 1003 - errInvalidInput  | ----- This error code is returned by various endpoints when the required input is invalid. The message provided in the response will assist in resolving the problem before re-sending the request. For example:   ```     Request:   GET /api/v1/issuers/1019     Response:  {                     \"code\": \"1003\",                     \"status\": \"400\",                     \"message\": \"invalid issuers request\"                     \"error\": \"invalid issuer ID format\"                 } ``` 1004 - errIssuerNotFound  | ----- This error code is returned by the [Get Issuer](#reference/insurance-issuers/get-issuer/get-issuer) endpoint when no issuer is found using the issuer id provided in the request. For example:   ```     Request:   GET /api/v1/issuers/01922     Response:  {                   \"code\": \"1004\",                   \"status\": \"404\",                   \"message\": \"issuer not found\"                   \"error\": \"sql: No records found\"                 } ``` 1005 - errCrosswalkNotFound  | ----- This error code is returned by the [Crosswalk a previous year plan](#reference/insurance-plans/plan-crosswalk/crosswalk-a-previous-year-plan) endpoint when no crosswalk is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/crosswalk&year=2018&plan_id=53882IL0040002&state=IN                &zipcode=60647&fips=17031     Response:  {                   \"code\": \"1005\",                   \"status\": \"404\",                   \"message\": \"No crosswalk found for those parameters\"                   \"error\": \"sql: No records found\"                 } ``` 1006 - errPlanNotFound  | ----- This error code is returned by various endpoints when no plan is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/plans/11512NC0100035     Response:  {                   \"code\": \"1006\",                   \"status\": \"404\",                   \"message\": \"Plan not found\"                   \"error\": \"sql: No records found\"                 } ``` 1007 - errTimeout  | ----- This error code is returned by various endpoints when the request timed out. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1007\",                   \"status\": \"500\",                   \"message\": \"request timed-out, try again\"                   \"error\": \"db query timed-out\"                 } ``` 1008 - errStateMedicaidNotFound  | ----- This error code is returned by the [State Medicaid Data](#reference/geography/state-medicaid-data/get) endpoint when no medicaid is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/states/NV/medicaid     Response:  {                   \"code\": \"1008\",                   \"status\": \"404\",                   \"message\": \"state medicaid not found\"                   \"error\": \"year out of range\"                 } ``` 1009 - errPovertyGuidelineNotFound  | ----- This error code is returned by the [State Poverty Guidelines](#reference/geography/state-poverty-guidelines/get) endpoint when no U.S. federal poverty guidelines is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/states/XX/poverty-guidelines     Response:  {                   \"code\": \"1009\",                   \"status\": \"400\",                   \"message\": \"poverty guideline not found\"                   \"error\": \"sql: No records found\"                 } ``` 1010 - errPercentageFPLNotFound  | ----- This error code is returned by the [Poverty Level Percentage](#reference/households-&-eligibility/poverty-level-percentage/get) endpoint when no percentage of federal poverty level is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/households/pcfpl&year=2021&state=NV&size=2&income=14000     Response:  {                   \"code\": \"1010\",                   \"status\": \"404\",                   \"message\": \"percentage of federal poverty level not found\"                   \"error\": \"guideline not found for state: NV, year: 2021\"                 } ``` 1011 - errQualityRatingNotFound  | ----- This error code is returned by the [Quality Ratings](#reference/insurance-plans/quality-ratings/get) endpoint when there are no quality ratings for a plan. For example:   ```     Request:   GET /api/v1/plans/XXXXXXXXXXX/quality-ratings&year=2021     Response:  {                   \"code\": \"1011\",                   \"status\": \"404\",                   \"message\": No quality rating found for those parameters\"                   \"error\": \"sql: No records found\"                 } ``` 1012 - errCoverageUnavailable  | ----- This error code is returned by various endpoints when the coverage data is temporarily unavailable. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1012\",                   \"status\": \"503\",                   \"message\": \"coverage data temporarily unavailable\"                   \"error\": \"coverage database unavailable\"                 } ``` 1013 - errProviderNotFound  | ----- This error code is returned by various Provider related endpoints when the provider is not found. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1013\",                   \"status\": \"404\",                   \"message\": \"provider not found\"                   \"error\": \"sql: No records found\"                 } ``` 1014 - errDrugNotFound  | ----- This error code is returned by various Drug related endpoints when the drug is not found. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1014\",                   \"status\": \"404\",                   \"message\": \"drug not found\"                   \"error\": \"sql: No records found\"                 } ``` 1015 - errMissingMedicaidCHIPEligibility  | ----- This error code is returned when no Medicaid CHIP Eligibility plans are found using the parameters provided in the request.   ```     Request:   POST /api/v1/households/eligibility/estimates     Response:  {                   \"code\": \"1015\",                   \"status\": \"404\",                   \"message\": \"missing medicaid eligibility data\"                   \"error\": \"missing eligibility for fiscal year: YYYY, quarter: Q, state: SS\"                 } ``` 1016 - errTooFewPlans  | ----- This error code is returned when there are not enough plans in a given service area to compute a second lowest cost silver plan for an example, the errTooFewPlans code may be returned.   ```     Request:   POST /api/v1/households/eligibility/estimates     Response:  {                   \"code\": \"1016\",                   \"status\": \"404\",                   \"message\": \"not enough plans to calculate SLCSP/LCBP\"                   \"error\": \"not enough plans to calculate SLCSP/LCBP\"                 } ``` 1017 - errRateAreaNotFound  | ----- This error code is returned by various Drug related endpoints when the rate area is not found. For example:   ```     Request:   GET /api/v1/rate-areas?state=IN&zipcode=60647&fips=17031     Response:  {                   \"code\": \"1017\",                   \"status\": \"404\",                   \"message\": \"rate area not found\"                   \"error\": \"No rate area could be determined\"                 } ```  
## Marketplace API Common Error Codes 
``` 400 Bad Request - Client supplied invalid or incorrect values to the requested end-point 404 Not Found - End-point could not find the requested object(s) ````  
## Marketplace API Uncommon Error Codes 
``` 500 Internal Server Error - An unexpected error occurred 503 Service Unavailable - The requested service is temporarily unavailable, try again later. ```` 
This SDK is automatically generated by the [Swagger Codegen](https://github.com/swagger-api/swagger-codegen) project:

- API version: 1
- Package version: 1
- Build package: io.swagger.codegen.languages.JavascriptClientCodegen

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/),
please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install marketplace_api --save
```

##### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing 
into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

Finally, switch to the directory you want to use your marketplace_api from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

You should now be able to `require('marketplace_api')` in javascript files from the directory you ran the last 
command above from.

#### git
#
If the library is hosted at a git repository, e.g.
https://github.com/YOUR_USERNAME/marketplace_api
then install it via:

```shell
    npm install YOUR_USERNAME/marketplace_api --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file, that's to say your javascript file where you actually 
use this library):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var MarketplaceApi = require('marketplace_api');

var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = "YOUR API KEY"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix['apikey'] = "Token"

var api = new MarketplaceApi.APIReferenceApi()

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // {String} API key used for authentication


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.marketYearsGet(apikey, callback);

```

## Documentation for API Endpoints

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*MarketplaceApi.APIReferenceApi* | [**marketYearsGet**](docs/APIReferenceApi.md#marketYearsGet) | **GET** /market-years | 
*MarketplaceApi.APIReferenceApi* | [**versionsGet**](docs/APIReferenceApi.md#versionsGet) | **GET** /versions | 
*MarketplaceApi.DefaultApi* | [**plansPlanIdPost**](docs/DefaultApi.md#plansPlanIdPost) | **POST** /plans/{plan_id} | Get plan details with premiums for a household
*MarketplaceApi.EnrollmentsApi* | [**enrollmentValidatePost**](docs/EnrollmentsApi.md#enrollmentValidatePost) | **POST** /enrollment/validate | 
*MarketplaceApi.GeographyApi* | [**countiesByZipZipcodeGet**](docs/GeographyApi.md#countiesByZipZipcodeGet) | **GET** /counties/by/zip/{zipcode} | 
*MarketplaceApi.GeographyApi* | [**countiesFipsGet**](docs/GeographyApi.md#countiesFipsGet) | **GET** /counties/{fips} | 
*MarketplaceApi.GeographyApi* | [**rateAreasGet**](docs/GeographyApi.md#rateAreasGet) | **GET** /rate-areas | 
*MarketplaceApi.GeographyApi* | [**statesAbbrevGet**](docs/GeographyApi.md#statesAbbrevGet) | **GET** /states/{abbrev} | 
*MarketplaceApi.GeographyApi* | [**statesAbbrevMedicaidGet**](docs/GeographyApi.md#statesAbbrevMedicaidGet) | **GET** /states/{abbrev}/medicaid | 
*MarketplaceApi.GeographyApi* | [**statesAbbrevPovertyGuidelinesGet**](docs/GeographyApi.md#statesAbbrevPovertyGuidelinesGet) | **GET** /states/{abbrev}/poverty-guidelines | 
*MarketplaceApi.GeographyApi* | [**statesGet**](docs/GeographyApi.md#statesGet) | **GET** /states | 
*MarketplaceApi.HouseholdsEligibilityApi* | [**householdsEligibilityEstimatesPost**](docs/HouseholdsEligibilityApi.md#householdsEligibilityEstimatesPost) | **POST** /households/eligibility/estimates | 
*MarketplaceApi.HouseholdsEligibilityApi* | [**householdsIchraPost**](docs/HouseholdsEligibilityApi.md#householdsIchraPost) | **POST** /households/ichra | Get affordability and premium of the lowest cost silver plan
*MarketplaceApi.HouseholdsEligibilityApi* | [**householdsLcbpPost**](docs/HouseholdsEligibilityApi.md#householdsLcbpPost) | **POST** /households/lcbp | Get lowest cost bronze plan for a household
*MarketplaceApi.HouseholdsEligibilityApi* | [**householdsLcspPost**](docs/HouseholdsEligibilityApi.md#householdsLcspPost) | **POST** /households/lcsp | Get lowest cost silver plan
*MarketplaceApi.HouseholdsEligibilityApi* | [**householdsPcfplGet**](docs/HouseholdsEligibilityApi.md#householdsPcfplGet) | **GET** /households/pcfpl | 
*MarketplaceApi.HouseholdsEligibilityApi* | [**householdsSlcspPost**](docs/HouseholdsEligibilityApi.md#householdsSlcspPost) | **POST** /households/slcsp | Get second lowest cost silver plan
*MarketplaceApi.InsuranceIssuersApi* | [**issuersGet**](docs/InsuranceIssuersApi.md#issuersGet) | **GET** /issuers | List issuers
*MarketplaceApi.InsuranceIssuersApi* | [**issuersIssuerIdGet**](docs/InsuranceIssuersApi.md#issuersIssuerIdGet) | **GET** /issuers/{issuer_id} | Get issuer
*MarketplaceApi.InsurancePlansApi* | [**crosswalkGet**](docs/InsurancePlansApi.md#crosswalkGet) | **GET** /crosswalk | Crosswalk a previous year plan
*MarketplaceApi.InsurancePlansApi* | [**plansPlanIdGet**](docs/InsurancePlansApi.md#plansPlanIdGet) | **GET** /plans/{plan_id} | Get a plan
*MarketplaceApi.InsurancePlansApi* | [**plansPlanIdQualityRatingsGet**](docs/InsurancePlansApi.md#plansPlanIdQualityRatingsGet) | **GET** /plans/{plan_id}/quality-ratings | 
*MarketplaceApi.InsurancePlansApi* | [**plansPost**](docs/InsurancePlansApi.md#plansPost) | **POST** /plans | Get multiple plans
*MarketplaceApi.InsurancePlansApi* | [**plansSearchPost**](docs/InsurancePlansApi.md#plansSearchPost) | **POST** /plans/search | Search for insurance plans
*MarketplaceApi.InsurancePlansApi* | [**plansSearchStatsPost**](docs/InsurancePlansApi.md#plansSearchStatsPost) | **POST** /plans/search/stats | Retrieve stats on groups of insurance plans
*MarketplaceApi.ProviderDrugCoverageApi* | [**coverageSearchGet**](docs/ProviderDrugCoverageApi.md#coverageSearchGet) | **GET** /coverage/search | Search providers
*MarketplaceApi.ProviderDrugCoverageApi* | [**coverageStatsGet**](docs/ProviderDrugCoverageApi.md#coverageStatsGet) | **GET** /coverage/stats | Coverage statistics
*MarketplaceApi.ProviderDrugCoverageApi* | [**drugsAutocompleteGet**](docs/ProviderDrugCoverageApi.md#drugsAutocompleteGet) | **GET** /drugs/autocomplete | Autocomplete drugs by name
*MarketplaceApi.ProviderDrugCoverageApi* | [**drugsCoveredGet**](docs/ProviderDrugCoverageApi.md#drugsCoveredGet) | **GET** /drugs/covered | Get a list of whether drugs are covered by plans
*MarketplaceApi.ProviderDrugCoverageApi* | [**drugsSearchGet**](docs/ProviderDrugCoverageApi.md#drugsSearchGet) | **GET** /drugs/search | Search prescription drugs
*MarketplaceApi.ProviderDrugCoverageApi* | [**providersAutocompleteGet**](docs/ProviderDrugCoverageApi.md#providersAutocompleteGet) | **GET** /providers/autocomplete | Autocomplete nearby providers
*MarketplaceApi.ProviderDrugCoverageApi* | [**providersCoveredGet**](docs/ProviderDrugCoverageApi.md#providersCoveredGet) | **GET** /providers/covered | Get a list of whether a set of providers are covered by given plans
*MarketplaceApi.ProviderDrugCoverageApi* | [**providersSearchGet**](docs/ProviderDrugCoverageApi.md#providersSearchGet) | **GET** /providers/search | Search providers


## Documentation for Models

 - [MarketplaceApi.APTC](docs/APTC.md)
 - [MarketplaceApi.APTCAllocationResult](docs/APTCAllocationResult.md)
 - [MarketplaceApi.APTCEnrollee](docs/APTCEnrollee.md)
 - [MarketplaceApi.APTCEnrollmentGroup](docs/APTCEnrollmentGroup.md)
 - [MarketplaceApi.Address](docs/Address.md)
 - [MarketplaceApi.ApplicationError400](docs/ApplicationError400.md)
 - [MarketplaceApi.ApplicationError404](docs/ApplicationError404.md)
 - [MarketplaceApi.Benefit](docs/Benefit.md)
 - [MarketplaceApi.CSREligibilityEnum](docs/CSREligibilityEnum.md)
 - [MarketplaceApi.CSRRequestEnum](docs/CSRRequestEnum.md)
 - [MarketplaceApi.CertificationStatus](docs/CertificationStatus.md)
 - [MarketplaceApi.CostSharing](docs/CostSharing.md)
 - [MarketplaceApi.CostSharingReductionEnum](docs/CostSharingReductionEnum.md)
 - [MarketplaceApi.County](docs/County.md)
 - [MarketplaceApi.Coverage](docs/Coverage.md)
 - [MarketplaceApi.CurrentEnrollment](docs/CurrentEnrollment.md)
 - [MarketplaceApi.DataVersion](docs/DataVersion.md)
 - [MarketplaceApi.Deductible](docs/Deductible.md)
 - [MarketplaceApi.DesignTypeEnum](docs/DesignTypeEnum.md)
 - [MarketplaceApi.DiseaseMgmtProgramsEnum](docs/DiseaseMgmtProgramsEnum.md)
 - [MarketplaceApi.Drug](docs/Drug.md)
 - [MarketplaceApi.DrugCoverage](docs/DrugCoverage.md)
 - [MarketplaceApi.Eligibility](docs/Eligibility.md)
 - [MarketplaceApi.Enrollee](docs/Enrollee.md)
 - [MarketplaceApi.Enrollment](docs/Enrollment.md)
 - [MarketplaceApi.EnrollmentGroup](docs/EnrollmentGroup.md)
 - [MarketplaceApi.Estimate](docs/Estimate.md)
 - [MarketplaceApi.ExtendedEnrollee](docs/ExtendedEnrollee.md)
 - [MarketplaceApi.ExtendedEnrollment](docs/ExtendedEnrollment.md)
 - [MarketplaceApi.ExtendedEnrollmentEnrollmentGroups](docs/ExtendedEnrollmentEnrollmentGroups.md)
 - [MarketplaceApi.FamilyCostEnum](docs/FamilyCostEnum.md)
 - [MarketplaceApi.FlattenedEnrollmentGroup](docs/FlattenedEnrollmentGroup.md)
 - [MarketplaceApi.GenderEnum](docs/GenderEnum.md)
 - [MarketplaceApi.Guideline](docs/Guideline.md)
 - [MarketplaceApi.HRA](docs/HRA.md)
 - [MarketplaceApi.Household](docs/Household.md)
 - [MarketplaceApi.ICHRAResponse](docs/ICHRAResponse.md)
 - [MarketplaceApi.Ichra](docs/Ichra.md)
 - [MarketplaceApi.InlineResponse200](docs/InlineResponse200.md)
 - [MarketplaceApi.InlineResponse2001](docs/InlineResponse2001.md)
 - [MarketplaceApi.InlineResponse20010](docs/InlineResponse20010.md)
 - [MarketplaceApi.InlineResponse20010FacetGroups](docs/InlineResponse20010FacetGroups.md)
 - [MarketplaceApi.InlineResponse20010Facets](docs/InlineResponse20010Facets.md)
 - [MarketplaceApi.InlineResponse20010Ranges](docs/InlineResponse20010Ranges.md)
 - [MarketplaceApi.InlineResponse20011](docs/InlineResponse20011.md)
 - [MarketplaceApi.InlineResponse20012](docs/InlineResponse20012.md)
 - [MarketplaceApi.InlineResponse20013](docs/InlineResponse20013.md)
 - [MarketplaceApi.InlineResponse20014](docs/InlineResponse20014.md)
 - [MarketplaceApi.InlineResponse20015](docs/InlineResponse20015.md)
 - [MarketplaceApi.InlineResponse20016](docs/InlineResponse20016.md)
 - [MarketplaceApi.InlineResponse20017](docs/InlineResponse20017.md)
 - [MarketplaceApi.InlineResponse20018](docs/InlineResponse20018.md)
 - [MarketplaceApi.InlineResponse20019](docs/InlineResponse20019.md)
 - [MarketplaceApi.InlineResponse2002](docs/InlineResponse2002.md)
 - [MarketplaceApi.InlineResponse2003](docs/InlineResponse2003.md)
 - [MarketplaceApi.InlineResponse2004](docs/InlineResponse2004.md)
 - [MarketplaceApi.InlineResponse2005](docs/InlineResponse2005.md)
 - [MarketplaceApi.InlineResponse2006](docs/InlineResponse2006.md)
 - [MarketplaceApi.InlineResponse2007](docs/InlineResponse2007.md)
 - [MarketplaceApi.InlineResponse2008](docs/InlineResponse2008.md)
 - [MarketplaceApi.InlineResponse2009](docs/InlineResponse2009.md)
 - [MarketplaceApi.InsuranceMarketEnum](docs/InsuranceMarketEnum.md)
 - [MarketplaceApi.Issuer](docs/Issuer.md)
 - [MarketplaceApi.Lcbp](docs/Lcbp.md)
 - [MarketplaceApi.Lcsp](docs/Lcsp.md)
 - [MarketplaceApi.LowIncomeChild](docs/LowIncomeChild.md)
 - [MarketplaceApi.LowestCostPlanHousehold](docs/LowestCostPlanHousehold.md)
 - [MarketplaceApi.LowestCostPlanPerson](docs/LowestCostPlanPerson.md)
 - [MarketplaceApi.LowestCostPlanResponse](docs/LowestCostPlanResponse.md)
 - [MarketplaceApi.MOOP](docs/MOOP.md)
 - [MarketplaceApi.MarketEnum](docs/MarketEnum.md)
 - [MarketplaceApi.MarketYear](docs/MarketYear.md)
 - [MarketplaceApi.MarketYears](docs/MarketYears.md)
 - [MarketplaceApi.MarketplaceModelEnum](docs/MarketplaceModelEnum.md)
 - [MarketplaceApi.MetalDesignType](docs/MetalDesignType.md)
 - [MarketplaceApi.MetalLevelEnum](docs/MetalLevelEnum.md)
 - [MarketplaceApi.NPI](docs/NPI.md)
 - [MarketplaceApi.NearbyProvider](docs/NearbyProvider.md)
 - [MarketplaceApi.NetworkTierEnum](docs/NetworkTierEnum.md)
 - [MarketplaceApi.Person](docs/Person.md)
 - [MarketplaceApi.Place](docs/Place.md)
 - [MarketplaceApi.Plan](docs/Plan.md)
 - [MarketplaceApi.PlanID](docs/PlanID.md)
 - [MarketplaceApi.PlanIDList](docs/PlanIDList.md)
 - [MarketplaceApi.PlanNetworkAdequacy](docs/PlanNetworkAdequacy.md)
 - [MarketplaceApi.PlanSbcs](docs/PlanSbcs.md)
 - [MarketplaceApi.PlanSbcsBaby](docs/PlanSbcsBaby.md)
 - [MarketplaceApi.PlanSbcsDiabetes](docs/PlanSbcsDiabetes.md)
 - [MarketplaceApi.PlanSbcsFracture](docs/PlanSbcsFracture.md)
 - [MarketplaceApi.PlanSearchFilter](docs/PlanSearchFilter.md)
 - [MarketplaceApi.PlanSearchRequest](docs/PlanSearchRequest.md)
 - [MarketplaceApi.PlanTypeEnum](docs/PlanTypeEnum.md)
 - [MarketplaceApi.PlanssearchstatsPremiums](docs/PlanssearchstatsPremiums.md)
 - [MarketplaceApi.PlanssearchstatsQualityRatings](docs/PlanssearchstatsQualityRatings.md)
 - [MarketplaceApi.PovertyGuideline](docs/PovertyGuideline.md)
 - [MarketplaceApi.ProductDivisionEnum](docs/ProductDivisionEnum.md)
 - [MarketplaceApi.Provider](docs/Provider.md)
 - [MarketplaceApi.ProviderCoverage](docs/ProviderCoverage.md)
 - [MarketplaceApi.ProviderGenderEnum](docs/ProviderGenderEnum.md)
 - [MarketplaceApi.ProviderTypeEnum](docs/ProviderTypeEnum.md)
 - [MarketplaceApi.QualityRating](docs/QualityRating.md)
 - [MarketplaceApi.Range](docs/Range.md)
 - [MarketplaceApi.RateArea](docs/RateArea.md)
 - [MarketplaceApi.Relationship](docs/Relationship.md)
 - [MarketplaceApi.RelationshipEdge](docs/RelationshipEdge.md)
 - [MarketplaceApi.Request](docs/Request.md)
 - [MarketplaceApi.Request1](docs/Request1.md)
 - [MarketplaceApi.RxCUI](docs/RxCUI.md)
 - [MarketplaceApi.SBCScenario](docs/SBCScenario.md)
 - [MarketplaceApi.Slcsp](docs/Slcsp.md)
 - [MarketplaceApi.State](docs/State.md)
 - [MarketplaceApi.StateMedicaid](docs/StateMedicaid.md)
 - [MarketplaceApi.SuppressionStatus](docs/SuppressionStatus.md)
 - [MarketplaceApi.UtilizationEnum](docs/UtilizationEnum.md)
 - [MarketplaceApi.ZIPCounty](docs/ZIPCounty.md)


## Documentation for Authorization


### API Key

- **Type**: API key
- **API key parameter name**: apikey
- **Location**: URL query string

