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
        
        List<PriceBook2> standartPricebookId = [SELECT Id FROM PriceBook2  WHERE IsStandard=True LIMIT 1];
        List<PricebookEntry> pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE PriceBook2Id =: standartPricebookId[0].Id AND Product2Id =: productId LIMIT 1];
        
        pricebookEntry[0].UnitPrice = newStandartPrice;
        update pricebookEntry;
    }

    @AuraEnabled
    public static Double getStandartPrice(Id productId){
        
        List<PriceBook2> standartPricebookId = [SELECT Id FROM PriceBook2  WHERE IsStandard=True LIMIT 1];
        List<PricebookEntry> pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE PriceBook2Id =: standartPricebookId[0].Id AND Product2Id =: productId LIMIT 1];
        
        return pricebookEntry[0].UnitPrice;
    }

}
