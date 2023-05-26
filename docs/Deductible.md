# MarketplaceApi.Deductible

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **Number** |  | [optional] 
**csr** | [**CostSharingReductionEnum**](CostSharingReductionEnum.md) |  | [optional] 
**familyCost** | [**FamilyCostEnum**](FamilyCostEnum.md) |  | [optional] 
**networkTier** | [**NetworkTierEnum**](NetworkTierEnum.md) |  | [optional] 
**type** | **String** |  | [optional] 
**individual** | **Boolean** | Applies to individuals | [optional] 
**family** | **Boolean** | Applies to families | [optional] 
**displayString** | **String** | An optional human-readable description | [optional] 


<a name="TypeEnum"></a>
## Enum: TypeEnum


* `medicalEHBDeductible` (value: `"Medical EHB Deductible"`)

* `combinedMedicalAndDrugEHBDeductible` (value: `"Combined Medical and Drug EHB Deductible"`)

* `drugEHBDeductible` (value: `"Drug EHB Deductible"`)




