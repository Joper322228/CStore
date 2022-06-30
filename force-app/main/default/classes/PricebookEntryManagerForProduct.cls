public with sharing class PricebookEntryManagerForProduct {

    @AuraEnabled
    public static Boolean setStandartPricebook(Id newProductId, Double standartPrice){
        
        PricebookEntry pricebookEntry = new PricebookEntry();

        PriceBook2 standartPricebookId = [SELECT Id FROM PriceBook2  WHERE IsStandard=True LIMIT 1];

        pricebookEntry.Pricebook2Id = standartPricebookId.Id;
        pricebookEntry.Product2Id = newProductId;
        pricebookEntry.UnitPrice = standartPrice;
        
        Database.SaveResult saveResult = Database.insert(pricebookEntry);

        if (saveResult.isSuccess()) {
            return true;
        } else{
            return false;
        }
        
    }
}
