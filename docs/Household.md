# MarketplaceApi.Household

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**income** | **Number** | household's yearly income in dollars | [optional] 
**unemploymentReceived** | **String** | Specifies whether a tax payer or tax dependent in the household received unemployment benefits for market year 2021. May affect ATPC and CSR calulations due to income percentage capping if income is above 133% of the Federal poverty level. If the person who received unemployment is a tax dependent, only the eligible CSRs will be affected. Defaults to None | [optional] 
**people** | [**[Person]**](Person.md) | people in household applying for coverage/seeking eligibility esimate; first is considered the subscriber | [optional] 
**hasMarriedCouple** | **Boolean** |  | [optional] 
**effectiveDate** | **String** | The effective date of the application (YYYY-MM-DD) | [optional] 


<a name="UnemploymentReceivedEnum"></a>
## Enum: UnemploymentReceivedEnum


* `adult` (value: `"Adult"`)

* `dependent` (value: `"Dependent"`)

* `none` (value: `"None"`)




