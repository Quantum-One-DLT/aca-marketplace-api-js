# MarketplaceApi.APIReferenceApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**marketYearsGet**](APIReferenceApi.md#marketYearsGet) | **GET** /market-years | 
[**versionsGet**](APIReferenceApi.md#versionsGet) | **GET** /versions | 


<a name="marketYearsGet"></a>
# **marketYearsGet**
> MarketYears marketYearsGet(apikey)



Get the current and supported market years

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.APIReferenceApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.marketYearsGet(apikey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 

### Return type

[**MarketYears**](MarketYears.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="versionsGet"></a>
# **versionsGet**
> [DataVersion] versionsGet(apikey)



Get the last updated date for various data sets

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.APIReferenceApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.versionsGet(apikey, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 

### Return type

[**[DataVersion]**](DataVersion.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

