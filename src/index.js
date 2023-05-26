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

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/APTC', 'model/APTCAllocationResult', 'model/APTCEnrollee', 'model/APTCEnrollmentGroup', 'model/Address', 'model/ApplicationError400', 'model/ApplicationError404', 'model/Benefit', 'model/CSREligibilityEnum', 'model/CSRRequestEnum', 'model/CertificationStatus', 'model/CostSharing', 'model/CostSharingReductionEnum', 'model/County', 'model/Coverage', 'model/CurrentEnrollment', 'model/DataVersion', 'model/Deductible', 'model/DesignTypeEnum', 'model/DiseaseMgmtProgramsEnum', 'model/Drug', 'model/DrugCoverage', 'model/Eligibility', 'model/Enrollee', 'model/Enrollment', 'model/EnrollmentGroup', 'model/Estimate', 'model/ExtendedEnrollee', 'model/ExtendedEnrollment', 'model/ExtendedEnrollmentEnrollmentGroups', 'model/FamilyCostEnum', 'model/FlattenedEnrollmentGroup', 'model/GenderEnum', 'model/Guideline', 'model/HRA', 'model/Household', 'model/ICHRAResponse', 'model/Ichra', 'model/InlineResponse200', 'model/InlineResponse2001', 'model/InlineResponse20010', 'model/InlineResponse20010FacetGroups', 'model/InlineResponse20010Facets', 'model/InlineResponse20010Ranges', 'model/InlineResponse20011', 'model/InlineResponse20012', 'model/InlineResponse20013', 'model/InlineResponse20014', 'model/InlineResponse20015', 'model/InlineResponse20016', 'model/InlineResponse20017', 'model/InlineResponse20018', 'model/InlineResponse20019', 'model/InlineResponse2002', 'model/InlineResponse2003', 'model/InlineResponse2004', 'model/InlineResponse2005', 'model/InlineResponse2006', 'model/InlineResponse2007', 'model/InlineResponse2008', 'model/InlineResponse2009', 'model/InsuranceMarketEnum', 'model/Issuer', 'model/Lcbp', 'model/Lcsp', 'model/LowIncomeChild', 'model/LowestCostPlanHousehold', 'model/LowestCostPlanPerson', 'model/LowestCostPlanResponse', 'model/MOOP', 'model/MarketEnum', 'model/MarketYear', 'model/MarketYears', 'model/MarketplaceModelEnum', 'model/MetalDesignType', 'model/MetalLevelEnum', 'model/NPI', 'model/NearbyProvider', 'model/NetworkTierEnum', 'model/Person', 'model/Place', 'model/Plan', 'model/PlanID', 'model/PlanIDList', 'model/PlanNetworkAdequacy', 'model/PlanSbcs', 'model/PlanSbcsBaby', 'model/PlanSbcsDiabetes', 'model/PlanSbcsFracture', 'model/PlanSearchFilter', 'model/PlanSearchRequest', 'model/PlanTypeEnum', 'model/PlanssearchstatsPremiums', 'model/PlanssearchstatsQualityRatings', 'model/PovertyGuideline', 'model/ProductDivisionEnum', 'model/Provider', 'model/ProviderCoverage', 'model/ProviderGenderEnum', 'model/ProviderTypeEnum', 'model/QualityRating', 'model/Range', 'model/RateArea', 'model/Relationship', 'model/RelationshipEdge', 'model/Request', 'model/Request1', 'model/RxCUI', 'model/SBCScenario', 'model/Slcsp', 'model/State', 'model/StateMedicaid', 'model/SuppressionStatus', 'model/UtilizationEnum', 'model/ZIPCounty', 'api/APIReferenceApi', 'api/DefaultApi', 'api/EnrollmentsApi', 'api/GeographyApi', 'api/HouseholdsEligibilityApi', 'api/InsuranceIssuersApi', 'api/InsurancePlansApi', 'api/ProviderDrugCoverageApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/APTC'), require('./model/APTCAllocationResult'), require('./model/APTCEnrollee'), require('./model/APTCEnrollmentGroup'), require('./model/Address'), require('./model/ApplicationError400'), require('./model/ApplicationError404'), require('./model/Benefit'), require('./model/CSREligibilityEnum'), require('./model/CSRRequestEnum'), require('./model/CertificationStatus'), require('./model/CostSharing'), require('./model/CostSharingReductionEnum'), require('./model/County'), require('./model/Coverage'), require('./model/CurrentEnrollment'), require('./model/DataVersion'), require('./model/Deductible'), require('./model/DesignTypeEnum'), require('./model/DiseaseMgmtProgramsEnum'), require('./model/Drug'), require('./model/DrugCoverage'), require('./model/Eligibility'), require('./model/Enrollee'), require('./model/Enrollment'), require('./model/EnrollmentGroup'), require('./model/Estimate'), require('./model/ExtendedEnrollee'), require('./model/ExtendedEnrollment'), require('./model/ExtendedEnrollmentEnrollmentGroups'), require('./model/FamilyCostEnum'), require('./model/FlattenedEnrollmentGroup'), require('./model/GenderEnum'), require('./model/Guideline'), require('./model/HRA'), require('./model/Household'), require('./model/ICHRAResponse'), require('./model/Ichra'), require('./model/InlineResponse200'), require('./model/InlineResponse2001'), require('./model/InlineResponse20010'), require('./model/InlineResponse20010FacetGroups'), require('./model/InlineResponse20010Facets'), require('./model/InlineResponse20010Ranges'), require('./model/InlineResponse20011'), require('./model/InlineResponse20012'), require('./model/InlineResponse20013'), require('./model/InlineResponse20014'), require('./model/InlineResponse20015'), require('./model/InlineResponse20016'), require('./model/InlineResponse20017'), require('./model/InlineResponse20018'), require('./model/InlineResponse20019'), require('./model/InlineResponse2002'), require('./model/InlineResponse2003'), require('./model/InlineResponse2004'), require('./model/InlineResponse2005'), require('./model/InlineResponse2006'), require('./model/InlineResponse2007'), require('./model/InlineResponse2008'), require('./model/InlineResponse2009'), require('./model/InsuranceMarketEnum'), require('./model/Issuer'), require('./model/Lcbp'), require('./model/Lcsp'), require('./model/LowIncomeChild'), require('./model/LowestCostPlanHousehold'), require('./model/LowestCostPlanPerson'), require('./model/LowestCostPlanResponse'), require('./model/MOOP'), require('./model/MarketEnum'), require('./model/MarketYear'), require('./model/MarketYears'), require('./model/MarketplaceModelEnum'), require('./model/MetalDesignType'), require('./model/MetalLevelEnum'), require('./model/NPI'), require('./model/NearbyProvider'), require('./model/NetworkTierEnum'), require('./model/Person'), require('./model/Place'), require('./model/Plan'), require('./model/PlanID'), require('./model/PlanIDList'), require('./model/PlanNetworkAdequacy'), require('./model/PlanSbcs'), require('./model/PlanSbcsBaby'), require('./model/PlanSbcsDiabetes'), require('./model/PlanSbcsFracture'), require('./model/PlanSearchFilter'), require('./model/PlanSearchRequest'), require('./model/PlanTypeEnum'), require('./model/PlanssearchstatsPremiums'), require('./model/PlanssearchstatsQualityRatings'), require('./model/PovertyGuideline'), require('./model/ProductDivisionEnum'), require('./model/Provider'), require('./model/ProviderCoverage'), require('./model/ProviderGenderEnum'), require('./model/ProviderTypeEnum'), require('./model/QualityRating'), require('./model/Range'), require('./model/RateArea'), require('./model/Relationship'), require('./model/RelationshipEdge'), require('./model/Request'), require('./model/Request1'), require('./model/RxCUI'), require('./model/SBCScenario'), require('./model/Slcsp'), require('./model/State'), require('./model/StateMedicaid'), require('./model/SuppressionStatus'), require('./model/UtilizationEnum'), require('./model/ZIPCounty'), require('./api/APIReferenceApi'), require('./api/DefaultApi'), require('./api/EnrollmentsApi'), require('./api/GeographyApi'), require('./api/HouseholdsEligibilityApi'), require('./api/InsuranceIssuersApi'), require('./api/InsurancePlansApi'), require('./api/ProviderDrugCoverageApi'));
  }
}(function(ApiClient, APTC, APTCAllocationResult, APTCEnrollee, APTCEnrollmentGroup, Address, ApplicationError400, ApplicationError404, Benefit, CSREligibilityEnum, CSRRequestEnum, CertificationStatus, CostSharing, CostSharingReductionEnum, County, Coverage, CurrentEnrollment, DataVersion, Deductible, DesignTypeEnum, DiseaseMgmtProgramsEnum, Drug, DrugCoverage, Eligibility, Enrollee, Enrollment, EnrollmentGroup, Estimate, ExtendedEnrollee, ExtendedEnrollment, ExtendedEnrollmentEnrollmentGroups, FamilyCostEnum, FlattenedEnrollmentGroup, GenderEnum, Guideline, HRA, Household, ICHRAResponse, Ichra, InlineResponse200, InlineResponse2001, InlineResponse20010, InlineResponse20010FacetGroups, InlineResponse20010Facets, InlineResponse20010Ranges, InlineResponse20011, InlineResponse20012, InlineResponse20013, InlineResponse20014, InlineResponse20015, InlineResponse20016, InlineResponse20017, InlineResponse20018, InlineResponse20019, InlineResponse2002, InlineResponse2003, InlineResponse2004, InlineResponse2005, InlineResponse2006, InlineResponse2007, InlineResponse2008, InlineResponse2009, InsuranceMarketEnum, Issuer, Lcbp, Lcsp, LowIncomeChild, LowestCostPlanHousehold, LowestCostPlanPerson, LowestCostPlanResponse, MOOP, MarketEnum, MarketYear, MarketYears, MarketplaceModelEnum, MetalDesignType, MetalLevelEnum, NPI, NearbyProvider, NetworkTierEnum, Person, Place, Plan, PlanID, PlanIDList, PlanNetworkAdequacy, PlanSbcs, PlanSbcsBaby, PlanSbcsDiabetes, PlanSbcsFracture, PlanSearchFilter, PlanSearchRequest, PlanTypeEnum, PlanssearchstatsPremiums, PlanssearchstatsQualityRatings, PovertyGuideline, ProductDivisionEnum, Provider, ProviderCoverage, ProviderGenderEnum, ProviderTypeEnum, QualityRating, Range, RateArea, Relationship, RelationshipEdge, Request, Request1, RxCUI, SBCScenario, Slcsp, State, StateMedicaid, SuppressionStatus, UtilizationEnum, ZIPCounty, APIReferenceApi, DefaultApi, EnrollmentsApi, GeographyApi, HouseholdsEligibilityApi, InsuranceIssuersApi, InsurancePlansApi, ProviderDrugCoverageApi) {
  'use strict';

  /**
   * _AboutThe_Marketplace_API_delivers_data_that_helps_users_find_and_evaluate_health_care_insurance_plans_providers_and_coverage_information_on_the_marketplace__Its_used_by__HealthCare_gov_httpshealthcare_gov_and_other_third_party_services__Request_an_API_token__here_httpsdeveloper_cms_govmarketplace_apikey_request_html_or_learn_more_from__the_developer_site_httpsdeveloper_cms_govmarketplace_api__RetentionMarketplace_API_data_includes_at_minimum_the_last_three_years_of_data__LimitationsAPI_keys_are_rate_limited__This_rate_limit_is_passed_along_in_the_Header_information_provided__If_you_have_concerns_with_the_rate_limit_please_reach_out_to_the__Marketplace_API_team_mailtomarketplace_apicms_provider_directory_uservoice_com__QuickstartThis_section_will_cover_a_short_workflow_for_a_common_scenario__looking_up_insurance_plans_for_a_persons_household_with_premiums_and_estimated_tax_credits_obtaining_details_about_a_particular_plan_and_looking_up_the_drug_coverage_for_a_specific_plan__Other_endpoints___like_looking_up_doctors_and_providers_or_getting_recent_state_medicaid_information__are_covered_in_the_docs__Search_for_health_insurance_plansWe_begin_by_searching_for_the_health_insurance_plans_for_a_27_year_old_woman_living_in_North_Carolina_by_posting_a_single_person_household_to_the_plan_search_endpointapikeyd687412e7b53146b2631dc01974ad0a4__rate_limited_test_keycurl___request_POST_____url_httpsmarketplace_api_healthcare_govapiv1planssearchapikeyapikey_____header_content_type_applicationjson_____data_____household_______income_52000______people____________________age_27__________aptc_eligible_true__________gender_Female__________uses_tobacco_false______________________market_Individual____place_______countyfips_37057______state_NC______zipcode_27360________year_2019This_POST_request_returns_health_insurance_information_and_pricing_estimates_for_the_plans_for_which_she_can_sign_up__More_discussion_about_building_the_household_JSON_object_can_be_found_later_on_this_page__Dont_know_the_county__FIPS_httpsen_m_wikipedia_orgwikiFIPS_county_code_code_To_look_it_up_for_this_persons_zip_code_we_use_the_counties_by_zip_endpoint_apikeyd687412e7b53146b2631dc01974ad0a4zipcode27360curl_httpsmarketplace_api_healthcare_govapiv1countiesbyzipzipcodeapikeyapikeyThis_helps_gather_the_necessary_information_to_build_the_household_object_to_submit_to_the_API__Get_details_about_a_specific_health_insurance_planWith_a_plan_search_completed_lets_look_more_closely_at_a_particular_plan__For_example_Blue_Cross_Blue_Shield_of_North_Carolina_Blue_Value_Catastrophic_was_one_of_the_first_returned_from_the_example_above__We_will_use_it_as_an_example_to_drill_downapikeyd687412e7b53146b2631dc01974ad0a4planid11512NC0100031year2019curl_httpsmarketplace_api_healthcare_govapiv1plansplanidyearyearapikeyapikeyUsing_this_endpoint_will_provide_more_granular_information_about_the_particular_plan_for_a_searching_user_like_issuer_information_cost_sharing_deductibles_eligible_dependents_website_urls_quality_ratings_and_more__Standard_PlansSome_plans_are_considered_standard_plans__These_can_be_identified_in_the_results_of_a_plan_search_or_plan_details_endpoint___If_a_plan_has_a_design_type_that_is_one_of_the_following_it_is_considered_a_standard_plan_DESIGN1_DESIGN2_DESIGN3_DESIGN4_DESIGN5___If_a_plan_has_a_design_type_of_NOT_APPLICABLE_then_it_is_not_considered_a_standard_plan__Get_drug_coverage_information_about_a_health_insurance_planNow_that_we_have_a_plan_of_interest_lets_look_up_what_drugs_it_covers__We_want_to_know_if_ibuprofen_is_covered_under_the_insurance_plan__First_we_can_mimic_a_user_interaction_with_an_autocomplete_for_ibuprofen_for_a_typeahead_apikeyd687412e7b53146b2631dc01974ad0a4queryibuprofcurl_httpsmarketplace_api_healthcare_govapiv1drugsautocompleteqqueryapikeyapikeyAmong_other_things_this_provides_us_with_an_RxCUI_a_unique_identifier_for_a_clinical_drug__We_can_use_it_along_with_the_plan_id_to_query_the_API_for_whether_or_not_ibuprofen_is_covered_under_this_planapikeyd687412e7b53146b2631dc01974ad0a4drugs1049589planids11512NC0100031year2019curl_httpsmarketplace_api_healthcare_govapiv1drugscoveredyearyeardrugsdrugsplanidsplanidsapikeyapikeyThe_API_confirms_that_ibuprofen_is_covered__More_information_about_householdsThe_household_in_the_example_above_was_sufficient_to_query_Marketplace_API_but_there_are_more_optional_fields_that_can_provide_more_accurate_search_results_and_premium_estimates_or_can_be_used_by_application_developers_to_specify_scenarios__For_example_if_a_household_does_not_live_together_certain_plans_may_no_longer_be_eligible_to_them_We_begin_with_an_example_describing_what_some_of_the_less_intuitive_fields_means__Heres_the_JSON_of_a_fully_filled_in_household_using_all_possible_features__aptc_override_288_61__household_____effective_date_2019_05_01____has_married_couple_true____income_52000____unemployment_received_Adult____people________________age_27________dob_1992_01_01________aptc_eligible_true________does_not_cohabitate_false________gender_Female________has_mec_false________is_parent_false________is_pregnant_false________relationship_Self________uses_tobacco_false________utilization_Medium____________________age_25________dob_1994_03_03________aptc_eligible_true________does_not_cohabitate_false________gender_Male________has_mec_false________is_parent_false________is_pregnant_false________relationship_Spouse________uses_tobacco_false________utilization_Medium______________market_Individual__place_____countyfips_37057____state_NC____zipcode_27360____year_2019_APTC_OverrideThe_aptc_override_is_an_optional_override_to_specify_the_Advanced_Premium_Tax_Credit_for_a_user_if_the_exact_value_is_already_known__For_persons_in_the_household_aptc_eligible_denotes_if_the_person_is_eligible_for_the_Advanced_Premium_Tax_Credit__Unemployment_ReceivedAs_part_of_the_American_Rescue_Plan_if_the_household_has_received_unemployment_benefits_during_2021_the_household_income_must_be_capped_to_133_of_the_Federal_Poverty_Level_for_the_household_size_in_APTC_and_CSR_estimations___If_the_recipient_is_an_adult_tax_payer_both_ATPC_and_CSRs_will_be_affected___If_only_a_tax_dependent_received_unemployment_the_only_effect_will_be_to_CSR_eligibility_If_both_an_adult_and_dependent_have_received_unemployment_Adult_should_be_passed_so_that_the_maximum_APTC_and_CSRs_are_received_This_field_defaults_to_None_if_not_included_and_only_affects_the_2021_market_year__Effective_DateThis_is_the_date_a_plan_or_coverage_goes_into_effect_and_is_used_in_premium_calculations_and_determining_eligibility__If_omitted_the_value_defaults_to_the_effective_date_of_the_plan_which_is_generally_Jan_1_of_the_market_year__The_effective_date_is_required_to_correctly_calculate_the_number_of_months_since_an_individual_has_used_tobacco__The_number_of_months_is_the_difference_of_the_last_tobacco_use_date_until_the_effective_date__Considering_the_number_of_months_since_last_tobacco_use_can_impact_the_rate_charged_by_a_plan_this_field_is_required_to_be_included_for_a_more_accurate_search_result__Age_CalculationEither_an_age_or_dob_value_must_be_provided___If_age_is_provided_that_value_is_used_in_determining_eligibility_and_premiums__If_a_dob_is_provided_a_more_accurate_age_is_calculated_using_the_combination_of_dob_the_effective_date_and_plan_specific_rating_age_adjustments___If_both_fields_are_populated_age_takes_precedence_and_no_calculation_will_occur_Plan_rates_can_have_age_adjustments_affecting_what_premiums_get_returned___Additionally_effective_date_in_relation_to_age_affects_premium_calculation_and_eligibility___Therefore_determining_the_correct_age_is_important_for_accurate_results__Cohabitationdoes_not_cohabitate_indicates_whether_the_person_is_living_with_the_household__Minimal_Essential_Coverage__MEChas_mec_indicates_whether_a_person_has_MedicaidCHIP_and_may_possibly_not_be_included_in_the_household_for_premium_determination_and_insurance_eligibility__Relationshiprelationship__which_is_not_required_to_issue_a_request__is_the_relationship_of_a_household_member_to_the_person_applying_for_health_insurance__For_the_main_enrollee_the_Self_relationship_is_used_Each_plan_on_the_marketplace_defines_a_set_of_dependent_relationships_within_a_household_as_eligible_to_enroll_in_that_plan_If_it_is_known_by_the_caller_what_relationships_exist_within_a_household_when_making_a_request_to_Marketplace_API_the_API_can_more_accurately_determine_household_eligibility_for_plans___If_the_relationship_field_is_used_in_a_request_it_must_be_a_valid_relationship_for_the_provided_market_year__see_list_below_When_a_household_request_is_sent_without_relationships_present_in_the_household_Marketplace_API_will_make_as_accurate_an_eligibility_determinaton_as_possible_without_the_relationship_values_The_total_set_of_dependent_relationships_that_plans_may_use_to_restrict_eligibility_may_change_over_the_years__For_2020_and_2021_the_possible_relationship_types_that_plans_may_utilize_are_as_follows2020_______________________________2021______________________________________________________________Self_____________________________SelfBrother_or_Sister________________Brother_or_SisterChild____________________________ChildCollateral_Dependent_____________Collateral_DependentEx_Spouse________________________Ex_SpouseFoster_Child_____________________Foster_ChildGrandson_or_Granddaughter________Grandson_or_GranddaughterLife_Partner_____________________Life_PartnerNephew_or_Niece__________________Nephew_or_NieceOther_Relationship_______________Other_RelationshipOther_Relative___________________Other_RelativeSponsored_Dependent______________Sponsored_DependentSpouse___________________________SpouseStepson_or_Stepdaughter__________Stepson_or_StepdaughterWard_____________________________WardAdopted_Child___________________Annultant_______________________Brother_in_Law_or_Sister_in_Law_Court_Appointed_Guardian________Dependent_of_a_Minor_Dependent__Guardian________________________Son_in_Law_or_Daughter_in_Law___Stepparent______________________As_can_be_seen_from_this_list_the_list_of_potential_relationships_has_been_simplified_between_2020_and_2021__When_a_relationship_is_not_one_of_the_obvious_choices_in_this_list_the_fallback_values_of_Other_Relative_and_Other_Relationship_may_be_used__UtilizationFinally_utilization_is_one_of_Low_Medium_High_and_is_a_description_of_how_much_a_person_intends_to_use_their_health_insurance__Understanding_ErrorsThe_Marketplace_API_returns_standard_HTTP_status_codes_which_indicate_whether_a_specific_HTTP_request_has_successfully_completed__For_some_errors_additional_information_is_provided_in_the_response_body_including_an_application_error_code_and_a_brief_message__HTTP_Response_Status_CodesResponses_are_grouped_in_five_classes____Successful_responses__200299____Client_errors__400499____Server_errors__500599_Marketplace_API_Error_CodesThe_various_codes_are_listed_below1000___errInternalServerError______The_Internal_Server_Error_response_code_indicates_that_the_server_encountered_an_unexpected_condition_that_prevented_it_from_fulfilling_the_request_______Request__GET_apiv1drugssearchq_______Response_________________code_1000________________status_500________________message_Internal_server_error________________error_sql_Scan_called_without_calling_Next______________1001___errCountyNotFound______This_error_code_is_returned_by_the__County_Lookup_by_FIPS_referencegeographycounty_lookup_by_fipsget_endpoint_when_no_county_is_found_using_the__FIPS_provided_in_the_request__For_example______Request___GET_apiv1counties35094____Response____________________code_1001__________________status_404__________________message_county_not_found__________________error_sql_No_records_found________________1002___errStateNotFound______This_error_code_is_returned_by_the__Lookup_State_referencegeographylookup_stateget_endpoint_when_no_state_is_found_using_the_state_provided_in_the_request__For_example______Request___GET_apiv1statesNP____Response____________________code_1002__________________status_404__________________message_state_not_found__________________error_sql_No_records_found________________1003___errInvalidInput_______This_error_code_is_returned_by_various_endpoints_when_the_required_input_is_invalid__The_message_provided_in_the_response_will_assist_in_resolving_the_problem_before_re_sending_the_request__For_example______Request___GET_apiv1issuers1019____Response______________________code_1003____________________status_400____________________message_invalid_issuers_request____________________error_invalid_issuer_ID_format________________1004___errIssuerNotFound_______This_error_code_is_returned_by_the__Get_Issuer_referenceinsurance_issuersget_issuerget_issuer_endpoint_when_no_issuer_is_found_using_the_issuer_id_provided_in_the_request__For_example______Request___GET_apiv1issuers01922____Response____________________code_1004__________________status_404__________________message_issuer_not_found__________________error_sql_No_records_found________________1005___errCrosswalkNotFound_______This_error_code_is_returned_by_the__Crosswalk_a_previous_year_plan_referenceinsurance_plansplan_crosswalkcrosswalk_a_previous_year_plan_endpoint_when_no_crosswalk_is_found_using_the_parameters_provided_in_the_request__For_example______Request___GET_apiv1crosswalkyear2018plan_id53882IL0040002stateIN_______________zipcode60647fips17031____Response____________________code_1005__________________status_404__________________message_No_crosswalk_found_for_those_parameters__________________error_sql_No_records_found________________1006___errPlanNotFound_______This_error_code_is_returned_by_various_endpoints_when_no_plan_is_found_using_the_parameters_provided_in_the_request__For_example______Request___GET_apiv1plans11512NC0100035____Response____________________code_1006__________________status_404__________________message_Plan_not_found__________________error_sql_No_records_found________________1007___errTimeout_______This_error_code_is_returned_by_various_endpoints_when_the_request_timed_out__For_example______Request___various_endpoints____Response____________________code_1007__________________status_500__________________message_request_timed_out_try_again__________________error_db_query_timed_out________________1008___errStateMedicaidNotFound_______This_error_code_is_returned_by_the__State_Medicaid_Data_referencegeographystate_medicaid_dataget_endpoint_when_no_medicaid_is_found_using_the_parameters_provided_in_the_request__For_example______Request___GET_apiv1statesNVmedicaid____Response____________________code_1008__________________status_404__________________message_state_medicaid_not_found__________________error_year_out_of_range________________1009___errPovertyGuidelineNotFound_______This_error_code_is_returned_by_the__State_Poverty_Guidelines_referencegeographystate_poverty_guidelinesget_endpoint_when_no_U_S__federal_poverty_guidelines_is_found_using_the_parameters_provided_in_the_request__For_example______Request___GET_apiv1statesXXpoverty_guidelines____Response____________________code_1009__________________status_400__________________message_poverty_guideline_not_found__________________error_sql_No_records_found________________1010___errPercentageFPLNotFound_______This_error_code_is_returned_by_the__Poverty_Level_Percentage_referencehouseholds__eligibilitypoverty_level_percentageget_endpoint_when_no_percentage_of_federal_poverty_level_is_found_using_the_parameters_provided_in_the_request__For_example______Request___GET_apiv1householdspcfplyear2021stateNVsize2income14000____Response____________________code_1010__________________status_404__________________message_percentage_of_federal_poverty_level_not_found__________________error_guideline_not_found_for_state_NV_year_2021________________1011___errQualityRatingNotFound_______This_error_code_is_returned_by_the__Quality_Ratings_referenceinsurance_plansquality_ratingsget_endpoint_when_there_are_no_quality_ratings_for_a_plan__For_example______Request___GET_apiv1plansXXXXXXXXXXXquality_ratingsyear2021____Response____________________code_1011__________________status_404__________________message_No_quality_rating_found_for_those_parameters__________________error_sql_No_records_found________________1012___errCoverageUnavailable_______This_error_code_is_returned_by_various_endpoints_when_the_coverage_data_is_temporarily_unavailable__For_example______Request___various_endpoints____Response____________________code_1012__________________status_503__________________message_coverage_data_temporarily_unavailable__________________error_coverage_database_unavailable________________1013___errProviderNotFound_______This_error_code_is_returned_by_various_Provider_related_endpoints_when_the_provider_is_not_found__For_example______Request___various_endpoints____Response____________________code_1013__________________status_404__________________message_provider_not_found__________________error_sql_No_records_found________________1014___errDrugNotFound_______This_error_code_is_returned_by_various_Drug_related_endpoints_when_the_drug_is_not_found__For_example______Request___various_endpoints____Response____________________code_1014__________________status_404__________________message_drug_not_found__________________error_sql_No_records_found________________1015___errMissingMedicaidCHIPEligibility_______This_error_code_is_returned_when_no_Medicaid_CHIP_Eligibility_plans_are_found_using_the_parameters_provided_in_the_request_______Request___POST_apiv1householdseligibilityestimates____Response____________________code_1015__________________status_404__________________message_missing_medicaid_eligibility_data__________________error_missing_eligibility_for_fiscal_year_YYYY_quarter_Q_state_SS________________1016___errTooFewPlans_______This_error_code_is_returned_when_there_are_not_enough_plans_in_a_given_service_area_to_compute_a_second_lowest_cost_silver_plan_for_an_example_the_errTooFewPlans_code_may_be_returned_______Request___POST_apiv1householdseligibilityestimates____Response____________________code_1016__________________status_404__________________message_not_enough_plans_to_calculate_SLCSPLCBP__________________error_not_enough_plans_to_calculate_SLCSPLCBP________________1017___errRateAreaNotFound_______This_error_code_is_returned_by_various_Drug_related_endpoints_when_the_rate_area_is_not_found__For_example______Request___GET_apiv1rate_areasstateINzipcode60647fips17031____Response____________________code_1017__________________status_404__________________message_rate_area_not_found__________________error_No_rate_area_could_be_determined_________________Marketplace_API_Common_Error_Codes400_Bad_Request___Client_supplied_invalid_or_incorrect_values_to_the_requested_end_point404_Not_Found___End_point_could_not_find_the_requested_object_s_Marketplace_API_Uncommon_Error_Codes500_Internal_Server_Error___An_unexpected_error_occurred503_Service_Unavailable___The_requested_service_is_temporarily_unavailable_try_again_later_.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var MarketplaceApi = require('index'); // See note below*.
   * var xxxSvc = new MarketplaceApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new MarketplaceApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new MarketplaceApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new MarketplaceApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version 1
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The APTC model constructor.
     * @property {module:model/APTC}
     */
    APTC: APTC,
    /**
     * The APTCAllocationResult model constructor.
     * @property {module:model/APTCAllocationResult}
     */
    APTCAllocationResult: APTCAllocationResult,
    /**
     * The APTCEnrollee model constructor.
     * @property {module:model/APTCEnrollee}
     */
    APTCEnrollee: APTCEnrollee,
    /**
     * The APTCEnrollmentGroup model constructor.
     * @property {module:model/APTCEnrollmentGroup}
     */
    APTCEnrollmentGroup: APTCEnrollmentGroup,
    /**
     * The Address model constructor.
     * @property {module:model/Address}
     */
    Address: Address,
    /**
     * The ApplicationError400 model constructor.
     * @property {module:model/ApplicationError400}
     */
    ApplicationError400: ApplicationError400,
    /**
     * The ApplicationError404 model constructor.
     * @property {module:model/ApplicationError404}
     */
    ApplicationError404: ApplicationError404,
    /**
     * The Benefit model constructor.
     * @property {module:model/Benefit}
     */
    Benefit: Benefit,
    /**
     * The CSREligibilityEnum model constructor.
     * @property {module:model/CSREligibilityEnum}
     */
    CSREligibilityEnum: CSREligibilityEnum,
    /**
     * The CSRRequestEnum model constructor.
     * @property {module:model/CSRRequestEnum}
     */
    CSRRequestEnum: CSRRequestEnum,
    /**
     * The CertificationStatus model constructor.
     * @property {module:model/CertificationStatus}
     */
    CertificationStatus: CertificationStatus,
    /**
     * The CostSharing model constructor.
     * @property {module:model/CostSharing}
     */
    CostSharing: CostSharing,
    /**
     * The CostSharingReductionEnum model constructor.
     * @property {module:model/CostSharingReductionEnum}
     */
    CostSharingReductionEnum: CostSharingReductionEnum,
    /**
     * The County model constructor.
     * @property {module:model/County}
     */
    County: County,
    /**
     * The Coverage model constructor.
     * @property {module:model/Coverage}
     */
    Coverage: Coverage,
    /**
     * The CurrentEnrollment model constructor.
     * @property {module:model/CurrentEnrollment}
     */
    CurrentEnrollment: CurrentEnrollment,
    /**
     * The DataVersion model constructor.
     * @property {module:model/DataVersion}
     */
    DataVersion: DataVersion,
    /**
     * The Deductible model constructor.
     * @property {module:model/Deductible}
     */
    Deductible: Deductible,
    /**
     * The DesignTypeEnum model constructor.
     * @property {module:model/DesignTypeEnum}
     */
    DesignTypeEnum: DesignTypeEnum,
    /**
     * The DiseaseMgmtProgramsEnum model constructor.
     * @property {module:model/DiseaseMgmtProgramsEnum}
     */
    DiseaseMgmtProgramsEnum: DiseaseMgmtProgramsEnum,
    /**
     * The Drug model constructor.
     * @property {module:model/Drug}
     */
    Drug: Drug,
    /**
     * The DrugCoverage model constructor.
     * @property {module:model/DrugCoverage}
     */
    DrugCoverage: DrugCoverage,
    /**
     * The Eligibility model constructor.
     * @property {module:model/Eligibility}
     */
    Eligibility: Eligibility,
    /**
     * The Enrollee model constructor.
     * @property {module:model/Enrollee}
     */
    Enrollee: Enrollee,
    /**
     * The Enrollment model constructor.
     * @property {module:model/Enrollment}
     */
    Enrollment: Enrollment,
    /**
     * The EnrollmentGroup model constructor.
     * @property {module:model/EnrollmentGroup}
     */
    EnrollmentGroup: EnrollmentGroup,
    /**
     * The Estimate model constructor.
     * @property {module:model/Estimate}
     */
    Estimate: Estimate,
    /**
     * The ExtendedEnrollee model constructor.
     * @property {module:model/ExtendedEnrollee}
     */
    ExtendedEnrollee: ExtendedEnrollee,
    /**
     * The ExtendedEnrollment model constructor.
     * @property {module:model/ExtendedEnrollment}
     */
    ExtendedEnrollment: ExtendedEnrollment,
    /**
     * The ExtendedEnrollmentEnrollmentGroups model constructor.
     * @property {module:model/ExtendedEnrollmentEnrollmentGroups}
     */
    ExtendedEnrollmentEnrollmentGroups: ExtendedEnrollmentEnrollmentGroups,
    /**
     * The FamilyCostEnum model constructor.
     * @property {module:model/FamilyCostEnum}
     */
    FamilyCostEnum: FamilyCostEnum,
    /**
     * The FlattenedEnrollmentGroup model constructor.
     * @property {module:model/FlattenedEnrollmentGroup}
     */
    FlattenedEnrollmentGroup: FlattenedEnrollmentGroup,
    /**
     * The GenderEnum model constructor.
     * @property {module:model/GenderEnum}
     */
    GenderEnum: GenderEnum,
    /**
     * The Guideline model constructor.
     * @property {module:model/Guideline}
     */
    Guideline: Guideline,
    /**
     * The HRA model constructor.
     * @property {module:model/HRA}
     */
    HRA: HRA,
    /**
     * The Household model constructor.
     * @property {module:model/Household}
     */
    Household: Household,
    /**
     * The ICHRAResponse model constructor.
     * @property {module:model/ICHRAResponse}
     */
    ICHRAResponse: ICHRAResponse,
    /**
     * The Ichra model constructor.
     * @property {module:model/Ichra}
     */
    Ichra: Ichra,
    /**
     * The InlineResponse200 model constructor.
     * @property {module:model/InlineResponse200}
     */
    InlineResponse200: InlineResponse200,
    /**
     * The InlineResponse2001 model constructor.
     * @property {module:model/InlineResponse2001}
     */
    InlineResponse2001: InlineResponse2001,
    /**
     * The InlineResponse20010 model constructor.
     * @property {module:model/InlineResponse20010}
     */
    InlineResponse20010: InlineResponse20010,
    /**
     * The InlineResponse20010FacetGroups model constructor.
     * @property {module:model/InlineResponse20010FacetGroups}
     */
    InlineResponse20010FacetGroups: InlineResponse20010FacetGroups,
    /**
     * The InlineResponse20010Facets model constructor.
     * @property {module:model/InlineResponse20010Facets}
     */
    InlineResponse20010Facets: InlineResponse20010Facets,
    /**
     * The InlineResponse20010Ranges model constructor.
     * @property {module:model/InlineResponse20010Ranges}
     */
    InlineResponse20010Ranges: InlineResponse20010Ranges,
    /**
     * The InlineResponse20011 model constructor.
     * @property {module:model/InlineResponse20011}
     */
    InlineResponse20011: InlineResponse20011,
    /**
     * The InlineResponse20012 model constructor.
     * @property {module:model/InlineResponse20012}
     */
    InlineResponse20012: InlineResponse20012,
    /**
     * The InlineResponse20013 model constructor.
     * @property {module:model/InlineResponse20013}
     */
    InlineResponse20013: InlineResponse20013,
    /**
     * The InlineResponse20014 model constructor.
     * @property {module:model/InlineResponse20014}
     */
    InlineResponse20014: InlineResponse20014,
    /**
     * The InlineResponse20015 model constructor.
     * @property {module:model/InlineResponse20015}
     */
    InlineResponse20015: InlineResponse20015,
    /**
     * The InlineResponse20016 model constructor.
     * @property {module:model/InlineResponse20016}
     */
    InlineResponse20016: InlineResponse20016,
    /**
     * The InlineResponse20017 model constructor.
     * @property {module:model/InlineResponse20017}
     */
    InlineResponse20017: InlineResponse20017,
    /**
     * The InlineResponse20018 model constructor.
     * @property {module:model/InlineResponse20018}
     */
    InlineResponse20018: InlineResponse20018,
    /**
     * The InlineResponse20019 model constructor.
     * @property {module:model/InlineResponse20019}
     */
    InlineResponse20019: InlineResponse20019,
    /**
     * The InlineResponse2002 model constructor.
     * @property {module:model/InlineResponse2002}
     */
    InlineResponse2002: InlineResponse2002,
    /**
     * The InlineResponse2003 model constructor.
     * @property {module:model/InlineResponse2003}
     */
    InlineResponse2003: InlineResponse2003,
    /**
     * The InlineResponse2004 model constructor.
     * @property {module:model/InlineResponse2004}
     */
    InlineResponse2004: InlineResponse2004,
    /**
     * The InlineResponse2005 model constructor.
     * @property {module:model/InlineResponse2005}
     */
    InlineResponse2005: InlineResponse2005,
    /**
     * The InlineResponse2006 model constructor.
     * @property {module:model/InlineResponse2006}
     */
    InlineResponse2006: InlineResponse2006,
    /**
     * The InlineResponse2007 model constructor.
     * @property {module:model/InlineResponse2007}
     */
    InlineResponse2007: InlineResponse2007,
    /**
     * The InlineResponse2008 model constructor.
     * @property {module:model/InlineResponse2008}
     */
    InlineResponse2008: InlineResponse2008,
    /**
     * The InlineResponse2009 model constructor.
     * @property {module:model/InlineResponse2009}
     */
    InlineResponse2009: InlineResponse2009,
    /**
     * The InsuranceMarketEnum model constructor.
     * @property {module:model/InsuranceMarketEnum}
     */
    InsuranceMarketEnum: InsuranceMarketEnum,
    /**
     * The Issuer model constructor.
     * @property {module:model/Issuer}
     */
    Issuer: Issuer,
    /**
     * The Lcbp model constructor.
     * @property {module:model/Lcbp}
     */
    Lcbp: Lcbp,
    /**
     * The Lcsp model constructor.
     * @property {module:model/Lcsp}
     */
    Lcsp: Lcsp,
    /**
     * The LowIncomeChild model constructor.
     * @property {module:model/LowIncomeChild}
     */
    LowIncomeChild: LowIncomeChild,
    /**
     * The LowestCostPlanHousehold model constructor.
     * @property {module:model/LowestCostPlanHousehold}
     */
    LowestCostPlanHousehold: LowestCostPlanHousehold,
    /**
     * The LowestCostPlanPerson model constructor.
     * @property {module:model/LowestCostPlanPerson}
     */
    LowestCostPlanPerson: LowestCostPlanPerson,
    /**
     * The LowestCostPlanResponse model constructor.
     * @property {module:model/LowestCostPlanResponse}
     */
    LowestCostPlanResponse: LowestCostPlanResponse,
    /**
     * The MOOP model constructor.
     * @property {module:model/MOOP}
     */
    MOOP: MOOP,
    /**
     * The MarketEnum model constructor.
     * @property {module:model/MarketEnum}
     */
    MarketEnum: MarketEnum,
    /**
     * The MarketYear model constructor.
     * @property {module:model/MarketYear}
     */
    MarketYear: MarketYear,
    /**
     * The MarketYears model constructor.
     * @property {module:model/MarketYears}
     */
    MarketYears: MarketYears,
    /**
     * The MarketplaceModelEnum model constructor.
     * @property {module:model/MarketplaceModelEnum}
     */
    MarketplaceModelEnum: MarketplaceModelEnum,
    /**
     * The MetalDesignType model constructor.
     * @property {module:model/MetalDesignType}
     */
    MetalDesignType: MetalDesignType,
    /**
     * The MetalLevelEnum model constructor.
     * @property {module:model/MetalLevelEnum}
     */
    MetalLevelEnum: MetalLevelEnum,
    /**
     * The NPI model constructor.
     * @property {module:model/NPI}
     */
    NPI: NPI,
    /**
     * The NearbyProvider model constructor.
     * @property {module:model/NearbyProvider}
     */
    NearbyProvider: NearbyProvider,
    /**
     * The NetworkTierEnum model constructor.
     * @property {module:model/NetworkTierEnum}
     */
    NetworkTierEnum: NetworkTierEnum,
    /**
     * The Person model constructor.
     * @property {module:model/Person}
     */
    Person: Person,
    /**
     * The Place model constructor.
     * @property {module:model/Place}
     */
    Place: Place,
    /**
     * The Plan model constructor.
     * @property {module:model/Plan}
     */
    Plan: Plan,
    /**
     * The PlanID model constructor.
     * @property {module:model/PlanID}
     */
    PlanID: PlanID,
    /**
     * The PlanIDList model constructor.
     * @property {module:model/PlanIDList}
     */
    PlanIDList: PlanIDList,
    /**
     * The PlanNetworkAdequacy model constructor.
     * @property {module:model/PlanNetworkAdequacy}
     */
    PlanNetworkAdequacy: PlanNetworkAdequacy,
    /**
     * The PlanSbcs model constructor.
     * @property {module:model/PlanSbcs}
     */
    PlanSbcs: PlanSbcs,
    /**
     * The PlanSbcsBaby model constructor.
     * @property {module:model/PlanSbcsBaby}
     */
    PlanSbcsBaby: PlanSbcsBaby,
    /**
     * The PlanSbcsDiabetes model constructor.
     * @property {module:model/PlanSbcsDiabetes}
     */
    PlanSbcsDiabetes: PlanSbcsDiabetes,
    /**
     * The PlanSbcsFracture model constructor.
     * @property {module:model/PlanSbcsFracture}
     */
    PlanSbcsFracture: PlanSbcsFracture,
    /**
     * The PlanSearchFilter model constructor.
     * @property {module:model/PlanSearchFilter}
     */
    PlanSearchFilter: PlanSearchFilter,
    /**
     * The PlanSearchRequest model constructor.
     * @property {module:model/PlanSearchRequest}
     */
    PlanSearchRequest: PlanSearchRequest,
    /**
     * The PlanTypeEnum model constructor.
     * @property {module:model/PlanTypeEnum}
     */
    PlanTypeEnum: PlanTypeEnum,
    /**
     * The PlanssearchstatsPremiums model constructor.
     * @property {module:model/PlanssearchstatsPremiums}
     */
    PlanssearchstatsPremiums: PlanssearchstatsPremiums,
    /**
     * The PlanssearchstatsQualityRatings model constructor.
     * @property {module:model/PlanssearchstatsQualityRatings}
     */
    PlanssearchstatsQualityRatings: PlanssearchstatsQualityRatings,
    /**
     * The PovertyGuideline model constructor.
     * @property {module:model/PovertyGuideline}
     */
    PovertyGuideline: PovertyGuideline,
    /**
     * The ProductDivisionEnum model constructor.
     * @property {module:model/ProductDivisionEnum}
     */
    ProductDivisionEnum: ProductDivisionEnum,
    /**
     * The Provider model constructor.
     * @property {module:model/Provider}
     */
    Provider: Provider,
    /**
     * The ProviderCoverage model constructor.
     * @property {module:model/ProviderCoverage}
     */
    ProviderCoverage: ProviderCoverage,
    /**
     * The ProviderGenderEnum model constructor.
     * @property {module:model/ProviderGenderEnum}
     */
    ProviderGenderEnum: ProviderGenderEnum,
    /**
     * The ProviderTypeEnum model constructor.
     * @property {module:model/ProviderTypeEnum}
     */
    ProviderTypeEnum: ProviderTypeEnum,
    /**
     * The QualityRating model constructor.
     * @property {module:model/QualityRating}
     */
    QualityRating: QualityRating,
    /**
     * The Range model constructor.
     * @property {module:model/Range}
     */
    Range: Range,
    /**
     * The RateArea model constructor.
     * @property {module:model/RateArea}
     */
    RateArea: RateArea,
    /**
     * The Relationship model constructor.
     * @property {module:model/Relationship}
     */
    Relationship: Relationship,
    /**
     * The RelationshipEdge model constructor.
     * @property {module:model/RelationshipEdge}
     */
    RelationshipEdge: RelationshipEdge,
    /**
     * The Request model constructor.
     * @property {module:model/Request}
     */
    Request: Request,
    /**
     * The Request1 model constructor.
     * @property {module:model/Request1}
     */
    Request1: Request1,
    /**
     * The RxCUI model constructor.
     * @property {module:model/RxCUI}
     */
    RxCUI: RxCUI,
    /**
     * The SBCScenario model constructor.
     * @property {module:model/SBCScenario}
     */
    SBCScenario: SBCScenario,
    /**
     * The Slcsp model constructor.
     * @property {module:model/Slcsp}
     */
    Slcsp: Slcsp,
    /**
     * The State model constructor.
     * @property {module:model/State}
     */
    State: State,
    /**
     * The StateMedicaid model constructor.
     * @property {module:model/StateMedicaid}
     */
    StateMedicaid: StateMedicaid,
    /**
     * The SuppressionStatus model constructor.
     * @property {module:model/SuppressionStatus}
     */
    SuppressionStatus: SuppressionStatus,
    /**
     * The UtilizationEnum model constructor.
     * @property {module:model/UtilizationEnum}
     */
    UtilizationEnum: UtilizationEnum,
    /**
     * The ZIPCounty model constructor.
     * @property {module:model/ZIPCounty}
     */
    ZIPCounty: ZIPCounty,
    /**
     * The APIReferenceApi service constructor.
     * @property {module:api/APIReferenceApi}
     */
    APIReferenceApi: APIReferenceApi,
    /**
     * The DefaultApi service constructor.
     * @property {module:api/DefaultApi}
     */
    DefaultApi: DefaultApi,
    /**
     * The EnrollmentsApi service constructor.
     * @property {module:api/EnrollmentsApi}
     */
    EnrollmentsApi: EnrollmentsApi,
    /**
     * The GeographyApi service constructor.
     * @property {module:api/GeographyApi}
     */
    GeographyApi: GeographyApi,
    /**
     * The HouseholdsEligibilityApi service constructor.
     * @property {module:api/HouseholdsEligibilityApi}
     */
    HouseholdsEligibilityApi: HouseholdsEligibilityApi,
    /**
     * The InsuranceIssuersApi service constructor.
     * @property {module:api/InsuranceIssuersApi}
     */
    InsuranceIssuersApi: InsuranceIssuersApi,
    /**
     * The InsurancePlansApi service constructor.
     * @property {module:api/InsurancePlansApi}
     */
    InsurancePlansApi: InsurancePlansApi,
    /**
     * The ProviderDrugCoverageApi service constructor.
     * @property {module:api/ProviderDrugCoverageApi}
     */
    ProviderDrugCoverageApi: ProviderDrugCoverageApi
  };

  return exports;
}));
