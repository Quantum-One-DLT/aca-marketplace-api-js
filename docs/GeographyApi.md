# MarketplaceApi.GeographyApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**countiesByZipZipcodeGet**](GeographyApi.md#countiesByZipZipcodeGet) | **GET** /counties/by/zip/{zipcode} | 
[**countiesFipsGet**](GeographyApi.md#countiesFipsGet) | **GET** /counties/{fips} | 
[**rateAreasGet**](GeographyApi.md#rateAreasGet) | **GET** /rate-areas | 
[**statesAbbrevGet**](GeographyApi.md#statesAbbrevGet) | **GET** /states/{abbrev} | 
[**statesAbbrevMedicaidGet**](GeographyApi.md#statesAbbrevMedicaidGet) | **GET** /states/{abbrev}/medicaid | 
[**statesAbbrevPovertyGuidelinesGet**](GeographyApi.md#statesAbbrevPovertyGuidelinesGet) | **GET** /states/{abbrev}/poverty-guidelines | 
[**statesGet**](GeographyApi.md#statesGet) | **GET** /states | 


<a name="countiesByZipZipcodeGet"></a>
# **countiesByZipZipcodeGet**
> InlineResponse200 countiesByZipZipcodeGet(apikeyzipcode, opts)



Find counties matching ZIP Code (5 digits or prefix thereof). This method is suitable for use in typeahead UI completions.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var zipcode = "19123"; // String | 5 digit ZIP Code or 1-4 digit prefix of a ZIP Code

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
apiInstance.countiesByZipZipcodeGet(apikeyzipcode, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **zipcode** | **String**| 5 digit ZIP Code or 1-4 digit prefix of a ZIP Code | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="countiesFipsGet"></a>
# **countiesFipsGet**
> County countiesFipsGet(apikeyfips, opts)



Get information about a county by its FIPS code.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var fips = "37057"; // String | 5-digit county FIPS code

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
apiInstance.countiesFipsGet(apikeyfips, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **fips** | **String**| 5-digit county FIPS code | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**County**](County.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="rateAreasGet"></a>
# **rateAreasGet**
> RateArea rateAreasGet(apikeystate, fips, zipcode, year, opts)



Get market year rate area for a given zip/fips/state.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var state = "state_example"; // String | 2-letter USPS state abbreviation

var fips = 8.14; // Number | 5-digit county FIPS code

var zipcode = 8.14; // Number | 5-digit ZIP Code

var year = 2019; // Number | 4 digit market year.

var opts = { 
  'market': "Individual" // String | Insurance market
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.rateAreasGet(apikeystate, fips, zipcode, year, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **state** | **String**| 2-letter USPS state abbreviation | 
 **fips** | **Number**| 5-digit county FIPS code | 
 **zipcode** | **Number**| 5-digit ZIP Code | 
 **year** | **Number**| 4 digit market year. | 
 **market** | **String**| Insurance market | [optional] [default to Individual]

### Return type

[**RateArea**](RateArea.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="statesAbbrevGet"></a>
# **statesAbbrevGet**
> State statesAbbrevGet(apikeyabbrev, opts)



Get a U.S. state from its 2-letter USPS abbreviation.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var abbrev = "NV"; // String | 2-letter USPS state abbreviation, uppercased.

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
apiInstance.statesAbbrevGet(apikeyabbrev, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **abbrev** | **String**| 2-letter USPS state abbreviation, uppercased. | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**State**](State.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="statesAbbrevMedicaidGet"></a>
# **statesAbbrevMedicaidGet**
> StateMedicaid statesAbbrevMedicaidGet(apikeyabbrev, opts)



Get Medicaid data for a U.S. state for a specific fiscal year.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var abbrev = "NV"; // String | 2-letter USPS state abbreviation, uppercased.

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
  'quarter': "2" // String | 1-4 A specific fiscal quarter. When not specified it defaults to the most current data for the specified year
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.statesAbbrevMedicaidGet(apikeyabbrev, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **abbrev** | **String**| 2-letter USPS state abbreviation, uppercased. | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 
 **quarter** | **String**| 1-4 A specific fiscal quarter. When not specified it defaults to the most current data for the specified year | [optional] 

### Return type

[**StateMedicaid**](StateMedicaid.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="statesAbbrevPovertyGuidelinesGet"></a>
# **statesAbbrevPovertyGuidelinesGet**
> PovertyGuideline statesAbbrevPovertyGuidelinesGet(apikeyabbrev, year)



Get U.S. federal poverty guidelines for the provided state.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var abbrev = "NV"; // String | 2-letter USPS state abbreviation, uppercased.

var year = 2019; // Number | 4 digit market year.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.statesAbbrevPovertyGuidelinesGet(apikeyabbrev, year, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **abbrev** | **String**| 2-letter USPS state abbreviation, uppercased. | 
 **year** | **Number**| 4 digit market year. | 

### Return type

[**PovertyGuideline**](PovertyGuideline.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="statesGet"></a>
# **statesGet**
> InlineResponse20019 statesGet(apikey, opts)



List all U.S. states.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.GeographyApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

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
apiInstance.statesGet(apikey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse20019**](InlineResponse20019.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

