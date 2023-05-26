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

  beforeEach(function() {
    instance = new MarketplaceApi.InsurancePlansApi();
  });

  describe('(package)', function() {
    describe('InsurancePlansApi', function() {
      describe('crosswalkGet', function() {
        it('should call crosswalkGet successfully', function(done) {
          // TODO: uncomment, update parameter values for crosswalkGet call and complete the assertions
          /*
          var apikey = "d687412e7b53146b2631dc01974ad0a4";
          var year = 2018;
          var planId = "53882IL0040002";
          var state = "IL";
          var zipcode = "60647";
          var fips = "17031";

          instance.crosswalkGet(apikey, year, planId, state, zipcode, fips, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(MarketplaceApi.InlineResponse2001);
            expect(data.newPlanId).to.be.a('string');
            expect(data.newPlanId).to.be("");
            expect(data.level).to.be.a('string');
            expect(data.level).to.be("");
            expect(data.reason).to.be.a('string');
            expect(data.reason).to.be("");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('plansPlanIdGet', function() {
        it('should call plansPlanIdGet successfully', function(done) {
          // TODO: uncomment, update parameter values for plansPlanIdGet call and complete the assertions
          /*
          var apikey = "d687412e7b53146b2631dc01974ad0a4";
          var planId = "11512NC0100031";
          var opts = {};
          opts.year = 2019;

          instance.plansPlanIdGet(apikey, planId, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(MarketplaceApi.InlineResponse20012);
            expect(data.plan).to.be.a(MarketplaceApi.Plan);
                  expect(data.plan.id).to.be.a('string');
              expect(data.plan.id).to.be("");
              expect(data.plan.name).to.be.a('string');
              expect(data.plan.name).to.be("");
              {
                let dataCtr = data.plan.benefits;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(MarketplaceApi.Benefit);
                  expect(data.name).to.be.a('string');
                  expect(data.name).to.be("");
                  expect(data.covered).to.be.a('boolean');
                  expect(data.covered).to.be(false);
                  {
                    let dataCtr = data.costSharings;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(MarketplaceApi.CostSharing);
                      expect(data.coinsuranceOptions).to.be.a('string');
                      expect(data.coinsuranceOptions).to.be("");
                      expect(data.coinsuranceRate).to.be.a('number');
                      expect(data.coinsuranceRate).to.be(0.0);
                      expect(data.copayAmount).to.be.a('number');
                      expect(data.copayAmount).to.be();
                      expect(data.copayOptions).to.be.a('string');
                      expect(data.copayOptions).to.be("");
                      expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                          expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                          expect(data.displayString).to.be.a('string');
                      expect(data.displayString).to.be("");
      
                            }
                  }
                  expect(data.explanation).to.be.a('string');
                  expect(data.explanation).to.be("");
                  expect(data.exclusions).to.be.a('string');
                  expect(data.exclusions).to.be("");
                  expect(data.hasLimits).to.be.a('boolean');
                  expect(data.hasLimits).to.be(false);
                  expect(data.limitUnit).to.be.a('string');
                  expect(data.limitUnit).to.be("");
                  expect(data.limitQuantity).to.be.a('number');
                  expect(data.limitQuantity).to.be();
  
                        }
              }
              {
                let dataCtr = data.plan.deductibles;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(MarketplaceApi.Deductible);
                  expect(data.amount).to.be.a('number');
                  expect(data.amount).to.be();
                  expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                      expect(data.familyCost).to.be.a(MarketplaceApi.FamilyCostEnum);
                      expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                      expect(data.type).to.be.a('string');
                  expect(data.type).to.be("Medical EHB Deductible");
                  expect(data.individual).to.be.a('boolean');
                  expect(data.individual).to.be(false);
                  expect(data.family).to.be.a('boolean');
                  expect(data.family).to.be(false);
                  expect(data.displayString).to.be.a('string');
                  expect(data.displayString).to.be("");
  
                        }
              }
              {
                let dataCtr = data.plan.diseaseMgmtPrograms;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(MarketplaceApi.DiseaseMgmtProgramsEnum);
  
                        }
              }
              expect(data.plan.hasNationalNetwork).to.be.a('boolean');
              expect(data.plan.hasNationalNetwork).to.be(false);
              expect(data.plan.qualityRating).to.be.a(MarketplaceApi.QualityRating);
                    expect(data.plan.qualityRating.available).to.be.a('boolean');
                expect(data.plan.qualityRating.available).to.be(false);
                expect(data.plan.qualityRating.year).to.be.a('number');
                expect(data.plan.qualityRating.year).to.be(0);
                expect(data.plan.qualityRating.globalRating).to.be.a('number');
                expect(data.plan.qualityRating.globalRating).to.be(0);
                expect(data.plan.qualityRating.globalNotRatedReason).to.be.a('string');
                expect(data.plan.qualityRating.globalNotRatedReason).to.be("");
                expect(data.plan.qualityRating.clinicalQualityManagementRating).to.be.a('number');
                expect(data.plan.qualityRating.clinicalQualityManagementRating).to.be(0);
                expect(data.plan.qualityRating.clinicalQualityManagementNotRatedReason).to.be.a('string');
                expect(data.plan.qualityRating.clinicalQualityManagementNotRatedReason).to.be("");
                expect(data.plan.qualityRating.enrolleeExperienceRating).to.be.a('number');
                expect(data.plan.qualityRating.enrolleeExperienceRating).to.be(0);
                expect(data.plan.qualityRating.enrolleeExperienceNotRatedReason).to.be.a('string');
                expect(data.plan.qualityRating.enrolleeExperienceNotRatedReason).to.be("");
                expect(data.plan.qualityRating.planEfficiencyRating).to.be.a('number');
                expect(data.plan.qualityRating.planEfficiencyRating).to.be(0);
                expect(data.plan.qualityRating.planEfficiencyNotRatedReason).to.be.a('string');
                expect(data.plan.qualityRating.planEfficiencyNotRatedReason).to.be("");
              expect(data.plan.insuranceMarket).to.be.a(MarketplaceApi.InsuranceMarketEnum);
                  expect(data.plan.issuer).to.be.a(MarketplaceApi.Issuer);
                    {
                  let dataCtr = data.plan.issuer.eligibleDependents;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.Relationship);
    
                          }
                }
                expect(data.plan.issuer.id).to.be.a('string');
                expect(data.plan.issuer.id).to.be("");
                expect(data.plan.issuer.individualUrl).to.be.a('string');
                expect(data.plan.issuer.individualUrl).to.be("");
                expect(data.plan.issuer.name).to.be.a('string');
                expect(data.plan.issuer.name).to.be("");
                expect(data.plan.issuer.shopUrl).to.be.a('string');
                expect(data.plan.issuer.shopUrl).to.be("");
                expect(data.plan.issuer.state).to.be.a('string');
                expect(data.plan.issuer.state).to.be("");
                expect(data.plan.issuer.tollFree).to.be.a('string');
                expect(data.plan.issuer.tollFree).to.be("");
                expect(data.plan.issuer.tty).to.be.a('string');
                expect(data.plan.issuer.tty).to.be("");
              expect(data.plan.market).to.be.a(MarketplaceApi.MarketEnum);
                  expect(data.plan.maxAgeChild).to.be.a('number');
              expect(data.plan.maxAgeChild).to.be();
              expect(data.plan.metalLevel).to.be.a(MarketplaceApi.MetalLevelEnum);
                  {
                let dataCtr = data.plan.moops;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(MarketplaceApi.MOOP);
                  expect(data.amount).to.be.a('number');
                  expect(data.amount).to.be();
                  expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                      expect(data.familyCost).to.be.a('string');
                  expect(data.familyCost).to.be("Individual");
                  expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                      expect(data.type).to.be.a('string');
                  expect(data.type).to.be("Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)");
                  expect(data.individual).to.be.a('boolean');
                  expect(data.individual).to.be(false);
                  expect(data.family).to.be.a('boolean');
                  expect(data.family).to.be(false);
                  expect(data.displayString).to.be.a('string');
                  expect(data.displayString).to.be("");
  
                        }
              }
              expect(data.plan.premium).to.be.a('number');
              expect(data.plan.premium).to.be(0.0);
              expect(data.plan.premiumWCredit).to.be.a('number');
              expect(data.plan.premiumWCredit).to.be(0.0);
              expect(data.plan.ehbPremium).to.be.a('number');
              expect(data.plan.ehbPremium).to.be(0.0);
              expect(data.plan.pediatricEhbPremium).to.be.a('number');
              expect(data.plan.pediatricEhbPremium).to.be(0.0);
              expect(data.plan.aptcEligiblePremium).to.be.a('number');
              expect(data.plan.aptcEligiblePremium).to.be(0.0);
              expect(data.plan.guaranteedRate).to.be.a('boolean');
              expect(data.plan.guaranteedRate).to.be(false);
              expect(data.plan.simpleChoice).to.be.a('boolean');
              expect(data.plan.simpleChoice).to.be(false);
              expect(data.plan.productDivision).to.be.a(MarketplaceApi.ProductDivisionEnum);
                  expect(data.plan.specialistReferralRequired).to.be.a('boolean');
              expect(data.plan.specialistReferralRequired).to.be(false);
              expect(data.plan.state).to.be.a('string');
              expect(data.plan.state).to.be("");
              expect(data.plan.type).to.be.a(MarketplaceApi.PlanTypeEnum);
                  expect(data.plan.benefitsUrl).to.be.a('string');
              expect(data.plan.benefitsUrl).to.be("");
              expect(data.plan.brochureUrl).to.be.a('string');
              expect(data.plan.brochureUrl).to.be("");
              expect(data.plan.formularyUrl).to.be.a('string');
              expect(data.plan.formularyUrl).to.be("");
              expect(data.plan.networkUrl).to.be.a('string');
              expect(data.plan.networkUrl).to.be("");
              expect(data.plan.hsaEligible).to.be.a('boolean');
              expect(data.plan.hsaEligible).to.be(false);
              expect(data.plan.oopc).to.be.a('number');
              expect(data.plan.oopc).to.be();
              expect(data.plan.suppressionState).to.be.a(MarketplaceApi.SuppressionStatus);
                  expect(data.plan.tobaccoLookback).to.be.a('number');
              expect(data.plan.tobaccoLookback).to.be(0);
              expect(data.plan.certification).to.be.a(MarketplaceApi.CertificationStatus);
                  expect(data.plan.networkAdequacy).to.be.a(MarketplaceApi.PlanNetworkAdequacy);
                    expect(data.plan.networkAdequacy.scope).to.be.a('string');
                expect(data.plan.networkAdequacy.scope).to.be("");
                expect(data.plan.networkAdequacy.networks).to.be.a(Object);
                expect(data.plan.networkAdequacy.networks).to.be();
              expect(data.plan.sbcs).to.be.a(MarketplaceApi.PlanSbcs);
                    expect(data.plan.sbcs.baby).to.be.a(MarketplaceApi.PlanSbcsBaby);
                    expect(data.plan.sbcs.diabetes).to.be.a(MarketplaceApi.PlanSbcsDiabetes);
                    expect(data.plan.sbcs.fracture).to.be.a(MarketplaceApi.PlanSbcsFracture);
        
              expect(data.plan.rx3moMailOrder).to.be.a('boolean');
              expect(data.plan.rx3moMailOrder).to.be(false);
              expect(data.plan.isIneligible).to.be.a('boolean');
              expect(data.plan.isIneligible).to.be(false);
              expect(data.plan.coversNonhydeAbortion).to.be.a('boolean');
              expect(data.plan.coversNonhydeAbortion).to.be(false);
              expect(data.plan.serviceAreaId).to.be.a('string');
              expect(data.plan.serviceAreaId).to.be("");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('plansPlanIdQualityRatingsGet', function() {
        it('should call plansPlanIdQualityRatingsGet successfully', function(done) {
          // TODO: uncomment, update parameter values for plansPlanIdQualityRatingsGet call and complete the assertions
          /*
          var apikey = "d687412e7b53146b2631dc01974ad0a4";
          var year = 2019;
          var planId = "95185VA0530001";

          instance.plansPlanIdQualityRatingsGet(apikey, year, planId, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(MarketplaceApi.InlineResponse20014);
            expect(data.qualityRating).to.be.a(MarketplaceApi.QualityRating);
                  expect(data.qualityRating.available).to.be.a('boolean');
              expect(data.qualityRating.available).to.be(false);
              expect(data.qualityRating.year).to.be.a('number');
              expect(data.qualityRating.year).to.be(0);
              expect(data.qualityRating.globalRating).to.be.a('number');
              expect(data.qualityRating.globalRating).to.be(0);
              expect(data.qualityRating.globalNotRatedReason).to.be.a('string');
              expect(data.qualityRating.globalNotRatedReason).to.be("");
              expect(data.qualityRating.clinicalQualityManagementRating).to.be.a('number');
              expect(data.qualityRating.clinicalQualityManagementRating).to.be(0);
              expect(data.qualityRating.clinicalQualityManagementNotRatedReason).to.be.a('string');
              expect(data.qualityRating.clinicalQualityManagementNotRatedReason).to.be("");
              expect(data.qualityRating.enrolleeExperienceRating).to.be.a('number');
              expect(data.qualityRating.enrolleeExperienceRating).to.be(0);
              expect(data.qualityRating.enrolleeExperienceNotRatedReason).to.be.a('string');
              expect(data.qualityRating.enrolleeExperienceNotRatedReason).to.be("");
              expect(data.qualityRating.planEfficiencyRating).to.be.a('number');
              expect(data.qualityRating.planEfficiencyRating).to.be(0);
              expect(data.qualityRating.planEfficiencyNotRatedReason).to.be.a('string');
              expect(data.qualityRating.planEfficiencyNotRatedReason).to.be("");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('plansPost', function() {
        it('should call plansPost successfully', function(done) {
          // TODO: uncomment, update parameter values for plansPost call and complete the assertions
          /*
          var apikey = "d687412e7b53146b2631dc01974ad0a4";
          var request = new MarketplaceApi.Request();
          request.household = new MarketplaceApi.Household();
          request.household.income = 0.0;
          request.household.unemploymentReceived = "Adult";
          request.household.people = [new MarketplaceApi.Person()];
          request.household.people[0].age = ;
          request.household.people[0].dob = "";
          request.household.people[0].hasMec = false;
          request.household.people[0].isParent = false;
          request.household.people[0].isPregnant = false;
          request.household.people[0].pregnantWith = ;
          request.household.people[0].usesTobacco = false;
          request.household.people[0].lastTobaccoUseDate = "";
          request.household.people[0].gender = new MarketplaceApi.GenderEnum();
          request.household.people[0].utilizationLevel = new MarketplaceApi.UtilizationEnum();
          request.household.people[0].relationship = new MarketplaceApi.Relationship();
          request.household.people[0].doesNotCohabitate = false;
          request.household.people[0].aptcEligible = false;
          request.household.people[0].currentEnrollment = new MarketplaceApi.CurrentEnrollment();
          request.household.people[0].currentEnrollment.planId = new MarketplaceApi.PlanID();
          request.household.people[0].currentEnrollment.effectiveDate = "";
          request.household.people[0].currentEnrollment.usesTobacco = false;
          request.household.hasMarriedCouple = false;
          request.household.effectiveDate = "";
          request.place = new MarketplaceApi.Place();
          request.place.countyfips = "";
          request.place.state = "";
          request.place.zipcode = "";
          request.market = new MarketplaceApi.MarketEnum();
          request.planIds = [""];
          request.year = ;
          request.aptcOverride = ;
          request.csrOverride = new MarketplaceApi.CSRRequestEnum();
          request.catastrophicOverride = false;
          var opts = {};
          opts.year = 2019;

          instance.plansPost(apikey, request, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(MarketplaceApi.InlineResponse2009);
            {
              let dataCtr = data.plans;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(MarketplaceApi.Plan);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.name).to.be.a('string');
                expect(data.name).to.be("");
                {
                  let dataCtr = data.benefits;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.Benefit);
                    expect(data.name).to.be.a('string');
                    expect(data.name).to.be("");
                    expect(data.covered).to.be.a('boolean');
                    expect(data.covered).to.be(false);
                    {
                      let dataCtr = data.costSharings;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(MarketplaceApi.CostSharing);
                        expect(data.coinsuranceOptions).to.be.a('string');
                        expect(data.coinsuranceOptions).to.be("");
                        expect(data.coinsuranceRate).to.be.a('number');
                        expect(data.coinsuranceRate).to.be(0.0);
                        expect(data.copayAmount).to.be.a('number');
                        expect(data.copayAmount).to.be();
                        expect(data.copayOptions).to.be.a('string');
                        expect(data.copayOptions).to.be("");
                        expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                            expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                            expect(data.displayString).to.be.a('string');
                        expect(data.displayString).to.be("");
        
                              }
                    }
                    expect(data.explanation).to.be.a('string');
                    expect(data.explanation).to.be("");
                    expect(data.exclusions).to.be.a('string');
                    expect(data.exclusions).to.be("");
                    expect(data.hasLimits).to.be.a('boolean');
                    expect(data.hasLimits).to.be(false);
                    expect(data.limitUnit).to.be.a('string');
                    expect(data.limitUnit).to.be("");
                    expect(data.limitQuantity).to.be.a('number');
                    expect(data.limitQuantity).to.be();
    
                          }
                }
                {
                  let dataCtr = data.deductibles;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.Deductible);
                    expect(data.amount).to.be.a('number');
                    expect(data.amount).to.be();
                    expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                        expect(data.familyCost).to.be.a(MarketplaceApi.FamilyCostEnum);
                        expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                        expect(data.type).to.be.a('string');
                    expect(data.type).to.be("Medical EHB Deductible");
                    expect(data.individual).to.be.a('boolean');
                    expect(data.individual).to.be(false);
                    expect(data.family).to.be.a('boolean');
                    expect(data.family).to.be(false);
                    expect(data.displayString).to.be.a('string');
                    expect(data.displayString).to.be("");
    
                          }
                }
                {
                  let dataCtr = data.diseaseMgmtPrograms;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.DiseaseMgmtProgramsEnum);
    
                          }
                }
                expect(data.hasNationalNetwork).to.be.a('boolean');
                expect(data.hasNationalNetwork).to.be(false);
                expect(data.qualityRating).to.be.a(MarketplaceApi.QualityRating);
                      expect(data.qualityRating.available).to.be.a('boolean');
                  expect(data.qualityRating.available).to.be(false);
                  expect(data.qualityRating.year).to.be.a('number');
                  expect(data.qualityRating.year).to.be(0);
                  expect(data.qualityRating.globalRating).to.be.a('number');
                  expect(data.qualityRating.globalRating).to.be(0);
                  expect(data.qualityRating.globalNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.globalNotRatedReason).to.be("");
                  expect(data.qualityRating.clinicalQualityManagementRating).to.be.a('number');
                  expect(data.qualityRating.clinicalQualityManagementRating).to.be(0);
                  expect(data.qualityRating.clinicalQualityManagementNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.clinicalQualityManagementNotRatedReason).to.be("");
                  expect(data.qualityRating.enrolleeExperienceRating).to.be.a('number');
                  expect(data.qualityRating.enrolleeExperienceRating).to.be(0);
                  expect(data.qualityRating.enrolleeExperienceNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.enrolleeExperienceNotRatedReason).to.be("");
                  expect(data.qualityRating.planEfficiencyRating).to.be.a('number');
                  expect(data.qualityRating.planEfficiencyRating).to.be(0);
                  expect(data.qualityRating.planEfficiencyNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.planEfficiencyNotRatedReason).to.be("");
                expect(data.insuranceMarket).to.be.a(MarketplaceApi.InsuranceMarketEnum);
                    expect(data.issuer).to.be.a(MarketplaceApi.Issuer);
                      {
                    let dataCtr = data.issuer.eligibleDependents;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(MarketplaceApi.Relationship);
      
                            }
                  }
                  expect(data.issuer.id).to.be.a('string');
                  expect(data.issuer.id).to.be("");
                  expect(data.issuer.individualUrl).to.be.a('string');
                  expect(data.issuer.individualUrl).to.be("");
                  expect(data.issuer.name).to.be.a('string');
                  expect(data.issuer.name).to.be("");
                  expect(data.issuer.shopUrl).to.be.a('string');
                  expect(data.issuer.shopUrl).to.be("");
                  expect(data.issuer.state).to.be.a('string');
                  expect(data.issuer.state).to.be("");
                  expect(data.issuer.tollFree).to.be.a('string');
                  expect(data.issuer.tollFree).to.be("");
                  expect(data.issuer.tty).to.be.a('string');
                  expect(data.issuer.tty).to.be("");
                expect(data.market).to.be.a(MarketplaceApi.MarketEnum);
                    expect(data.maxAgeChild).to.be.a('number');
                expect(data.maxAgeChild).to.be();
                expect(data.metalLevel).to.be.a(MarketplaceApi.MetalLevelEnum);
                    {
                  let dataCtr = data.moops;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.MOOP);
                    expect(data.amount).to.be.a('number');
                    expect(data.amount).to.be();
                    expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                        expect(data.familyCost).to.be.a('string');
                    expect(data.familyCost).to.be("Individual");
                    expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                        expect(data.type).to.be.a('string');
                    expect(data.type).to.be("Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)");
                    expect(data.individual).to.be.a('boolean');
                    expect(data.individual).to.be(false);
                    expect(data.family).to.be.a('boolean');
                    expect(data.family).to.be(false);
                    expect(data.displayString).to.be.a('string');
                    expect(data.displayString).to.be("");
    
                          }
                }
                expect(data.premium).to.be.a('number');
                expect(data.premium).to.be(0.0);
                expect(data.premiumWCredit).to.be.a('number');
                expect(data.premiumWCredit).to.be(0.0);
                expect(data.ehbPremium).to.be.a('number');
                expect(data.ehbPremium).to.be(0.0);
                expect(data.pediatricEhbPremium).to.be.a('number');
                expect(data.pediatricEhbPremium).to.be(0.0);
                expect(data.aptcEligiblePremium).to.be.a('number');
                expect(data.aptcEligiblePremium).to.be(0.0);
                expect(data.guaranteedRate).to.be.a('boolean');
                expect(data.guaranteedRate).to.be(false);
                expect(data.simpleChoice).to.be.a('boolean');
                expect(data.simpleChoice).to.be(false);
                expect(data.productDivision).to.be.a(MarketplaceApi.ProductDivisionEnum);
                    expect(data.specialistReferralRequired).to.be.a('boolean');
                expect(data.specialistReferralRequired).to.be(false);
                expect(data.state).to.be.a('string');
                expect(data.state).to.be("");
                expect(data.type).to.be.a(MarketplaceApi.PlanTypeEnum);
                    expect(data.benefitsUrl).to.be.a('string');
                expect(data.benefitsUrl).to.be("");
                expect(data.brochureUrl).to.be.a('string');
                expect(data.brochureUrl).to.be("");
                expect(data.formularyUrl).to.be.a('string');
                expect(data.formularyUrl).to.be("");
                expect(data.networkUrl).to.be.a('string');
                expect(data.networkUrl).to.be("");
                expect(data.hsaEligible).to.be.a('boolean');
                expect(data.hsaEligible).to.be(false);
                expect(data.oopc).to.be.a('number');
                expect(data.oopc).to.be();
                expect(data.suppressionState).to.be.a(MarketplaceApi.SuppressionStatus);
                    expect(data.tobaccoLookback).to.be.a('number');
                expect(data.tobaccoLookback).to.be(0);
                expect(data.certification).to.be.a(MarketplaceApi.CertificationStatus);
                    expect(data.networkAdequacy).to.be.a(MarketplaceApi.PlanNetworkAdequacy);
                      expect(data.networkAdequacy.scope).to.be.a('string');
                  expect(data.networkAdequacy.scope).to.be("");
                  expect(data.networkAdequacy.networks).to.be.a(Object);
                  expect(data.networkAdequacy.networks).to.be();
                expect(data.sbcs).to.be.a(MarketplaceApi.PlanSbcs);
                      expect(data.sbcs.baby).to.be.a(MarketplaceApi.PlanSbcsBaby);
                      expect(data.sbcs.diabetes).to.be.a(MarketplaceApi.PlanSbcsDiabetes);
                      expect(data.sbcs.fracture).to.be.a(MarketplaceApi.PlanSbcsFracture);
          
                expect(data.rx3moMailOrder).to.be.a('boolean');
                expect(data.rx3moMailOrder).to.be(false);
                expect(data.isIneligible).to.be.a('boolean');
                expect(data.isIneligible).to.be(false);
                expect(data.coversNonhydeAbortion).to.be.a('boolean');
                expect(data.coversNonhydeAbortion).to.be(false);
                expect(data.serviceAreaId).to.be.a('string');
                expect(data.serviceAreaId).to.be("");

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('plansSearchPost', function() {
        it('should call plansSearchPost successfully', function(done) {
          // TODO: uncomment, update parameter values for plansSearchPost call and complete the assertions
          /*
          var apikey = "d687412e7b53146b2631dc01974ad0a4";
          var body = new MarketplaceApi.PlanSearchRequest();
          body.filter = new MarketplaceApi.PlanSearchFilter();
          body.filter.diseaseMgmtPrograms = [new MarketplaceApi.DiseaseMgmtProgramsEnum()];
          body.filter.division = new MarketplaceApi.ProductDivisionEnum();
          body.filter.issuer = "";
          body.filter.issuers = [""];
          body.filter.metalLevels = [new MarketplaceApi.MetalLevelEnum()];
          body.filter.metalLevel = new MarketplaceApi.MetalLevelEnum();
          body.filter.metalDesignTypes = [new MarketplaceApi.MetalDesignType()];
          body.filter.metalDesignTypes[0].metalLevel = new MarketplaceApi.MetalLevelEnum();
          body.filter.metalDesignTypes[0].designTypes = [new MarketplaceApi.DesignTypeEnum()];
          body.filter.designTypes = [new MarketplaceApi.DesignTypeEnum()];
          body.filter.premium = ;
          body.filter.type = new MarketplaceApi.PlanTypeEnum();
          body.filter.types = [new MarketplaceApi.PlanTypeEnum()];
          body.filter.deductible = ;
          body.filter.hsa = false;
          body.filter.oopc = ;
          body.filter.childDentalCoverage = false;
          body.filter.adultDentalCoverage = false;
          body.filter.drugs = [""];
          body.filter.providers = [""];
          body.filter.qualityRating = ;
          body.filter.simpleChoice = false;
          body.filter.premiumRange = new MarketplaceApi.Range();
          body.filter.premiumRange.min = 0.0;
          body.filter.premiumRange.max = 0.0;
          body.filter.deductibleRange = new MarketplaceApi.Range();
          body.filter.deductibleRange.min = 0.0;
          body.filter.deductibleRange.max = 0.0;
          body.household = new MarketplaceApi.Household();
          body.household.income = 0.0;
          body.household.unemploymentReceived = "Adult";
          body.household.people = [new MarketplaceApi.Person()];
          body.household.people[0].age = ;
          body.household.people[0].dob = "";
          body.household.people[0].hasMec = false;
          body.household.people[0].isParent = false;
          body.household.people[0].isPregnant = false;
          body.household.people[0].pregnantWith = ;
          body.household.people[0].usesTobacco = false;
          body.household.people[0].lastTobaccoUseDate = "";
          body.household.people[0].gender = new MarketplaceApi.GenderEnum();
          body.household.people[0].utilizationLevel = new MarketplaceApi.UtilizationEnum();
          body.household.people[0].relationship = new MarketplaceApi.Relationship();
          body.household.people[0].doesNotCohabitate = false;
          body.household.people[0].aptcEligible = false;
          body.household.people[0].currentEnrollment = new MarketplaceApi.CurrentEnrollment();
          body.household.people[0].currentEnrollment.planId = new MarketplaceApi.PlanID();
          body.household.people[0].currentEnrollment.effectiveDate = "";
          body.household.people[0].currentEnrollment.usesTobacco = false;
          body.household.hasMarriedCouple = false;
          body.household.effectiveDate = "";
          body.offset = ;
          body.order = "asc";
          body.place = new MarketplaceApi.Place();
          body.place.countyfips = "";
          body.place.state = "";
          body.place.zipcode = "";
          body.sort = "premium";
          body.year = ;
          body.market = new MarketplaceApi.MarketEnum();
          body.aptcOverride = ;
          body.csrOverride = new MarketplaceApi.CSRRequestEnum();
          body.catastrophicOverride = false;
          body.suppressedPlanIds = new MarketplaceApi.PlanIDList();
          var opts = {};
          opts.year = 2019;

          instance.plansSearchPost(apikey, body, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(MarketplaceApi.InlineResponse20010);
            {
              let dataCtr = data.plans;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(MarketplaceApi.Plan);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.name).to.be.a('string');
                expect(data.name).to.be("");
                {
                  let dataCtr = data.benefits;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.Benefit);
                    expect(data.name).to.be.a('string');
                    expect(data.name).to.be("");
                    expect(data.covered).to.be.a('boolean');
                    expect(data.covered).to.be(false);
                    {
                      let dataCtr = data.costSharings;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(MarketplaceApi.CostSharing);
                        expect(data.coinsuranceOptions).to.be.a('string');
                        expect(data.coinsuranceOptions).to.be("");
                        expect(data.coinsuranceRate).to.be.a('number');
                        expect(data.coinsuranceRate).to.be(0.0);
                        expect(data.copayAmount).to.be.a('number');
                        expect(data.copayAmount).to.be();
                        expect(data.copayOptions).to.be.a('string');
                        expect(data.copayOptions).to.be("");
                        expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                            expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                            expect(data.displayString).to.be.a('string');
                        expect(data.displayString).to.be("");
        
                              }
                    }
                    expect(data.explanation).to.be.a('string');
                    expect(data.explanation).to.be("");
                    expect(data.exclusions).to.be.a('string');
                    expect(data.exclusions).to.be("");
                    expect(data.hasLimits).to.be.a('boolean');
                    expect(data.hasLimits).to.be(false);
                    expect(data.limitUnit).to.be.a('string');
                    expect(data.limitUnit).to.be("");
                    expect(data.limitQuantity).to.be.a('number');
                    expect(data.limitQuantity).to.be();
    
                          }
                }
                {
                  let dataCtr = data.deductibles;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.Deductible);
                    expect(data.amount).to.be.a('number');
                    expect(data.amount).to.be();
                    expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                        expect(data.familyCost).to.be.a(MarketplaceApi.FamilyCostEnum);
                        expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                        expect(data.type).to.be.a('string');
                    expect(data.type).to.be("Medical EHB Deductible");
                    expect(data.individual).to.be.a('boolean');
                    expect(data.individual).to.be(false);
                    expect(data.family).to.be.a('boolean');
                    expect(data.family).to.be(false);
                    expect(data.displayString).to.be.a('string');
                    expect(data.displayString).to.be("");
    
                          }
                }
                {
                  let dataCtr = data.diseaseMgmtPrograms;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.DiseaseMgmtProgramsEnum);
    
                          }
                }
                expect(data.hasNationalNetwork).to.be.a('boolean');
                expect(data.hasNationalNetwork).to.be(false);
                expect(data.qualityRating).to.be.a(MarketplaceApi.QualityRating);
                      expect(data.qualityRating.available).to.be.a('boolean');
                  expect(data.qualityRating.available).to.be(false);
                  expect(data.qualityRating.year).to.be.a('number');
                  expect(data.qualityRating.year).to.be(0);
                  expect(data.qualityRating.globalRating).to.be.a('number');
                  expect(data.qualityRating.globalRating).to.be(0);
                  expect(data.qualityRating.globalNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.globalNotRatedReason).to.be("");
                  expect(data.qualityRating.clinicalQualityManagementRating).to.be.a('number');
                  expect(data.qualityRating.clinicalQualityManagementRating).to.be(0);
                  expect(data.qualityRating.clinicalQualityManagementNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.clinicalQualityManagementNotRatedReason).to.be("");
                  expect(data.qualityRating.enrolleeExperienceRating).to.be.a('number');
                  expect(data.qualityRating.enrolleeExperienceRating).to.be(0);
                  expect(data.qualityRating.enrolleeExperienceNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.enrolleeExperienceNotRatedReason).to.be("");
                  expect(data.qualityRating.planEfficiencyRating).to.be.a('number');
                  expect(data.qualityRating.planEfficiencyRating).to.be(0);
                  expect(data.qualityRating.planEfficiencyNotRatedReason).to.be.a('string');
                  expect(data.qualityRating.planEfficiencyNotRatedReason).to.be("");
                expect(data.insuranceMarket).to.be.a(MarketplaceApi.InsuranceMarketEnum);
                    expect(data.issuer).to.be.a(MarketplaceApi.Issuer);
                      {
                    let dataCtr = data.issuer.eligibleDependents;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(MarketplaceApi.Relationship);
      
                            }
                  }
                  expect(data.issuer.id).to.be.a('string');
                  expect(data.issuer.id).to.be("");
                  expect(data.issuer.individualUrl).to.be.a('string');
                  expect(data.issuer.individualUrl).to.be("");
                  expect(data.issuer.name).to.be.a('string');
                  expect(data.issuer.name).to.be("");
                  expect(data.issuer.shopUrl).to.be.a('string');
                  expect(data.issuer.shopUrl).to.be("");
                  expect(data.issuer.state).to.be.a('string');
                  expect(data.issuer.state).to.be("");
                  expect(data.issuer.tollFree).to.be.a('string');
                  expect(data.issuer.tollFree).to.be("");
                  expect(data.issuer.tty).to.be.a('string');
                  expect(data.issuer.tty).to.be("");
                expect(data.market).to.be.a(MarketplaceApi.MarketEnum);
                    expect(data.maxAgeChild).to.be.a('number');
                expect(data.maxAgeChild).to.be();
                expect(data.metalLevel).to.be.a(MarketplaceApi.MetalLevelEnum);
                    {
                  let dataCtr = data.moops;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.MOOP);
                    expect(data.amount).to.be.a('number');
                    expect(data.amount).to.be();
                    expect(data.csr).to.be.a(MarketplaceApi.CostSharingReductionEnum);
                        expect(data.familyCost).to.be.a('string');
                    expect(data.familyCost).to.be("Individual");
                    expect(data.networkTier).to.be.a(MarketplaceApi.NetworkTierEnum);
                        expect(data.type).to.be.a('string');
                    expect(data.type).to.be("Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)");
                    expect(data.individual).to.be.a('boolean');
                    expect(data.individual).to.be(false);
                    expect(data.family).to.be.a('boolean');
                    expect(data.family).to.be(false);
                    expect(data.displayString).to.be.a('string');
                    expect(data.displayString).to.be("");
    
                          }
                }
                expect(data.premium).to.be.a('number');
                expect(data.premium).to.be(0.0);
                expect(data.premiumWCredit).to.be.a('number');
                expect(data.premiumWCredit).to.be(0.0);
                expect(data.ehbPremium).to.be.a('number');
                expect(data.ehbPremium).to.be(0.0);
                expect(data.pediatricEhbPremium).to.be.a('number');
                expect(data.pediatricEhbPremium).to.be(0.0);
                expect(data.aptcEligiblePremium).to.be.a('number');
                expect(data.aptcEligiblePremium).to.be(0.0);
                expect(data.guaranteedRate).to.be.a('boolean');
                expect(data.guaranteedRate).to.be(false);
                expect(data.simpleChoice).to.be.a('boolean');
                expect(data.simpleChoice).to.be(false);
                expect(data.productDivision).to.be.a(MarketplaceApi.ProductDivisionEnum);
                    expect(data.specialistReferralRequired).to.be.a('boolean');
                expect(data.specialistReferralRequired).to.be(false);
                expect(data.state).to.be.a('string');
                expect(data.state).to.be("");
                expect(data.type).to.be.a(MarketplaceApi.PlanTypeEnum);
                    expect(data.benefitsUrl).to.be.a('string');
                expect(data.benefitsUrl).to.be("");
                expect(data.brochureUrl).to.be.a('string');
                expect(data.brochureUrl).to.be("");
                expect(data.formularyUrl).to.be.a('string');
                expect(data.formularyUrl).to.be("");
                expect(data.networkUrl).to.be.a('string');
                expect(data.networkUrl).to.be("");
                expect(data.hsaEligible).to.be.a('boolean');
                expect(data.hsaEligible).to.be(false);
                expect(data.oopc).to.be.a('number');
                expect(data.oopc).to.be();
                expect(data.suppressionState).to.be.a(MarketplaceApi.SuppressionStatus);
                    expect(data.tobaccoLookback).to.be.a('number');
                expect(data.tobaccoLookback).to.be(0);
                expect(data.certification).to.be.a(MarketplaceApi.CertificationStatus);
                    expect(data.networkAdequacy).to.be.a(MarketplaceApi.PlanNetworkAdequacy);
                      expect(data.networkAdequacy.scope).to.be.a('string');
                  expect(data.networkAdequacy.scope).to.be("");
                  expect(data.networkAdequacy.networks).to.be.a(Object);
                  expect(data.networkAdequacy.networks).to.be();
                expect(data.sbcs).to.be.a(MarketplaceApi.PlanSbcs);
                      expect(data.sbcs.baby).to.be.a(MarketplaceApi.PlanSbcsBaby);
                      expect(data.sbcs.diabetes).to.be.a(MarketplaceApi.PlanSbcsDiabetes);
                      expect(data.sbcs.fracture).to.be.a(MarketplaceApi.PlanSbcsFracture);
          
                expect(data.rx3moMailOrder).to.be.a('boolean');
                expect(data.rx3moMailOrder).to.be(false);
                expect(data.isIneligible).to.be.a('boolean');
                expect(data.isIneligible).to.be(false);
                expect(data.coversNonhydeAbortion).to.be.a('boolean');
                expect(data.coversNonhydeAbortion).to.be(false);
                expect(data.serviceAreaId).to.be.a('string');
                expect(data.serviceAreaId).to.be("");

                      }
            }
            expect(data.total).to.be.a('number');
            expect(data.total).to.be();
            {
              let dataCtr = data.facetGroups;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(MarketplaceApi.InlineResponse20010FacetGroups);
                expect(data.name).to.be.a('string');
                expect(data.name).to.be("");
                {
                  let dataCtr = data.facets;
                  expect(dataCtr).to.be.an(Array);
                  expect(dataCtr).to.not.be.empty();
                  for (let p in dataCtr) {
                    let data = dataCtr[p];
                    expect(data).to.be.a(MarketplaceApi.InlineResponse20010Facets);
                    expect(data.value).to.be.a('string');
                    expect(data.value).to.be("");
                    expect(data.count).to.be.a('number');
                    expect(data.count).to.be();
    
                          }
                }

                      }
            }
            expect(data.rateArea).to.be.a(MarketplaceApi.RateArea);
                  expect(data.rateArea.state).to.be.a('string');
              expect(data.rateArea.state).to.be("");
              expect(data.rateArea.area).to.be.a('number');
              expect(data.rateArea.area).to.be(0);
            expect(data.ranges).to.be.a(MarketplaceApi.InlineResponse20010Ranges);
                  expect(data.ranges.premiums).to.be.a(MarketplaceApi.Range);
                    expect(data.ranges.premiums.min).to.be.a('number');
                expect(data.ranges.premiums.min).to.be(0.0);
                expect(data.ranges.premiums.max).to.be.a('number');
                expect(data.ranges.premiums.max).to.be(0.0);
              expect(data.ranges.deductibles).to.be.a(MarketplaceApi.Range);
                    expect(data.ranges.deductibles.min).to.be.a('number');
                expect(data.ranges.deductibles.min).to.be(0.0);
                expect(data.ranges.deductibles.max).to.be.a('number');
                expect(data.ranges.deductibles.max).to.be(0.0);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('plansSearchStatsPost', function() {
        it('should call plansSearchStatsPost successfully', function(done) {
          // TODO: uncomment, update parameter values for plansSearchStatsPost call and complete the assertions
          /*
          var apikey = "d687412e7b53146b2631dc01974ad0a4";
          var search = new MarketplaceApi.PlanSearchRequest();
          search.filter = new MarketplaceApi.PlanSearchFilter();
          search.filter.diseaseMgmtPrograms = [new MarketplaceApi.DiseaseMgmtProgramsEnum()];
          search.filter.division = new MarketplaceApi.ProductDivisionEnum();
          search.filter.issuer = "";
          search.filter.issuers = [""];
          search.filter.metalLevels = [new MarketplaceApi.MetalLevelEnum()];
          search.filter.metalLevel = new MarketplaceApi.MetalLevelEnum();
          search.filter.metalDesignTypes = [new MarketplaceApi.MetalDesignType()];
          search.filter.metalDesignTypes[0].metalLevel = new MarketplaceApi.MetalLevelEnum();
          search.filter.metalDesignTypes[0].designTypes = [new MarketplaceApi.DesignTypeEnum()];
          search.filter.designTypes = [new MarketplaceApi.DesignTypeEnum()];
          search.filter.premium = ;
          search.filter.type = new MarketplaceApi.PlanTypeEnum();
          search.filter.types = [new MarketplaceApi.PlanTypeEnum()];
          search.filter.deductible = ;
          search.filter.hsa = false;
          search.filter.oopc = ;
          search.filter.childDentalCoverage = false;
          search.filter.adultDentalCoverage = false;
          search.filter.drugs = [""];
          search.filter.providers = [""];
          search.filter.qualityRating = ;
          search.filter.simpleChoice = false;
          search.filter.premiumRange = new MarketplaceApi.Range();
          search.filter.premiumRange.min = 0.0;
          search.filter.premiumRange.max = 0.0;
          search.filter.deductibleRange = new MarketplaceApi.Range();
          search.filter.deductibleRange.min = 0.0;
          search.filter.deductibleRange.max = 0.0;
          search.household = new MarketplaceApi.Household();
          search.household.income = 0.0;
          search.household.unemploymentReceived = "Adult";
          search.household.people = [new MarketplaceApi.Person()];
          search.household.people[0].age = ;
          search.household.people[0].dob = "";
          search.household.people[0].hasMec = false;
          search.household.people[0].isParent = false;
          search.household.people[0].isPregnant = false;
          search.household.people[0].pregnantWith = ;
          search.household.people[0].usesTobacco = false;
          search.household.people[0].lastTobaccoUseDate = "";
          search.household.people[0].gender = new MarketplaceApi.GenderEnum();
          search.household.people[0].utilizationLevel = new MarketplaceApi.UtilizationEnum();
          search.household.people[0].relationship = new MarketplaceApi.Relationship();
          search.household.people[0].doesNotCohabitate = false;
          search.household.people[0].aptcEligible = false;
          search.household.people[0].currentEnrollment = new MarketplaceApi.CurrentEnrollment();
          search.household.people[0].currentEnrollment.planId = new MarketplaceApi.PlanID();
          search.household.people[0].currentEnrollment.effectiveDate = "";
          search.household.people[0].currentEnrollment.usesTobacco = false;
          search.household.hasMarriedCouple = false;
          search.household.effectiveDate = "";
          search.offset = ;
          search.order = "asc";
          search.place = new MarketplaceApi.Place();
          search.place.countyfips = "";
          search.place.state = "";
          search.place.zipcode = "";
          search.sort = "premium";
          search.year = ;
          search.market = new MarketplaceApi.MarketEnum();
          search.aptcOverride = ;
          search.csrOverride = new MarketplaceApi.CSRRequestEnum();
          search.catastrophicOverride = false;
          search.suppressedPlanIds = new MarketplaceApi.PlanIDList();
          var opts = {};
          opts.year = 2019;

          instance.plansSearchStatsPost(apikey, search, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            let dataCtr = data;
            expect(dataCtr).to.be.an(Array);
            expect(dataCtr).to.not.be.empty();
            for (let p in dataCtr) {
              let data = dataCtr[p];
              expect(data).to.be.a(MarketplaceApi.InlineResponse20011);
              expect(data.metalLevel).to.be.a(MarketplaceApi.MetalLevelEnum);
                  expect(data.total).to.be.a('number');
              expect(data.total).to.be();
              expect(data.simpleChoice).to.be.a('number');
              expect(data.simpleChoice).to.be();
              expect(data.premiums).to.be.a(MarketplaceApi.PlanssearchstatsPremiums);
                    expect(data.premiums.min).to.be.a('number');
                expect(data.premiums.min).to.be();
                expect(data.premiums.max).to.be.a('number');
                expect(data.premiums.max).to.be();
                expect(data.premiums.mean).to.be.a('number');
                expect(data.premiums.mean).to.be();
              expect(data.oopc).to.be.a(MarketplaceApi.PlanssearchstatsPremiums);
                    expect(data.oopc.min).to.be.a('number');
                expect(data.oopc.min).to.be();
                expect(data.oopc.max).to.be.a('number');
                expect(data.oopc.max).to.be();
                expect(data.oopc.mean).to.be.a('number');
                expect(data.oopc.mean).to.be();
              expect(data.qualityRatings).to.be.a(MarketplaceApi.PlanssearchstatsQualityRatings);
                    expect(data.qualityRatings.fiveStarRating).to.be.a('number');
                expect(data.qualityRatings.fiveStarRating).to.be();
                expect(data.qualityRatings.fourStarRating).to.be.a('number');
                expect(data.qualityRatings.fourStarRating).to.be();
                expect(data.qualityRatings.threeStarRating).to.be.a('number');
                expect(data.qualityRatings.threeStarRating).to.be();
                expect(data.qualityRatings.twoStarRating).to.be.a('number');
                expect(data.qualityRatings.twoStarRating).to.be();
                expect(data.qualityRatings.oneStarRating).to.be.a('number');
                expect(data.qualityRatings.oneStarRating).to.be();
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
    });
  });

}));
