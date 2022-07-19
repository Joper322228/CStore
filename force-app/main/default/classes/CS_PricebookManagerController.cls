public with sharing class CS_PricebookManagerController {

    @AuraEnabled
    public static List<Pricebook2> getPricebooks(String name){
        List<Pricebook2> pricebooks = new List<Pricebook2>();

        String query = 'SELECT Id, Name, IsActive, Start_Date__c, End_Date__c FROM Pricebook2 ' +
            'WHERE Id != null';

        if(!String.isBlank(name)){
            query += ' AND Name Like  \'%' + name + '%\'';
        }

        pricebooks = Database.query(query);

        return pricebooks;
    }

    @AuraEnabled
    public static List<PricebookEntry> getPricebookEntries(String recordId){
        List<PricebookEntry> pricebookEntries = [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: recordId];

        return pricebookEntries;
    }

    @AuraEnabled
    public static List<PricebookEntry> updatePricebookEntriesCurrency(List<String> entryIds, Double valueForUpdate, String recordId){
        List<PricebookEntry> pricebookEntries = new List<PricebookEntry>();

        for(PricebookEntry pricebookEntry : [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Id IN: entryIds]){
            pricebookEntry.UnitPrice += valueForUpdate;
            pricebookEntries.add(pricebookEntry);
        }

        update pricebookEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: recordId];
    }

    @AuraEnabled
    public static List<PricebookEntry> updatePricebookEntriesPercentage(List<String> entryIds, Double valueForUpdate, String recordId){
        List<PricebookEntry> pricebookEntries = new List<PricebookEntry>();

        for(PricebookEntry pricebookEntry : [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Id IN: entryIds]){
            pricebookEntry.UnitPrice -= (valueForUpdate * pricebookEntry.UnitPrice);
            pricebookEntries.add(pricebookEntry);
        }

        update pricebookEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: recordId];
    }

    @AuraEnabled
    public static List<PricebookEntry> updatePricebookEntriesNewPrice(List<String> entryIds, Double valueForUpdate, String recordId){
        List<PricebookEntry> pricebookEntries = new List<PricebookEntry>();

        for(PricebookEntry pricebookEntry : [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Id IN: entryIds]){
            pricebookEntry.UnitPrice = valueForUpdate;
            pricebookEntries.add(pricebookEntry);
        }

        update pricebookEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: recordId];
    }

    @AuraEnabled
    public static List<Product2> getProducts(String productName){
        List<Product2> products = new List<Product2>();
        String query = 'SELECT Id, Name, Family FROM Product2 WHERE Id != null';

        if(!String.isBlank(productName)){
            query += ' AND Name Like  \'%' + productName + '%\'';
        }

        products = Database.query(query);

        return products;
    }

    @AuraEnabled
    public static List<PricebookEntry> addProductsToPricebook(List<String> productIds, String pricebookId){
        List<PricebookEntry> pricebookEntries = new List<PricebookEntry>();

        List<Pricebook2> standartPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];
        List<PricebookEntry> standartPricebookEntries = [SELECT Product2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: standartPricebook[0].Id];

        for(String id : productIds){
            PricebookEntry pricebookEntry = new PricebookEntry();
            pricebookEntry.Product2Id = id;
            pricebookEntry.Pricebook2Id = pricebookId;
            for(PricebookEntry standartPricebookEntry : standartPricebookEntries){
                if(standartPricebookEntry.Product2Id == pricebookEntry.Product2Id){
                    pricebookEntry.UnitPrice = standartPricebookEntry.UnitPrice;
                }
            }
            pricebookEntries.add(pricebookEntry);
        }

        insert pricebookEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: pricebookId];
    }
}