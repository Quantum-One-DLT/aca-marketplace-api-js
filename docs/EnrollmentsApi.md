# MarketplaceApi.EnrollmentsApi

All URIs are relative to *https://marketplace.api.healthcare.gov/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**enrollmentValidatePost**](EnrollmentsApi.md#enrollmentValidatePost) | **POST** /enrollment/validate | 


<a name="enrollmentValidatePost"></a>
# **enrollmentValidatePost**
> Object enrollmentValidatePost(apikey, opts)



Verify extended enrollment groups. The endpoint assumes an effective date of Jan 1 on enrollees ages unless effective_age is provided on the enrollees.  If `is_custom` is true, the endpoint will validate that each group has available plans for enrollment, otherwise it will only verify that there are no address, hardship, or CSR conflicts. ### Note Use this JSON example in the **POST** Body in the request pane to view results   ```   {       \"maxAPTC\": 0,       \"year\": 2019,       \"is_custom\": false,       \"division\": \"HealthCare\",       \"enrollment_groups\": [           {           \"id\": \"a8007732-1425-43e3-81fc-f0e7b9331474\",           \"effective_date\": \"2019-01-01\",           \"csr\": \"Exchange variant (no CSR)\",           \"enrollees\": [               \"1\"           ],           \"subscriber_id\": \"xxxxxxxxxx\",           \"relationships\": [               {               \"super_id\": \"1234567\",               \"sub_id\": \"7654321\",               \"relationship\": \"\"               }           ]           }       ],       \"enrollees\": [           {           \"id\": \"1234567\",           \"name\": \"John\",           \"gender\": \"Male\",           \"dob\": \"1975-01-01\",           \"location\": {               \"city\": \"Philadelphia\",               \"state\": \"PA\",               \"street_1\": \"123 Fake Street\",               \"street_2\": \"Apt. 237\",               \"zipcode\": \"19123\",               \"countyfips\": \"42101\"           },           \"csr\": \"Exchange variant (no CSR)\",           \"is_filer\": true,           \"has_hardship\": true,           \"relationship\": \"\",           \"allowed_metal_levels\": [               \"Catastrophic\"           ],           \"allowed_plan_ids\": [               \"15614PA0010004\"           ],           \"current_enrollment\": {               \"plan_id\": \"15614PA0010004\",               \"effective_date\": \"2018-07-07\",               \"is_smoker\": false           }           }       ]   }   ``` 

### Example
```javascript
var MarketplaceApi = require('marketplace_api');
var defaultClient = MarketplaceApi.ApiClient.instance;

// Configure API key authorization: API Key
var API Key = defaultClient.authentications['API Key'];
API Key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//API Key.apiKeyPrefix = 'Token';

var apiInstance = new MarketplaceApi.EnrollmentsApi();

var apikey = "d687412e7b53146b2631dc01974ad0a4"; // String | API key used for authentication

var opts = { 
  'body': new MarketplaceApi.ExtendedEnrollment() // ExtendedEnrollment | Extended enrollment information
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.enrollmentValidatePost(apikey, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apikey** | **String**| API key used for authentication | 
 **body** | [**ExtendedEnrollment**](ExtendedEnrollment.md)| Extended enrollment information | [optional] 

### Return type

**Object**

### Authorization

[API Key](../README.md#API Key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

