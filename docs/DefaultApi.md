# MarketplaceApi.DefaultApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**plansPlanIdPost**](DefaultApi.md#plansPlanIdPost) | **POST** /plans/{plan_id} | Get plan details with premiums for a household


<a name="plansPlanIdPost"></a>
# **plansPlanIdPost**
> InlineResponse20013 plansPlanIdPost(apikeyplanId, request)

Get plan details with premiums for a household

#### Note Use this JSON example in the **POST** Body in the request pane to view results:   ```   {       \"household\": {       \"income\": 52000,       \"people\": [         {             \"age\": 27,             \"aptc_eligible\": true,          \"gender\": \"Female\",           \"uses_tobacco\": false          }        ]       },       \"market\": \"Individual\",       \"place\": {          \"countyfips\": \"37057\",          \"state\": \"NC\",           \"zipcode\": \"27360\"       },       \"year\": 2019   }   ``` Get a plan's details, with premium and tax credit calculated. Including the `current_enrollment` property implies a CIC type enrollment is being performed. The `current_enrollment` object is used to provide their current plan id and the tobacco rating they had originally upon enrollment of that plan. This will be used as their tobacco status for the purposes of calculating the premium for their enrolled plan. All other plans will use the persons top level tobacco usage as a basis of rate calculations.

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.DefaultApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var planId = "11512NC0100031"; // String | 14-character HIOS plan ID

var request = new MarketplaceApi.Request1(); // Request1 | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.plansPlanIdPost(apikeyplanId, request, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **planId** | **String**| 14-character HIOS plan ID | 
 **request** | [**Request1**](Request1.md)|  | 

### Return type

[**InlineResponse20013**](InlineResponse20013.md)

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

