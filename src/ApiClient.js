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
    define(['superagent', 'querystring'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('superagent'), require('querystring'));
  } else {
    // Browser globals (root is window)
    if (!root.MarketplaceApi) {
      root.MarketplaceApi = {};
    }
    root.MarketplaceApi.ApiClient = factory(root.superagent, root.querystring);
  }
}(this, function(superagent, querystring) {
  'use strict';

  /**
   * @module ApiClient
   * @version 1
   */

  /**
   * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
   * application to use this class directly - the *Api and model classes provide the public API for the service. The
   * contents of this file should be regarded as internal but are documented for completeness.
   * @alias module:ApiClient
   * @class
   */
  var exports = function() {
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default https://marketplace.api.healthcare.gov/api/v1
     */
    this.basePath = 'https://marketplace.api.healthcare.gov/api/v1'.replace(/\/+$/, '');

    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */
    this.authentications = {
      'API Key': {type: 'apiKey', 'in': 'query', name: 'apikey'}
    };
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */
    this.defaultHeaders = {};

    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */
    this.timeout = 60000;

    /**
     * If set to false an additional timestamp parameter is added to all API GET calls to
     * prevent browser caching
     * @type {Boolean}
     * @default true
     */
    this.cache = true;

    /**
     * If set to true, the client will save the cookies from each server
     * response, and return them in the next request.
     * @default false
     */
    this.enableCookies = false;

    /*
     * Used to save and return cookies in a node.js (non-browser) setting,
     * if this.enableCookies is set to true.
     */
    if (typeof window === 'undefined') {
      this.agent = new superagent.agent();
    }

    /*
     * Allow user to override superagent agent
     */
    this.requestAgent = null;
  };

  /**
   * Returns a string representation for an actual parameter.
   * @param param The actual parameter.
   * @returns {String} The string representation of <code>param</code>.
   */
  exports.prototype.paramToString = function(param) {
    if (param == undefined || param == null) {
      return '';
    }
    if (param instanceof Date) {
      return param.toISOString();
    }
    return param.toString();
  };

  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @returns {String} The encoded path with parameter values substituted.
   */
  exports.prototype.buildUrl = function(path, pathParams) {
    if (!path.match(/^\//)) {
      path = '/' + path;
    }
    var url = this.basePath + path;
    var _this = this;
    url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
      var value;
      if (pathParams.hasOwnProperty(key)) {
        value = _this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });
    return url;
  };

  /**
   * Checks whether the given content type represents JSON.<br>
   * JSON content type examples:<br>
   * <ul>
   * <li>application/json</li>
   * <li>application/json; charset=UTF8</li>
   * <li>APPLICATION/JSON</li>
   * </ul>
   * @param {String} contentType The MIME content type to check.
   * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
   */
  exports.prototype.isJsonMime = function(contentType) {
    return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
  };

  /**
   * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
   * @param {Array.<String>} contentTypes
   * @returns {String} The chosen content type, preferring JSON.
   */
  exports.prototype.jsonPreferredMime = function(contentTypes) {
    for (var i = 0; i < contentTypes.length; i++) {
      if (this.isJsonMime(contentTypes[i])) {
        return contentTypes[i];
      }
    }
    return contentTypes[0];
  };

  /**
   * Checks whether the given parameter value represents file-like content.
   * @param param The parameter to check.
   * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
   */
  exports.prototype.isFileParam = function(param) {
    // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
    if (typeof require === 'function') {
      var fs;
      try {
        fs = require('fs');
      } catch (err) {}
      if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
        return true;
      }
    }
    // Buffer in Node.js
    if (typeof Buffer === 'function' && param instanceof Buffer) {
      return true;
    }
    // Blob in browser
    if (typeof Blob === 'function' && param instanceof Blob) {
      return true;
    }
    // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    if (typeof File === 'function' && param instanceof File) {
      return true;
    }
    return false;
  };

  /**
   * Normalizes parameter values:
   * <ul>
   * <li>remove nils</li>
   * <li>keep files and arrays</li>
   * <li>format to string with `paramToString` for other cases</li>
   * </ul>
   * @param {Object.<String, Object>} params The parameters as object properties.
   * @returns {Object.<String, Object>} normalized parameters.
   */
  exports.prototype.normalizeParams = function(params) {
    var newParams = {};
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
        var value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = this.paramToString(value);
        }
      }
    }
    return newParams;
  };

  /**
   * Enumeration of collection format separator strategies.
   * @enum {String}
   * @readonly
   */
  exports.CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ',',
    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: ' ',
    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: '\t',
    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: '|',
    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: 'multi'
  };

  /**
   * Builds a string representation of an array-type actual parameter, according to the given collection format.
   * @param {Array} param An array parameter.
   * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
   * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
   * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
   */
  exports.prototype.buildCollectionParam = function buildCollectionParam(param, collectionFormat) {
    if (param == null) {
      return null;
    }
    switch (collectionFormat) {
      case 'csv':
        return param.map(this.paramToString).join(',');
      case 'ssv':
        return param.map(this.paramToString).join(' ');
      case 'tsv':
        return param.map(this.paramToString).join('\t');
      case 'pipes':
        return param.map(this.paramToString).join('|');
      case 'multi':
        // return the array directly as SuperAgent will handle it as expected
        return param.map(this.paramToString);
      default:
        throw new Error('Unknown collection format: ' + collectionFormat);
    }
  };

  /**
   * Applies authentication headers to the request.
   * @param {Object} request The request object created by a <code>superagent()</code> call.
   * @param {Array.<String>} authNames An array of authentication method names.
   */
  exports.prototype.applyAuthToRequest = function(request, authNames) {
    var _this = this;
    authNames.forEach(function(authName) {
      var auth = _this.authentications[authName];
      switch (auth.type) {
        case 'basic':
          if (auth.username || auth.password) {
            request.auth(auth.username || '', auth.password || '');
          }
          break;
        case 'apiKey':
          if (auth.apiKey) {
            var data = {};
            if (auth.apiKeyPrefix) {
              data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
            } else {
              data[auth.name] = auth.apiKey;
            }
            if (auth['in'] === 'header') {
              request.set(data);
            } else {
              request.query(data);
            }
          }
          break;
        case 'oauth2':
          if (auth.accessToken) {
            request.set({'Authorization': 'Bearer ' + auth.accessToken});
          }
          break;
        default:
          throw new Error('Unknown authentication type: ' + auth.type);
      }
    });
  };

  /**
   * Deserializes an HTTP response body into a value of the specified type.
   * @param {Object} response A SuperAgent response object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns A value of the specified type.
   */
  exports.prototype.deserialize = function deserialize(response, returnType) {
    if (response == null || returnType == null || response.status == 204) {
      return null;
    }
    // Rely on SuperAgent for parsing response body.
    // See http://visionmedia.github.io/superagent/#parsing-response-bodies
    var data = response.body;
    if (data == null || (typeof data === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length)) {
      // SuperAgent does not always produce a body; use the unparsed response as a fallback
      data = response.text;
    }
    return exports.convertToType(data, returnType);
  };

  /**
   * Callback function to receive the result of the operation.
   * @callback module:ApiClient~callApiCallback
   * @param {String} error Error message, if any.
   * @param data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Invokes the REST service using the supplied settings and parameters.
   * @param {String} path The base URL to invoke.
   * @param {String} httpMethod The HTTP method to use.
   * @param {Object.<String, String>} pathParams A map of path parameters and their values.
   * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
   * @param {Object.<String, Object>} collectionQueryParams A map of collection query parameters and their values.
   * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
   * @param {Object.<String, Object>} formParams A map of form parameters and their values.
   * @param {Object} bodyParam The value to pass as the request body.
   * @param {Array.<String>} authNames An array of authentication type names.
   * @param {Array.<String>} contentTypes An array of request MIME types.
   * @param {Array.<String>} accepts An array of acceptable response MIME types.
   * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
   * constructor for a complex type.
   * @param {module:ApiClient~callApiCallback} callback The callback function.
   * @returns {Object} The SuperAgent request object.
   */
  exports.prototype.callApi = function callApi(path, httpMethod, pathParams,
      queryParams, collectionQueryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts,
      returnType, callback) {

    var _this = this;
    var url = this.buildUrl(path, pathParams);
    var request = superagent(httpMethod, url);

    // apply authentications
    this.applyAuthToRequest(request, authNames);

    // set collection query parameters
    for (var key in collectionQueryParams) {
      if (collectionQueryParams.hasOwnProperty(key)) {
        var param = collectionQueryParams[key];
        if (param.collectionFormat === 'csv') {
          // SuperAgent normally percent-encodes all reserved characters in a query parameter. However,
          // commas are used as delimiters for the 'csv' collectionFormat so they must not be encoded. We
          // must therefore construct and encode 'csv' collection query parameters manually.
          if (param.value != null) {
            var value = param.value.map(this.paramToString).map(encodeURIComponent).join(',');
            request.query(encodeURIComponent(key) + "=" + value);
          }
        } else {
          // All other collection query parameters should be treated as ordinary query parameters.
          queryParams[key] = this.buildCollectionParam(param.value, param.collectionFormat);
        }
      }
    }

    // set query parameters
    if (httpMethod.toUpperCase() === 'GET' && this.cache === false) {
        queryParams['_'] = new Date().getTime();
    }
    request.query(this.normalizeParams(queryParams));

    // set header parameters
    request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));


    // set requestAgent if it is set by user
    if (this.requestAgent) {
      request.agent(this.requestAgent);
    }

    // set request timeout
    request.timeout(this.timeout);

    var contentType = this.jsonPreferredMime(contentTypes);
    if (contentType) {
      // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
      if(contentType != 'multipart/form-data') {
        request.type(contentType);
      }
    } else if (!request.header['Content-Type']) {
      request.type('application/json');
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      request.send(querystring.stringify(this.normalizeParams(formParams)));
    } else if (contentType == 'multipart/form-data') {
      var _formParams = this.normalizeParams(formParams);
      for (var key in _formParams) {
        if (_formParams.hasOwnProperty(key)) {
          if (this.isFileParam(_formParams[key])) {
            // file field
            request.attach(key, _formParams[key]);
          } else {
            request.field(key, _formParams[key]);
          }
        }
      }
    } else if (bodyParam) {
      request.send(bodyParam);
    }

    var accept = this.jsonPreferredMime(accepts);
    if (accept) {
      request.accept(accept);
    }

    if (returnType === 'Blob') {
      request.responseType('blob');
    } else if (returnType === 'String') {
      request.responseType('string');
    }

    // Attach previously saved cookies, if enabled
    if (this.enableCookies){
      if (typeof window === 'undefined') {
        this.agent.attachCookies(request);
      }
      else {
        request.withCredentials();
      }
    }


    request.end(function(error, response) {
      if (callback) {
        var data = null;
        if (!error) {
          try {
            data = _this.deserialize(response, returnType);
            if (_this.enableCookies && typeof window === 'undefined'){
              _this.agent.saveCookies(response);
            }
          } catch (err) {
            error = err;
          }
        }
        callback(error, data, response);
      }
    });

    return request;
  };

  /**
   * Parses a string representation of a date value.
   * @param {String} str The date value as an ISO-8601 full-date or date-time string.
   * @returns {Date} The parsed date object.
   */
  exports.parseDate = function(str) {
    // OpenAPI 2.0 & 3.0 specs state that:
    // - date values are serialized as ISO-8601 full-date strings. 
    // - date-time values are serialized as ISO-8601 date-time strings, in which the timezone offset is mandatory. 
    return new Date(str);
  };

  /**
   * Converts a value to the specified type.
   * @param {(String|Object)} data The data to convert, as a string or object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns An instance of the specified type or null or undefined if data is null or undefined.
   */
  exports.convertToType = function(data, type) {
    if (data === null || data === undefined)
      return data

    switch (type) {
      case 'Boolean':
        return Boolean(data);
      case 'Integer':
        return parseInt(data, 10);
      case 'Number':
        return parseFloat(data);
      case 'String':
        return String(data);
      case 'Date':
        return this.parseDate(String(data));
      case 'Blob':
      	return data;
      default:
        if (type === Object) {
          // generic object, return directly
          return data;
        } else if (typeof type === 'function') {
          // for model type like: User
          return type.constructFromObject(data);
        } else if (Array.isArray(type)) {
          // for array type like: ['String']
          var itemType = type[0];
          return data.map(function(item) {
            return exports.convertToType(item, itemType);
          });
        } else if (typeof type === 'object') {
          // for plain object type like: {'String': 'Integer'}
          var keyType, valueType;
          for (var k in type) {
            if (type.hasOwnProperty(k)) {
              keyType = k;
              valueType = type[k];
              break;
            }
          }
          var result = {};
          for (var k in data) {
            if (data.hasOwnProperty(k)) {
              var key = exports.convertToType(k, keyType);
              var value = exports.convertToType(data[k], valueType);
              result[key] = value;
            }
          }
          return result;
        } else {
          // for unknown type, return the data directly
          return data;
        }
    }
  };

  /**
   * Constructs a new map or array model from REST data.
   * @param data {Object|Array} The REST data.
   * @param obj {Object|Array} The target object or array.
   */
  exports.constructFromObject = function(data, obj, itemType) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i))
          obj[i] = exports.convertToType(data[i], itemType);
      }
    } else {
      for (var k in data) {
        if (data.hasOwnProperty(k))
          obj[k] = exports.convertToType(data[k], itemType);
      }
    }
  };

  /**
   * The default API client implementation.
   * @type {module:ApiClient}
   */
  exports.instance = new exports();

  return exports;
}));
