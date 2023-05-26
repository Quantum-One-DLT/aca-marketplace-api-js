# MarketplaceApi.ProviderDrugCoverageApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**coverageSearchGet**](ProviderDrugCoverageApi.md#coverageSearchGet) | **GET** /coverage/search | Search providers
[**coverageStatsGet**](ProviderDrugCoverageApi.md#coverageStatsGet) | **GET** /coverage/stats | Coverage statistics
[**drugsAutocompleteGet**](ProviderDrugCoverageApi.md#drugsAutocompleteGet) | **GET** /drugs/autocomplete | Autocomplete drugs by name
[**drugsCoveredGet**](ProviderDrugCoverageApi.md#drugsCoveredGet) | **GET** /drugs/covered | Get a list of whether drugs are covered by plans
[**drugsSearchGet**](ProviderDrugCoverageApi.md#drugsSearchGet) | **GET** /drugs/search | Search prescription drugs
[**providersAutocompleteGet**](ProviderDrugCoverageApi.md#providersAutocompleteGet) | **GET** /providers/autocomplete | Autocomplete nearby providers
[**providersCoveredGet**](ProviderDrugCoverageApi.md#providersCoveredGet) | **GET** /providers/covered | Get a list of whether a set of providers are covered by given plans
[**providersSearchGet**](ProviderDrugCoverageApi.md#providersSearchGet) | **GET** /providers/search | Search providers


<a name="coverageSearchGet"></a>
# **coverageSearchGet**
> InlineResponse20016 coverageSearchGet(apikeyq, zipcode)

Search providers

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var q = "hospital"; // String | search query

var zipcode = "19123"; // String | User's ZIP Code for searching nearby


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.coverageSearchGet(apikeyq, zipcode, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **q** | **String**| search query | 
 **zipcode** | **String**| User's ZIP Code for searching nearby | 

### Return type

[**InlineResponse20016**](InlineResponse20016.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="coverageStatsGet"></a>
# **coverageStatsGet**
> InlineResponse20015 coverageStatsGet(apikey)

Coverage statistics

Return statistics related to the number of coverage (drugs and providers) records.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.coverageStatsGet(apikey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 

### Return type

[**InlineResponse20015**](InlineResponse20015.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="drugsAutocompleteGet"></a>
# **drugsAutocompleteGet**
> InlineResponse2002 drugsAutocompleteGet(apikeyq, opts)

Autocomplete drugs by name

Search prescription drugs

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var q = "ibuprof"; // String | name of drug to search for (minimum 3 chars)

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
apiInstance.drugsAutocompleteGet(apikeyq, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **q** | **String**| name of drug to search for (minimum 3 chars) | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse2002**](InlineResponse2002.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="drugsCoveredGet"></a>
# **drugsCoveredGet**
> InlineResponse2004 drugsCoveredGet(apikeydrugs, planids, opts)

Get a list of whether drugs are covered by plans

Get a list of whether drugs are covered by plans

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var drugs = "1049589"; // String | array of drug RxCUIs

var planids = "11512NC0100031"; // String | array of plan IDs

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
apiInstance.drugsCoveredGet(apikeydrugs, planids, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **drugs** | **String**| array of drug RxCUIs | 
 **planids** | **String**| array of plan IDs | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse2004**](InlineResponse2004.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="drugsSearchGet"></a>
# **drugsSearchGet**
> InlineResponse2003 drugsSearchGet(apikeyq, opts)

Search prescription drugs

Search prescription drugs

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var q = "ibuprofen"; // String | name of drug to search for

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
apiInstance.drugsSearchGet(apikeyq, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **q** | **String**| name of drug to search for | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse2003**](InlineResponse2003.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="providersAutocompleteGet"></a>
# **providersAutocompleteGet**
> Object providersAutocompleteGet(apikeyq, zipcode, type)

Autocomplete nearby providers

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var q = "hospital"; // String | search query (minimum 3 characters)

var zipcode = "19123"; // String | 5-digit US zipcode

var type = "Facility"; // String | Provider type, comma separated to specify multiple


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.providersAutocompleteGet(apikeyq, zipcode, type, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **q** | **String**| search query (minimum 3 characters) | 
 **zipcode** | **String**| 5-digit US zipcode | 
 **type** | **String**| Provider type, comma separated to specify multiple | 

### Return type

**Object**

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="providersCoveredGet"></a>
# **providersCoveredGet**
> InlineResponse20018 providersCoveredGet(apikeyproviderids, planids, opts)

Get a list of whether a set of providers are covered by given plans

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var providerids = "1407884893"; // String | array of provider NPIs

var planids = "83761GA0040002"; // String | array of plan IDs

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
apiInstance.providersCoveredGet(apikeyproviderids, planids, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **providerids** | **String**| array of provider NPIs | 
 **planids** | **String**| array of plan IDs | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse20018**](InlineResponse20018.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="providersSearchGet"></a>
# **providersSearchGet**
> InlineResponse20017 providersSearchGet(apikeyq, zipcode, type, opts)

Search providers

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.ProviderDrugCoverageApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var q = "hospital"; // String | search query

var zipcode = "19123"; // String | User's ZIP Code for searching nearby

var type = "Facility"; // String | Provider type, comma separated to specify multiple

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
  'specialty': "specialty_example" // String | 
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.providersSearchGet(apikeyq, zipcode, type, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **q** | **String**| search query | 
 **zipcode** | **String**| User's ZIP Code for searching nearby | 
 **type** | **String**| Provider type, comma separated to specify multiple | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 
 **specialty** | **String**|  | [optional] 

### Return type

[**InlineResponse20017**](InlineResponse20017.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

