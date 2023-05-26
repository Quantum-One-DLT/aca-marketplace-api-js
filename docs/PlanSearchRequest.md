# MarketplaceApi.PlanSearchRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**filter** | [**PlanSearchFilter**](PlanSearchFilter.md) |  | [optional] 
**household** | [**Household**](Household.md) |  | [optional] 
**offset** | **Number** |  | [optional] 
**order** | **String** |  | [optional] 
**place** | [**Place**](Place.md) |  | 
**sort** | **String** |  | [optional] 
**year** | **Number** | defaults to current open enrollment year | [optional] 
**market** | [**MarketEnum**](MarketEnum.md) |  | 
**aptcOverride** | **Number** | override the aptc calculation with a specific amount | [optional] 
**csrOverride** | [**CSRRequestEnum**](CSRRequestEnum.md) |  | [optional] 
**catastrophicOverride** | **Boolean** | Force the display (or suppression) of catastrophic plans | [optional] 
**suppressedPlanIds** | [**PlanIDList**](PlanIDList.md) |  | [optional] 


<a name="OrderEnum"></a>
## Enum: OrderEnum


* `asc` (value: `"asc"`)

* `desc` (value: `"desc"`)




<a name="SortEnum"></a>
## Enum: SortEnum


* `premium` (value: `"premium"`)

* `deductible` (value: `"deductible"`)

* `oopc` (value: `"oopc"`)

* `totalCosts` (value: `"total_costs"`)

* `qualityRating` (value: `"quality_rating"`)




