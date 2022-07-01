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

    @AuraEnabled
    public static void updateStandartPricebook(Id productId, Double newStandartPrice){
        
        PriceBook2 standartPricebookId = [SELECT Id FROM PriceBook2  WHERE IsStandard=True LIMIT 1];
        PricebookEntry pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE PriceBook2Id =: standartPricebookId.Id AND Product2Id =: productId LIMIT 1];
        
        pricebookEntry.UnitPrice = newStandartPrice;
        System.System.debug(pricebookEntry);
        update pricebookEntry;
    }

    @AuraEnabled
    public static Double getStandartPrice(Id productId){
        
        PriceBook2 standartPricebookId = [SELECT Id FROM PriceBook2  WHERE IsStandard=True LIMIT 1];
        PricebookEntry pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE PriceBook2Id =: standartPricebookId.Id AND Product2Id =: productId LIMIT 1];
        
        return pricebookEntry.UnitPrice;
    }

}
