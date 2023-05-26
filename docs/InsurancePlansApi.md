# MarketplaceApi.InsurancePlansApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**crosswalkGet**](InsurancePlansApi.md#crosswalkGet) | **GET** /crosswalk | Crosswalk a previous year plan
[**plansPlanIdGet**](InsurancePlansApi.md#plansPlanIdGet) | **GET** /plans/{plan_id} | Get a plan
[**plansPlanIdQualityRatingsGet**](InsurancePlansApi.md#plansPlanIdQualityRatingsGet) | **GET** /plans/{plan_id}/quality-ratings | 
[**plansPost**](InsurancePlansApi.md#plansPost) | **POST** /plans | Get multiple plans
[**plansSearchPost**](InsurancePlansApi.md#plansSearchPost) | **POST** /plans/search | Search for insurance plans
[**plansSearchStatsPost**](InsurancePlansApi.md#plansSearchStatsPost) | **POST** /plans/search/stats | Retrieve stats on groups of insurance plans


<a name="crosswalkGet"></a>
# **crosswalkGet**
> InlineResponse2001 crosswalkGet(apikeyyear, planId, state, zipcode, fips)

Crosswalk a previous year plan

Crosswalk a previous year plan to the next year's plan

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsurancePlansApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var year = 2018; // Number | Previous year

var planId = "53882IL0040002"; // String | Previous year plan ID

var state = "IL"; // String | State abbreviation

var zipcode = "60647"; // String | ZIP Code

var fips = "17031"; // String | FIPS code


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.crosswalkGet(apikeyyear, planId, state, zipcode, fips, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **year** | **Number**| Previous year | 
 **planId** | **String**| Previous year plan ID | 
 **state** | **String**| State abbreviation | 
 **zipcode** | **String**| ZIP Code | 
 **fips** | **String**| FIPS code | 

### Return type

[**InlineResponse2001**](InlineResponse2001.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="plansPlanIdGet"></a>
# **plansPlanIdGet**
> InlineResponse20012 plansPlanIdGet(apikeyplanId, opts)

Get a plan

Get a plan's basic details, no premium or APTC calculated.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsurancePlansApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var planId = "11512NC0100031"; // String | 14-character HIOS plan ID

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.plansPlanIdGet(apikeyplanId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **planId** | **String**| 14-character HIOS plan ID | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse20012**](InlineResponse20012.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="plansPlanIdQualityRatingsGet"></a>
# **plansPlanIdQualityRatingsGet**
> InlineResponse20014 plansPlanIdQualityRatingsGet(apikeyyearplanId)



Quality ratings for a plan. If a rating value is missing or is 0, then the rating is considered 'Not Rated' and the corresponding reason value will indicate the reason for the non-rating.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsurancePlansApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var year = 2019; // Number | 4 digit market year.

var planId = "95185VA0530001"; // String | Plan ID


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.plansPlanIdQualityRatingsGet(apikeyyearplanId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **year** | **Number**| 4 digit market year. | 
 **planId** | **String**| Plan ID | 

### Return type

[**InlineResponse20014**](InlineResponse20014.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="plansPost"></a>
# **plansPost**
> InlineResponse2009 plansPost(apikeyrequest, opts)

Get multiple plans

#### Note Use this JSON example in the **POST** Body in the request pane to view results   ``` {   \"household\": {       \"income\": 20000,       \"people\": [       {           \"age\": 34,           \"is_pregnant\": false,           \"is_parent\": false,           \"uses_tobacco\": false,           \"gender\": \"Male\"       }       ],       \"has_married_couple\": false   },   \"place\": {       \"countyfips\": \"51107\",       \"state\": \"VA\",       \"zipcode\": \"20103\"   },   \"market\": \"Individual\",   \"plan_ids\": [       \"11512NC0100031\"   ],   \"year\": 2019,   \"aptc_override\": 100,   \"csr_override\": \"CSR73\",   \"catastrophic_override\": true }   ``` Get details on multiple plans, typically for plan comparison.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsurancePlansApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var request = new MarketplaceApi.Request(); // Request | 

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.plansPost(apikeyrequest, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **request** | [**Request**](Request.md)|  | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse2009**](InlineResponse2009.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="plansSearchPost"></a>
# **plansSearchPost**
> InlineResponse20010 plansSearchPost(apikeybody, opts)

Search for insurance plans

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ``` {       \"household\": {         \"income\": 42000,         \"people\": [           {             \"aptc_eligible\": true,             \"dob\": \"1992-01-01\",             \"has_mec\": false,             \"is_pregnant\": false,             \"is_parent\": false,             \"uses_tobacco\": false,             \"gender\": \"Male\",             \"utilization_level\": \"Low\"           }         ],         \"has_married_couple\": false       },       \"market\": \"Individual\",       \"place\": {         \"countyfips\": \"17031\",         \"state\": \"IL\",         \"zipcode\": \"60647\"       },       \"limit\": 10,       \"offset\": 0,       \"order\": \"asc\",       \"year\": 2020 }   ``` Search insurance plans. Each plan object has only the “top” expanded Benefit objects in benefits array (ER visit, generic RX, specialist visit, primary care visit, dental coverage) - to get other benefits, call the Plan Details API endpoint; for moops and deductibles, only the in-network and combined in-out of network tiers are available, other tiers are not currently supported.  This API is paged. Ten results are returned for each query, and the total amount of results that match your query is available as the `total` attribute on the result. Use the `offset` parameter to get results beyond the first page. Including the `current_enrollment` property implies a CIC type enrollment is being performed. The `current_enrollment` object is used to provide their current plan id and the tobacco rating they had originally upon enrollment of that plan. This will be used as their tobacco status for the purposes of calculating the premium for their enrolled plan. All other plans will use the persons top level tobacco usage as a basis of rate calculations.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsurancePlansApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var body = new MarketplaceApi.PlanSearchRequest(); // PlanSearchRequest | 

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.plansSearchPost(apikeybody, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **body** | [**PlanSearchRequest**](PlanSearchRequest.md)|  | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse20010**](InlineResponse20010.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="plansSearchStatsPost"></a>
# **plansSearchStatsPost**
> [InlineResponse20011] plansSearchStatsPost(apikeysearch, opts)

Retrieve stats on groups of insurance plans

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {       \"income\": 52000,       \"people\": [         {             \"dob\": \"1992-01-01\",             \"aptc_eligible\": true,          \"gender\": \"Female\",           \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",           \"zipcode\": \"27360\"       },       \"year\": 2019   }   ``` Retrieve stats (avg premium, oopc, etc) on a group of insurance plans. The input is identical to /plans/search, but the return value does not contain any actual plan data.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsurancePlansApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var search = new MarketplaceApi.PlanSearchRequest(); // PlanSearchRequest | 

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.plansSearchStatsPost(apikeysearch, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **search** | [**PlanSearchRequest**](PlanSearchRequest.md)|  | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**[InlineResponse20011]**](InlineResponse20011.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

