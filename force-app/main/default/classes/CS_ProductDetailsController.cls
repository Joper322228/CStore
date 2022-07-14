public with sharing class CS_ProductDetailsController {

    @AuraEnabled(cacheable=true)
    public static Product2 getProductDetails(String recordId){
        
        List<Product2> product = [SELECT Id, 
            Name, 
            Mark__c, 
            Family, 
            ProductCode, 
            Model__c, 
            DisplayUrl, 
            Amount__c ,
            Description
            FROM Product2 
            WHERE ID =: recordId 
            LIMIT 1
        ];
        System.debug(product);

        if(product.size() > 0 ){
            return product[0];
        } else{
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getProductImages(String recordId){
        
        return [
            SELECT
            Id,
            ContentDocumentId
            FROM ContentVersion
            WHERE FirstPublishLocationId =: recordId
            ORDER BY CreatedDate DESC
		]; 
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getRatingProduct(String recordId){
        return [SELECT AVG(Rating__c) FROM Product_Comment__c WHERE Product__c =: recordId];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProductPrice(String recordId){
        List<AggregateResult> price = [SELECT MIN(UnitPrice) FROM PricebookEntry WHERE Product2Id =: recordId AND Pricebook2.IsActive = true];
        List<AggregateResult> standartPrice = [SELECT MIN(UnitPrice) FROM PricebookEntry WHERE Product2Id =: recordId AND Pricebook2.IsStandard = true];

        price.add(standartPrice[0]);

        System.debug(price);


        return price;
    }
}
