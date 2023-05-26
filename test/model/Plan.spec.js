/*
 * Marketplace API
 * # About  The Marketplace API delivers data that helps users find and evaluate health care insurance plans, providers, and coverage information on the marketplace. It’s used by [HealthCare.gov](https://healthcare.gov) and other third party services. Request an API token [here](https://developer.cms.gov/marketplace-api/key-request.html), or learn more from [the developer site](https://developer.cms.gov/marketplace-api/).  ## Retention  Marketplace API data includes at minimum the last three years of data.  ## Limitations  API keys are rate limited. This rate limit is passed along in the Header information provided. If you have concerns with the rate limit, please reach out to the [Marketplace API team](mailto:marketplace-api@cms-provider-directory.uservoice.com).  # Quickstart  This section will cover a short workflow for a common scenario — looking up insurance plans for a person's household with premiums and estimated tax credits, obtaining details about a particular plan, and looking up the drug coverage for a specific plan. Other endpoints,   like looking up doctors and providers, or getting recent state medicaid information,  are covered in the docs.  ## Search for health insurance plans  We begin by searching for the health insurance plans for a 27 year-old woman living in North Carolina by posting a single person household to the plan search endpoint  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" # rate limited test key curl --request POST \\\\   --url \"https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${apikey}\" \\\\   --header 'content-type: application/json' \\\\   --data '{     \"household\": {       \"income\": 52000,       \"people\": [         {           \"age\": 27,           \"aptc_eligible\": true,           \"gender\": \"Female\",           \"uses_tobacco\": false         }       ]     },     \"market\": \"Individual\",     \"place\": {       \"countyfips\": \"37057\",       \"state\": \"NC\",       \"zipcode\": \"27360\"     },     \"year\": 2019 }' ```  This **POST** request returns health insurance information and pricing estimates for the plans for which she can sign up. More discussion about building the household JSON object can be found later on this page. Don't know the county [FIPS](https://en.m.wikipedia.org/wiki/FIPS_county_code) code? To look it up for this person's zip code, we use the counties by zip endpoint.  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" zipcode=\"27360\" curl \"https://marketplace.api.healthcare.gov/api/v1/counties/by/zip/${zipcode}?apikey=${apikey}\" ```  This helps gather the necessary information to build the household object to submit to the API.  ## Get details about a specific health insurance plan  With a plan search completed, let's look more closely at a particular plan. For example, **Blue Cross Blue Shield of North Carolina Blue Value Catastrophic** was one of the first returned from the example above. We will use it as an example to drill down  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" planid=\"11512NC0100031\" year=\"2019\" curl \"https://marketplace.api.healthcare.gov/api/v1/plans/${planid}?year=${year}&apikey=${apikey}\" ```  Using this endpoint will provide more granular information about the particular plan for a searching user, like issuer information, cost sharing deductibles, eligible dependents, website urls, quality ratings, and more.  ## Standard Plans  Some plans are considered **standard plans.** These can be identified in the results of a plan search or plan details endpoint.  If a plan has a **design_type** that is one of the following, it is considered a standard plan: \"DESIGN1\", \"DESIGN2\", \"DESIGN3\", \"DESIGN4\", \"DESIGN5\".  If a plan has a **design_type** of \"NOT_APPLICABLE\", then it is not considered a standard plan.  ## Get drug coverage information about a health insurance plan  Now that we have a plan of interest, let's look up what drugs it covers. We want to know if **ibuprofen** is covered under the insurance plan. First, we can mimic a user interaction with an autocomplete for ibuprofen for a typeahead.  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" query=\"ibuprof\" curl \"https://marketplace.api.healthcare.gov/api/v1/drugs/autocomplete?q=${query}&apikey=${apikey}\" ```  Among other things, this provides us with an **RxCUI**, a unique identifier for a clinical drug. We can use it along with the plan id to query the API for whether or not **ibuprofen** is covered under this plan  ``` apikey=\"d687412e7b53146b2631dc01974ad0a4\" drugs=\"1049589\" planids=\"11512NC0100031\" year=\"2019\" curl \"https://marketplace.api.healthcare.gov/api/v1/drugs/covered?year=${year}&drugs=${drugs}&planids=${planids}&apikey=${apikey}\" ```  The API confirms that ibuprofen is covered.  # More information about households  The household in the example above was sufficient to query Marketplace API, but there are more optional fields that can provide more accurate search results and premium estimates, or can be used by application developers to specify scenarios. For example, if a household does not live together, certain plans may no longer be eligible to them.  We begin with an example, describing what some of the less intuitive fields means. Here's the JSON of a fully filled in household, using all possible features  ``` {   \"aptc_override\": 288.61,   \"household\": {     \"effective_date\": \"2019-05-01\",     \"has_married_couple\": true,     \"income\": 52000,     \"unemployment_received\": Adult,     \"people\": [       {         \"age\": 27,         \"dob\": \"1992-01-01\",         \"aptc_eligible\": true,         \"does_not_cohabitate\": false,         \"gender\": \"Female\",         \"has_mec\": false,         \"is_parent\": false,         \"is_pregnant\": false,         \"relationship\": \"Self\",         \"uses_tobacco\": false,         \"utilization\": \"Medium\"       },       {         \"age\": 25,         \"dob\": \"1994-03-03,         \"aptc_eligible\": true,         \"does_not_cohabitate\": false,         \"gender\": \"Male\",         \"has_mec\": false,         \"is_parent\": false,         \"is_pregnant\": false,         \"relationship\": \"Spouse\",         \"uses_tobacco\": false,         \"utilization\": \"Medium\"       }     ]   },   \"market\": \"Individual\",   \"place\": {     \"countyfips\": \"37057\",     \"state\": \"NC\",     \"zipcode\": \"27360\"   },   \"year\": 2019 } ```  ## APTC Override The `aptc_override` is an optional override to specify the Advanced Premium Tax Credit for a user, if the exact value is already known. For persons in the household, `aptc_eligible` denotes if the person is eligible for the Advanced Premium Tax Credit.  ## Unemployment Received As part of the American Rescue Plan, if the household has received unemployment benefits during 2021 the household income must be capped to 133% of the Federal Poverty Level for the household size in APTC and CSR estimations.  If the recipient is an adult tax payer, both ATPC and CSRs will be affected.  If only a tax dependent received unemployment, the only effect will be to CSR eligibility. If both an adult and dependent have received unemployment, \"Adult\" should be passed so that the maximum APTC and CSRs are received. This field defaults to None if not included and only affects the 2021 market year.  ## Effective Date This is the date a plan or coverage goes into effect and is used in premium calculations and determining eligibility. If omitted, the value defaults to the effective date of the plan, which is generally Jan 1 of the market year. The `effective_date` is required to correctly calculate the number of months since an individual has used tobacco. The number of months is the difference of the last tobacco use date until the `effective_date`. Considering the number of months since last tobacco use can impact the rate charged by a plan, this field is required to be included for a more accurate search result.  ## Age Calculation Either an `age` or `dob` value must be provided.  If `age` is provided that value is used in determining eligibility and premiums. If a `dob` is provided, a more accurate age is calculated using the combination of `dob`, the effective date, and plan specific rating-age adjustments.  If both fields are populated, `age` takes precedence and no calculation will occur.  Plan rates can have age adjustments affecting what premiums get returned.  Additionally, effective date in relation to age affects premium calculation and eligibility.  Therefore, determining the correct age is important for accurate results.  ## Cohabitation `does_not_cohabitate` indicates whether the person is living with the household.  ## Minimal Essential Coverage (MEC) `has_mec` indicates whether a person has Medicaid/CHIP and may possibly not be included in the household for premium determination and insurance eligibility.  ## Relationship `relationship` — which is not required to issue a request — is the relationship of a household member to the person applying for health insurance. For the main enrollee, the `Self` relationship is used.  Each plan on the marketplace defines a set of dependent relationships within a household as eligible to enroll in that plan.  If it is known by the caller what relationships exist within a household when making a request to Marketplace API, the API can more accurately determine household eligibility for plans.  If the relationship field is used in a request, it must be a valid relationship for the provided market year (see list below). When a household request is sent without relationships present in the household, Marketplace API will make as accurate an eligibility determinaton as possible without the relationship values.  The total set of dependent relationships that plans may use to restrict eligibility may change over the years. For 2020 and 2021, the possible relationship types that plans may utilize are as follows  2020                              | 2021 --------------------------------- | --------------------------- `Self`                            | `Self` `Brother or Sister`               | `Brother or Sister` `Child`                           | `Child` `Collateral Dependent`            | `Collateral Dependent` `Ex-Spouse`                       | `Ex-Spouse` `Foster Child`                    | `Foster Child` `Grandson or Granddaughter`       | `Grandson or Granddaughter` `Life Partner`                    | `Life Partner` `Nephew or Niece`                 | `Nephew or Niece` `Other Relationship`              | `Other Relationship` `Other Relative`                  | `Other Relative` `Sponsored Dependent`             | `Sponsored Dependent` `Spouse`                          | `Spouse` `Stepson or Stepdaughter`         | `Stepson or Stepdaughter` `Ward`                            | `Ward` `Adopted Child`                   | `Annultant`                       | `Brother-in-Law or Sister-in-Law` | `Court Appointed Guardian`        | `Dependent of a Minor Dependent`  | `Guardian`                        | `Son-in-Law or Daughter-in-Law`   | `Stepparent`                      |  As can be seen from this list, the list of potential relationships has been simplified between 2020 and 2021. When a relationship is not one of the obvious choices in this list, the fallback values of `Other Relative` and `Other Relationship` may be used.  ## Utilization Finally, `utilization` is one of `{\"Low\", \"Medium\", \"High\"}` and is a description of how much a person intends to use their health insurance.  # Understanding Errors The Marketplace API returns standard HTTP status codes which indicate whether a specific HTTP request has successfully completed. For some errors, additional information is provided in the response body, including an application error code and a brief message.  ## HTTP Response Status Codes Responses are grouped in five classes:   - Successful responses (200–299)   - Client errors (400–499)   - Server errors (500–599)  ## Marketplace API Error Codes The various codes are listed below:  1000 - errInternalServerError | ----- The Internal Server Error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.   ```     Request:  GET /api/v1/drugs/search?q=...     Response: {                 \"code\": \"1000\",                 \"status\": \"500\",                 \"message\": \"Internal server error\",                 \"error\": \"sql: Scan called without calling Next\"               } ``` 1001 - errCountyNotFound | ----- This error code is returned by the [County Lookup by FIPS](#reference/geography/county-lookup-by-fips/get) endpoint when no county is found using the  FIPS provided in the request. For example:   ```     Request:   GET /api/v1/counties/35094     Response:  {                   \"code\": \"1001\",                   \"status\": \"404\",                   \"message\": \"county not found\"                   \"error\": \"sql: No records found\"                 } ``` 1002 - errStateNotFound | ----- This error code is returned by the [Lookup State](#reference/geography/lookup-state/get) endpoint when no state is found using the state provided in the request. For example:   ```     Request:   GET /api/v1/states/NP     Response:  {                   \"code\": \"1002\",                   \"status\": \"404\",                   \"message\": \"state not found\"                   \"error\": \"sql: No records found\"                 } ``` 1003 - errInvalidInput  | ----- This error code is returned by various endpoints when the required input is invalid. The message provided in the response will assist in resolving the problem before re-sending the request. For example:   ```     Request:   GET /api/v1/issuers/1019     Response:  {                     \"code\": \"1003\",                     \"status\": \"400\",                     \"message\": \"invalid issuers request\"                     \"error\": \"invalid issuer ID format\"                 } ``` 1004 - errIssuerNotFound  | ----- This error code is returned by the [Get Issuer](#reference/insurance-issuers/get-issuer/get-issuer) endpoint when no issuer is found using the issuer id provided in the request. For example:   ```     Request:   GET /api/v1/issuers/01922     Response:  {                   \"code\": \"1004\",                   \"status\": \"404\",                   \"message\": \"issuer not found\"                   \"error\": \"sql: No records found\"                 } ``` 1005 - errCrosswalkNotFound  | ----- This error code is returned by the [Crosswalk a previous year plan](#reference/insurance-plans/plan-crosswalk/crosswalk-a-previous-year-plan) endpoint when no crosswalk is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/crosswalk&year=2018&plan_id=53882IL0040002&state=IN                &zipcode=60647&fips=17031     Response:  {                   \"code\": \"1005\",                   \"status\": \"404\",                   \"message\": \"No crosswalk found for those parameters\"                   \"error\": \"sql: No records found\"                 } ``` 1006 - errPlanNotFound  | ----- This error code is returned by various endpoints when no plan is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/plans/11512NC0100035     Response:  {                   \"code\": \"1006\",                   \"status\": \"404\",                   \"message\": \"Plan not found\"                   \"error\": \"sql: No records found\"                 } ``` 1007 - errTimeout  | ----- This error code is returned by various endpoints when the request timed out. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1007\",                   \"status\": \"500\",                   \"message\": \"request timed-out, try again\"                   \"error\": \"db query timed-out\"                 } ``` 1008 - errStateMedicaidNotFound  | ----- This error code is returned by the [State Medicaid Data](#reference/geography/state-medicaid-data/get) endpoint when no medicaid is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/states/NV/medicaid     Response:  {                   \"code\": \"1008\",                   \"status\": \"404\",                   \"message\": \"state medicaid not found\"                   \"error\": \"year out of range\"                 } ``` 1009 - errPovertyGuidelineNotFound  | ----- This error code is returned by the [State Poverty Guidelines](#reference/geography/state-poverty-guidelines/get) endpoint when no U.S. federal poverty guidelines is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/states/XX/poverty-guidelines     Response:  {                   \"code\": \"1009\",                   \"status\": \"400\",                   \"message\": \"poverty guideline not found\"                   \"error\": \"sql: No records found\"                 } ``` 1010 - errPercentageFPLNotFound  | ----- This error code is returned by the [Poverty Level Percentage](#reference/households-&-eligibility/poverty-level-percentage/get) endpoint when no percentage of federal poverty level is found using the parameters provided in the request. For example:   ```     Request:   GET /api/v1/households/pcfpl&year=2021&state=NV&size=2&income=14000     Response:  {                   \"code\": \"1010\",                   \"status\": \"404\",                   \"message\": \"percentage of federal poverty level not found\"                   \"error\": \"guideline not found for state: NV, year: 2021\"                 } ``` 1011 - errQualityRatingNotFound  | ----- This error code is returned by the [Quality Ratings](#reference/insurance-plans/quality-ratings/get) endpoint when there are no quality ratings for a plan. For example:   ```     Request:   GET /api/v1/plans/XXXXXXXXXXX/quality-ratings&year=2021     Response:  {                   \"code\": \"1011\",                   \"status\": \"404\",                   \"message\": No quality rating found for those parameters\"                   \"error\": \"sql: No records found\"                 } ``` 1012 - errCoverageUnavailable  | ----- This error code is returned by various endpoints when the coverage data is temporarily unavailable. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1012\",                   \"status\": \"503\",                   \"message\": \"coverage data temporarily unavailable\"                   \"error\": \"coverage database unavailable\"                 } ``` 1013 - errProviderNotFound  | ----- This error code is returned by various Provider related endpoints when the provider is not found. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1013\",                   \"status\": \"404\",                   \"message\": \"provider not found\"                   \"error\": \"sql: No records found\"                 } ``` 1014 - errDrugNotFound  | ----- This error code is returned by various Drug related endpoints when the drug is not found. For example:   ```     Request:   various endpoints     Response:  {                   \"code\": \"1014\",                   \"status\": \"404\",                   \"message\": \"drug not found\"                   \"error\": \"sql: No records found\"                 } ``` 1015 - errMissingMedicaidCHIPEligibility  | ----- This error code is returned when no Medicaid CHIP Eligibility plans are found using the parameters provided in the request.   ```     Request:   POST /api/v1/households/eligibility/estimates     Response:  {                   \"code\": \"1015\",                   \"status\": \"404\",                   \"message\": \"missing medicaid eligibility data\"                   \"error\": \"missing eligibility for fiscal year: YYYY, quarter: Q, state: SS\"                 } ``` 1016 - errTooFewPlans  | ----- This error code is returned when there are not enough plans in a given service area to compute a second lowest cost silver plan for an example, the errTooFewPlans code may be returned.   ```     Request:   POST /api/v1/households/eligibility/estimates     Response:  {                   \"code\": \"1016\",                   \"status\": \"404\",                   \"message\": \"not enough plans to calculate SLCSP/LCBP\"                   \"error\": \"not enough plans to calculate SLCSP/LCBP\"                 } ``` 1017 - errRateAreaNotFound  | ----- This error code is returned by various Drug related endpoints when the rate area is not found. For example:   ```     Request:   GET /api/v1/rate-areas?state=IN&zipcode=60647&fips=17031     Response:  {                   \"code\": \"1017\",                   \"status\": \"404\",                   \"message\": \"rate area not found\"                   \"error\": \"No rate area could be determined\"                 } ```  ## Marketplace API Common Error Codes ``` 400 Bad Request - Client supplied invalid or incorrect values to the requested end-point 404 Not Found - End-point could not find the requested object(s) ````  ## Marketplace API Uncommon Error Codes ``` 500 Internal Server Error - An unexpected error occurred 503 Service Unavailable - The requested service is temporarily unavailable, try again later. ```` 
 *
 * OpenAPI spec version: 1
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.31
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.MarketplaceApi);
  }
}(this, function(expect, MarketplaceApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('Plan', function() {
      beforeEach(function() {
        instance = new MarketplaceApi.Plan();
      });

      it('should create an instance of Plan', function() {
        // TODO: update the code to test Plan
        expect(instance).to.be.a(MarketplaceApi.Plan);
      });

      it('should have the property id (base name: "id")', function() {
        // TODO: update the code to test the property id
        expect(instance).to.have.property('id');
        // expect(instance.id).to.be(expectedValueLiteral);
      });

      it('should have the property name (base name: "name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

      it('should have the property benefits (base name: "benefits")', function() {
        // TODO: update the code to test the property benefits
        expect(instance).to.have.property('benefits');
        // expect(instance.benefits).to.be(expectedValueLiteral);
      });

      it('should have the property deductibles (base name: "deductibles")', function() {
        // TODO: update the code to test the property deductibles
        expect(instance).to.have.property('deductibles');
        // expect(instance.deductibles).to.be(expectedValueLiteral);
      });

      it('should have the property diseaseMgmtPrograms (base name: "disease_mgmt_programs")', function() {
        // TODO: update the code to test the property diseaseMgmtPrograms
        expect(instance).to.have.property('diseaseMgmtPrograms');
        // expect(instance.diseaseMgmtPrograms).to.be(expectedValueLiteral);
      });

      it('should have the property hasNationalNetwork (base name: "has_national_network")', function() {
        // TODO: update the code to test the property hasNationalNetwork
        expect(instance).to.have.property('hasNationalNetwork');
        // expect(instance.hasNationalNetwork).to.be(expectedValueLiteral);
      });

      it('should have the property qualityRating (base name: "quality_rating")', function() {
        // TODO: update the code to test the property qualityRating
        expect(instance).to.have.property('qualityRating');
        // expect(instance.qualityRating).to.be(expectedValueLiteral);
      });

      it('should have the property insuranceMarket (base name: "insurance_market")', function() {
        // TODO: update the code to test the property insuranceMarket
        expect(instance).to.have.property('insuranceMarket');
        // expect(instance.insuranceMarket).to.be(expectedValueLiteral);
      });

      it('should have the property issuer (base name: "issuer")', function() {
        // TODO: update the code to test the property issuer
        expect(instance).to.have.property('issuer');
        // expect(instance.issuer).to.be(expectedValueLiteral);
      });

      it('should have the property market (base name: "market")', function() {
        // TODO: update the code to test the property market
        expect(instance).to.have.property('market');
        // expect(instance.market).to.be(expectedValueLiteral);
      });

      it('should have the property maxAgeChild (base name: "max_age_child")', function() {
        // TODO: update the code to test the property maxAgeChild
        expect(instance).to.have.property('maxAgeChild');
        // expect(instance.maxAgeChild).to.be(expectedValueLiteral);
      });

      it('should have the property metalLevel (base name: "metal_level")', function() {
        // TODO: update the code to test the property metalLevel
        expect(instance).to.have.property('metalLevel');
        // expect(instance.metalLevel).to.be(expectedValueLiteral);
      });

      it('should have the property moops (base name: "moops")', function() {
        // TODO: update the code to test the property moops
        expect(instance).to.have.property('moops');
        // expect(instance.moops).to.be(expectedValueLiteral);
      });

      it('should have the property premium (base name: "premium")', function() {
        // TODO: update the code to test the property premium
        expect(instance).to.have.property('premium');
        // expect(instance.premium).to.be(expectedValueLiteral);
      });

      it('should have the property premiumWCredit (base name: "premium_w_credit")', function() {
        // TODO: update the code to test the property premiumWCredit
        expect(instance).to.have.property('premiumWCredit');
        // expect(instance.premiumWCredit).to.be(expectedValueLiteral);
      });

      it('should have the property ehbPremium (base name: "ehb_premium")', function() {
        // TODO: update the code to test the property ehbPremium
        expect(instance).to.have.property('ehbPremium');
        // expect(instance.ehbPremium).to.be(expectedValueLiteral);
      });

      it('should have the property pediatricEhbPremium (base name: "pediatric_ehb_premium")', function() {
        // TODO: update the code to test the property pediatricEhbPremium
        expect(instance).to.have.property('pediatricEhbPremium');
        // expect(instance.pediatricEhbPremium).to.be(expectedValueLiteral);
      });

      it('should have the property aptcEligiblePremium (base name: "aptc_eligible_premium")', function() {
        // TODO: update the code to test the property aptcEligiblePremium
        expect(instance).to.have.property('aptcEligiblePremium');
        // expect(instance.aptcEligiblePremium).to.be(expectedValueLiteral);
      });

      it('should have the property guaranteedRate (base name: "guaranteed_rate")', function() {
        // TODO: update the code to test the property guaranteedRate
        expect(instance).to.have.property('guaranteedRate');
        // expect(instance.guaranteedRate).to.be(expectedValueLiteral);
      });

      it('should have the property simpleChoice (base name: "simple_choice")', function() {
        // TODO: update the code to test the property simpleChoice
        expect(instance).to.have.property('simpleChoice');
        // expect(instance.simpleChoice).to.be(expectedValueLiteral);
      });

      it('should have the property productDivision (base name: "product_division")', function() {
        // TODO: update the code to test the property productDivision
        expect(instance).to.have.property('productDivision');
        // expect(instance.productDivision).to.be(expectedValueLiteral);
      });

      it('should have the property specialistReferralRequired (base name: "specialist_referral_required")', function() {
        // TODO: update the code to test the property specialistReferralRequired
        expect(instance).to.have.property('specialistReferralRequired');
        // expect(instance.specialistReferralRequired).to.be(expectedValueLiteral);
      });

      it('should have the property state (base name: "state")', function() {
        // TODO: update the code to test the property state
        expect(instance).to.have.property('state');
        // expect(instance.state).to.be(expectedValueLiteral);
      });

      it('should have the property type (base name: "type")', function() {
        // TODO: update the code to test the property type
        expect(instance).to.have.property('type');
        // expect(instance.type).to.be(expectedValueLiteral);
      });

      it('should have the property benefitsUrl (base name: "benefits_url")', function() {
        // TODO: update the code to test the property benefitsUrl
        expect(instance).to.have.property('benefitsUrl');
        // expect(instance.benefitsUrl).to.be(expectedValueLiteral);
      });

      it('should have the property brochureUrl (base name: "brochure_url")', function() {
        // TODO: update the code to test the property brochureUrl
        expect(instance).to.have.property('brochureUrl');
        // expect(instance.brochureUrl).to.be(expectedValueLiteral);
      });

      it('should have the property formularyUrl (base name: "formulary_url")', function() {
        // TODO: update the code to test the property formularyUrl
        expect(instance).to.have.property('formularyUrl');
        // expect(instance.formularyUrl).to.be(expectedValueLiteral);
      });

      it('should have the property networkUrl (base name: "network_url")', function() {
        // TODO: update the code to test the property networkUrl
        expect(instance).to.have.property('networkUrl');
        // expect(instance.networkUrl).to.be(expectedValueLiteral);
      });

      it('should have the property hsaEligible (base name: "hsa_eligible")', function() {
        // TODO: update the code to test the property hsaEligible
        expect(instance).to.have.property('hsaEligible');
        // expect(instance.hsaEligible).to.be(expectedValueLiteral);
      });

      it('should have the property oopc (base name: "oopc")', function() {
        // TODO: update the code to test the property oopc
        expect(instance).to.have.property('oopc');
        // expect(instance.oopc).to.be(expectedValueLiteral);
      });

      it('should have the property suppressionState (base name: "suppression_state")', function() {
        // TODO: update the code to test the property suppressionState
        expect(instance).to.have.property('suppressionState');
        // expect(instance.suppressionState).to.be(expectedValueLiteral);
      });

      it('should have the property tobaccoLookback (base name: "tobacco_lookback")', function() {
        // TODO: update the code to test the property tobaccoLookback
        expect(instance).to.have.property('tobaccoLookback');
        // expect(instance.tobaccoLookback).to.be(expectedValueLiteral);
      });

      it('should have the property certification (base name: "certification")', function() {
        // TODO: update the code to test the property certification
        expect(instance).to.have.property('certification');
        // expect(instance.certification).to.be(expectedValueLiteral);
      });

      it('should have the property networkAdequacy (base name: "network_adequacy")', function() {
        // TODO: update the code to test the property networkAdequacy
        expect(instance).to.have.property('networkAdequacy');
        // expect(instance.networkAdequacy).to.be(expectedValueLiteral);
      });

      it('should have the property sbcs (base name: "sbcs")', function() {
        // TODO: update the code to test the property sbcs
        expect(instance).to.have.property('sbcs');
        // expect(instance.sbcs).to.be(expectedValueLiteral);
      });

      it('should have the property rx3moMailOrder (base name: "rx_3mo_mail_order")', function() {
        // TODO: update the code to test the property rx3moMailOrder
        expect(instance).to.have.property('rx3moMailOrder');
        // expect(instance.rx3moMailOrder).to.be(expectedValueLiteral);
      });

      it('should have the property isIneligible (base name: "is_ineligible")', function() {
        // TODO: update the code to test the property isIneligible
        expect(instance).to.have.property('isIneligible');
        // expect(instance.isIneligible).to.be(expectedValueLiteral);
      });

      it('should have the property coversNonhydeAbortion (base name: "covers_nonhyde_abortion")', function() {
        // TODO: update the code to test the property coversNonhydeAbortion
        expect(instance).to.have.property('coversNonhydeAbortion');
        // expect(instance.coversNonhydeAbortion).to.be(expectedValueLiteral);
      });

      it('should have the property serviceAreaId (base name: "service_area_id")', function() {
        // TODO: update the code to test the property serviceAreaId
        expect(instance).to.have.property('serviceAreaId');
        // expect(instance.serviceAreaId).to.be(expectedValueLiteral);
      });

    });
  });

}));
