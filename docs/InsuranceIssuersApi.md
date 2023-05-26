# MarketplaceApi.InsuranceIssuersApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**issuersGet**](InsuranceIssuersApi.md#issuersGet) | **GET** /issuers | List issuers
[**issuersIssuerIdGet**](InsuranceIssuersApi.md#issuersIssuerIdGet) | **GET** /issuers/{issuer_id} | Get issuer


<a name="issuersGet"></a>
# **issuersGet**
> InlineResponse2007 issuersGet(apikey, opts)

List issuers

List issuers  This API is paged. Ten results are returned for each query, and the total amount of results that match your query is available as the `total` attribute on the result. Use the `offset` parameter to get results beyond the first page.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsuranceIssuersApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var opts = { 
  'year': 2019, // Number | 4 digit market year (Defaults to the current year when not specified).
  'state': "VA", // String | 2-letter USPS state abbreviation
  'limit': 25, // Number | 
  'offset': 0 // Number | 
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.issuersGet(apikey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 
 **state** | **String**| 2-letter USPS state abbreviation | [optional] 
 **limit** | **Number**|  | [optional] [default to 25]
 **offset** | **Number**|  | [optional] [default to 0]

### Return type

[**InlineResponse2007**](InlineResponse2007.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="issuersIssuerIdGet"></a>
# **issuersIssuerIdGet**
> InlineResponse2008 issuersIssuerIdGet(apikeyissuerId, opts)

Get issuer

Get issuer

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.InsuranceIssuersApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var issuerId = "10191"; // String | 5-digit HIOS issuer ID

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
apiInstance.issuersIssuerIdGet(apikeyissuerId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **issuerId** | **String**| 5-digit HIOS issuer ID | 
 **year** | **Number**| 4 digit market year (Defaults to the current year when not specified). | [optional] 

### Return type

[**InlineResponse2008**](InlineResponse2008.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

