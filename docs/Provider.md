# MarketplaceApi.Provider

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** |  | 
**gender** | [**ProviderGenderEnum**](ProviderGenderEnum.md) |  | [optional] 
**specialties** | **[String]** |  | [optional] 
**type** | [**ProviderTypeEnum**](ProviderTypeEnum.md) |  | 
**accepting** | **String** |  | [optional] 
**npi** | **String** |  | 
**languages** | **[String]** |  | [optional] 
**facilityTypes** | **[String]** | If provider is a facility, this is a list of the applicable facility types | [optional] 
**taxonomy** | **String** | provider taxonomy from National Uniform Claim Committee | [optional] 


<a name="AcceptingEnum"></a>
## Enum: AcceptingEnum


* `accepting` (value: `"accepting"`)

* `notAccepting` (value: `"not accepting"`)

* `acceptingInSomeLocations` (value: `"accepting in some locations"`)

* `unknown` (value: `"unknown"`)




