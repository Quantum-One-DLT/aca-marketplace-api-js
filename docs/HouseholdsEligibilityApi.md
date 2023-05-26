# MarketplaceApi.HouseholdsEligibilityApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**householdsEligibilityEstimatesPost**](HouseholdsEligibilityApi.md#householdsEligibilityEstimatesPost) | **POST** /households/eligibility/estimates | 
[**householdsIchraPost**](HouseholdsEligibilityApi.md#householdsIchraPost) | **POST** /households/ichra | Get affordability and premium of the lowest cost silver plan
[**householdsLcbpPost**](HouseholdsEligibilityApi.md#householdsLcbpPost) | **POST** /households/lcbp | Get lowest cost bronze plan for a household
[**householdsLcspPost**](HouseholdsEligibilityApi.md#householdsLcspPost) | **POST** /households/lcsp | Get lowest cost silver plan
[**householdsPcfplGet**](HouseholdsEligibilityApi.md#householdsPcfplGet) | **GET** /households/pcfpl | 
[**householdsSlcspPost**](HouseholdsEligibilityApi.md#householdsSlcspPost) | **POST** /households/slcsp | Get second lowest cost silver plan


<a name="householdsEligibilityEstimatesPost"></a>
# **householdsEligibilityEstimatesPost**
> InlineResponse2005 householdsEligibilityEstimatesPost(apikeyestimate, opts)



#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {       \"income\": 52000,       \"people\": [         {             \"dob\": \"1992-01-01\",             \"aptc_eligible\": true,          \"gender\": \"Female\",           \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",           \"zipcode\": \"27360\"       },       \"year\": 2019   }   ``` Create an eligibility estimate for a household. Index of each object in response array is index into Household.people array: i.e., that eligibility estimate is for that person

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.HouseholdsEligibilityApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var estimate = new MarketplaceApi.Estimate(); // Estimate | eligibility estimate request object

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
apiInstance.householdsEligibilityEstimatesPost(apikeyestimate, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **estimate** | [**Estimate**](Estimate.md)| eligibility estimate request object | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse2005**](InlineResponse2005.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="householdsIchraPost"></a>
# **householdsIchraPost**
> ICHRAResponse householdsIchraPost(apikeyichra, opts)

Get affordability and premium of the lowest cost silver plan

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {         \"income\": 52000,         \"people\": [         {             \"dob\": \"1992-01-01\",             \"aptc_eligible\": true,             \"gender\": \"Female\",             \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",          \"zipcode\": \"27360\"       },       \"hra\": 500,       \"year\": 2020   }   ``` Get the lowest cost silver plan for a household and ICHRA affordability. Response is determination of affordability and lowest cost silver plan premium set to the rate for the household. 

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.HouseholdsEligibilityApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var ichra = new MarketplaceApi.Ichra(); // Ichra | ichra request object

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
apiInstance.householdsIchraPost(apikeyichra, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **ichra** | [**Ichra**](Ichra.md)| ichra request object | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**ICHRAResponse**](ICHRAResponse.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="householdsLcbpPost"></a>
# **householdsLcbpPost**
> LowestCostPlanResponse householdsLcbpPost(apikeylcbp, opts)

Get lowest cost bronze plan for a household

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {         \"income\": 52000,         \"people\": [         {             \"dob\": \"1992-01-01\",             \"aptc_eligible\": true,             \"gender\": \"Female\",             \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",          \"zipcode\": \"27360\"       },       \"year\": 2020   }   ``` Get the lowest cost bronze plan for a household. Response is a plan object with the premium set to the rate for the household.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.HouseholdsEligibilityApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var lcbp = new MarketplaceApi.Lcbp(); // Lcbp | lcbp request object

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
apiInstance.householdsLcbpPost(apikeylcbp, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **lcbp** | [**Lcbp**](Lcbp.md)| lcbp request object | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**LowestCostPlanResponse**](LowestCostPlanResponse.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="householdsLcspPost"></a>
# **householdsLcspPost**
> LowestCostPlanResponse householdsLcspPost(apikeylcsp, opts)

Get lowest cost silver plan

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {         \"income\": 52000,         \"people\": [         {             \"dob\": \"1992-01-01\",             \"aptc_eligible\": true,             \"gender\": \"Female\",             \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",          \"zipcode\": \"27360\"       },       \"year\": 2020   }   ``` Get the lowest cost silver plan for a household. Response is a plan object with the premium set to the rate for the household.  Note -- when calculating the LCSP for a household that has members in different rating areas, the household must be split by rating area and multiple LCSP requests must be sent, with the results summed at the end (applies only to 2019 ratings).

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.HouseholdsEligibilityApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var lcsp = new MarketplaceApi.Lcsp(); // Lcsp | lcsp request object

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
apiInstance.householdsLcspPost(apikeylcsp, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **lcsp** | [**Lcsp**](Lcsp.md)| lcsp request object | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**LowestCostPlanResponse**](LowestCostPlanResponse.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="householdsPcfplGet"></a>
# **householdsPcfplGet**
> InlineResponse2006 householdsPcfplGet(apikeyyearstate, size, income)



Household income as a percentage of the federal poverty level

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.HouseholdsEligibilityApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var year = 2019; // Number | 4 digit market year.

var state = "VA"; // String | 2-letter USPS state abbreviation, uppercased.

var size = 5; // Number | Total size of household

var income = 40000; // Number | Household Income


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.householdsPcfplGet(apikeyyearstate, size, income, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **year** | **Number**| 4 digit market year. | 
 **state** | **String**| 2-letter USPS state abbreviation, uppercased. | 
 **size** | **Number**| Total size of household | 
 **income** | **Number**| Household Income | 

### Return type

[**InlineResponse2006**](InlineResponse2006.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="householdsSlcspPost"></a>
# **householdsSlcspPost**
> LowestCostPlanResponse householdsSlcspPost(apikeyslcsp, opts)

Get second lowest cost silver plan

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {         \"income\": 52000,         \"people\": [         {             \"dob\": \"1992-01-01\",             \"aptc_eligible\": true,             \"gender\": \"Female\",             \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",          \"zipcode\": \"27360\"       },       \"year\": 2020   }   ``` Get the second lowest cost silver plan for a household. Response is a plan object with the premium set to the rate for the household.  Note -- when calculating the SLCSP for a household that has members in different rating areas, the household must be split by rating area and multiple SLCSP requests must be sent, with the results summed at the end (applies only to 2019 ratings).

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.HouseholdsEligibilityApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var slcsp = new MarketplaceApi.Slcsp(); // Slcsp | slcsp request object

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
apiInstance.householdsSlcspPost(apikeyslcsp, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **slcsp** | [**Slcsp**](Slcsp.md)| slcsp request object | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**LowestCostPlanResponse**](LowestCostPlanResponse.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

