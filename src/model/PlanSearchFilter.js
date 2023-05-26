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
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DesignTypeEnum', 'model/DiseaseMgmtProgramsEnum', 'model/MetalDesignType', 'model/MetalLevelEnum', 'model/PlanTypeEnum', 'model/ProductDivisionEnum', 'model/Range'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DesignTypeEnum'), require('./DiseaseMgmtProgramsEnum'), require('./MetalDesignType'), require('./MetalLevelEnum'), require('./PlanTypeEnum'), require('./ProductDivisionEnum'), require('./Range'));
  } else {
    // Browser globals (root is window)
    if (!root.MarketplaceApi) {
      root.MarketplaceApi = {};
    }
    root.MarketplaceApi.PlanSearchFilter = factory(root.MarketplaceApi.ApiClient, root.MarketplaceApi.DesignTypeEnum, root.MarketplaceApi.DiseaseMgmtProgramsEnum, root.MarketplaceApi.MetalDesignType, root.MarketplaceApi.MetalLevelEnum, root.MarketplaceApi.PlanTypeEnum, root.MarketplaceApi.ProductDivisionEnum, root.MarketplaceApi.Range);
  }
}(this, function(ApiClient, DesignTypeEnum, DiseaseMgmtProgramsEnum, MetalDesignType, MetalLevelEnum, PlanTypeEnum, ProductDivisionEnum, Range) {
  'use strict';

  /**
   * The PlanSearchFilter model module.
   * @module model/PlanSearchFilter
   * @version 1
   */

  /**
   * Constructs a new <code>PlanSearchFilter</code>.
   * plan search filter
   * @alias module:model/PlanSearchFilter
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>PlanSearchFilter</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PlanSearchFilter} obj Optional instance to populate.
   * @return {module:model/PlanSearchFilter} The populated <code>PlanSearchFilter</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('disease_mgmt_programs'))
        obj.diseaseMgmtPrograms = ApiClient.convertToType(data['disease_mgmt_programs'], [DiseaseMgmtProgramsEnum]);
      if (data.hasOwnProperty('division'))
        obj.division = ProductDivisionEnum.constructFromObject(data['division']);
      if (data.hasOwnProperty('issuer'))
        obj.issuer = ApiClient.convertToType(data['issuer'], 'String');
      if (data.hasOwnProperty('issuers'))
        obj.issuers = ApiClient.convertToType(data['issuers'], ['String']);
      if (data.hasOwnProperty('metal_levels'))
        obj.metalLevels = ApiClient.convertToType(data['metal_levels'], [MetalLevelEnum]);
      if (data.hasOwnProperty('metal_level'))
        obj.metalLevel = MetalLevelEnum.constructFromObject(data['metal_level']);
      if (data.hasOwnProperty('metal_design_types'))
        obj.metalDesignTypes = ApiClient.convertToType(data['metal_design_types'], [MetalDesignType]);
      if (data.hasOwnProperty('design_types'))
        obj.designTypes = ApiClient.convertToType(data['design_types'], [DesignTypeEnum]);
      if (data.hasOwnProperty('premium'))
        obj.premium = ApiClient.convertToType(data['premium'], 'Number');
      if (data.hasOwnProperty('type'))
        obj.type = PlanTypeEnum.constructFromObject(data['type']);
      if (data.hasOwnProperty('types'))
        obj.types = ApiClient.convertToType(data['types'], [PlanTypeEnum]);
      if (data.hasOwnProperty('deductible'))
        obj.deductible = ApiClient.convertToType(data['deductible'], 'Number');
      if (data.hasOwnProperty('hsa'))
        obj.hsa = ApiClient.convertToType(data['hsa'], 'Boolean');
      if (data.hasOwnProperty('oopc'))
        obj.oopc = ApiClient.convertToType(data['oopc'], 'Number');
      if (data.hasOwnProperty('child_dental_coverage'))
        obj.childDentalCoverage = ApiClient.convertToType(data['child_dental_coverage'], 'Boolean');
      if (data.hasOwnProperty('adult_dental_coverage'))
        obj.adultDentalCoverage = ApiClient.convertToType(data['adult_dental_coverage'], 'Boolean');
      if (data.hasOwnProperty('drugs'))
        obj.drugs = ApiClient.convertToType(data['drugs'], ['String']);
      if (data.hasOwnProperty('providers'))
        obj.providers = ApiClient.convertToType(data['providers'], ['String']);
      if (data.hasOwnProperty('quality_rating'))
        obj.qualityRating = ApiClient.convertToType(data['quality_rating'], 'Number');
      if (data.hasOwnProperty('simple_choice'))
        obj.simpleChoice = ApiClient.convertToType(data['simple_choice'], 'Boolean');
      if (data.hasOwnProperty('premium_range'))
        obj.premiumRange = Range.constructFromObject(data['premium_range']);
      if (data.hasOwnProperty('deductible_range'))
        obj.deductibleRange = Range.constructFromObject(data['deductible_range']);
    }
    return obj;
  }

  /**
   * @member {Array.<module:model/DiseaseMgmtProgramsEnum>} diseaseMgmtPrograms
   */
  exports.prototype.diseaseMgmtPrograms = undefined;

  /**
   * @member {module:model/ProductDivisionEnum} division
   */
  exports.prototype.division = undefined;

  /**
   * Issuer name
   * @member {String} issuer
   */
  exports.prototype.issuer = undefined;

  /**
   * A List of Issuers names
   * @member {Array.<String>} issuers
   */
  exports.prototype.issuers = undefined;

  /**
   * A list of Metalic Levels
   * @member {Array.<module:model/MetalLevelEnum>} metalLevels
   */
  exports.prototype.metalLevels = undefined;

  /**
   * @member {module:model/MetalLevelEnum} metalLevel
   */
  exports.prototype.metalLevel = undefined;

  /**
   * A list of Plan Design Type / Metalic Level Combinations
   * @member {Array.<module:model/MetalDesignType>} metalDesignTypes
   */
  exports.prototype.metalDesignTypes = undefined;

  /**
   * A list of Plan Design Types
   * @member {Array.<module:model/DesignTypeEnum>} designTypes
   */
  exports.prototype.designTypes = undefined;

  /**
   * @member {Number} premium
   */
  exports.prototype.premium = undefined;

  /**
   * @member {module:model/PlanTypeEnum} type
   */
  exports.prototype.type = undefined;

  /**
   * a list of plan types
   * @member {Array.<module:model/PlanTypeEnum>} types
   */
  exports.prototype.types = undefined;

  /**
   * @member {Number} deductible
   */
  exports.prototype.deductible = undefined;

  /**
   * HSA eligibilty
   * @member {Boolean} hsa
   */
  exports.prototype.hsa = undefined;

  /**
   * Out of Pocket Costs
   * @member {Number} oopc
   */
  exports.prototype.oopc = undefined;

  /**
   * Only show plans with child dental coverage
   * @member {Boolean} childDentalCoverage
   */
  exports.prototype.childDentalCoverage = undefined;

  /**
   * Only show plans with adult dental coverage
   * @member {Boolean} adultDentalCoverage
   */
  exports.prototype.adultDentalCoverage = undefined;

  /**
   * A list of RXCUIs
   * @member {Array.<String>} drugs
   */
  exports.prototype.drugs = undefined;

  /**
   * A list of NPIs
   * @member {Array.<String>} providers
   */
  exports.prototype.providers = undefined;

  /**
   * Quality ratings for a plan
   * @member {Number} qualityRating
   */
  exports.prototype.qualityRating = undefined;

  /**
   * @member {Boolean} simpleChoice
   */
  exports.prototype.simpleChoice = undefined;

  /**
   * @member {module:model/Range} premiumRange
   */
  exports.prototype.premiumRange = undefined;

  /**
   * @member {module:model/Range} deductibleRange
   */
  exports.prototype.deductibleRange = undefined;


  return exports;

}));
