public with sharing class CS_SearchProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getSearchedProducts(String productName, String productFamily, String model, String code, String mark){
        
        List<Product2> foundedProducts = new List<Product2>();

        String query = 'SELECT Name, Family, Model__c, ProductCode, Mark__c, Amount__c FROM Product2 ' +
            'WHERE Id != null';

        if(!String.isBlank(productName)){
            query += ' AND Name Like  \'%' + productName + '%\'';
        }
        if(!String.isBlank(productFamily)){
            query += ' AND Family =: productFamily';
        }
        if(!String.isBlank(model)){
            query += ' AND Model__c =: model';
        }
        if(!String.isBlank(code)){
            query += ' AND ProductCode =: code';
        }
        if(!String.isBlank(mark)){
            query += ' AND Mark__c =: mark';
        }

        foundedProducts = Database.query(query);

        return foundedProducts;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getRecentlyViewedProducts(){
        List<RecentlyViewed> recentlyViewedProductsId = [SELECT Id FROM RecentlyViewed WHERE Type = 'Product2' AND LastViewedDate = LAST_N_DAYS:7 ORDER BY LastViewedDate DESC LIMIT 5];

        Set<Id> productsId = new Set<Id>();
        for(RecentlyViewed recv : recentlyViewedProductsId) {
            productsId.add(recv.Id);
        }

        return [SELECT Id, Name, Mark__c, Family, ProductCode, Model__c, DisplayUrl, Amount__c FROM Product2 WHERE ID in :productsId ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getNewestProducts(){
        List<Product2> newestProducts = new List<Product2>();

        newestProducts = [SELECT Id, Name, DisplayUrl, Family, ProductCode, Mark__c, Model__c, Amount__c FROM Product2 ORDER BY CreatedDate DESC LIMIT 5];

        return newestProducts;
    }
}
