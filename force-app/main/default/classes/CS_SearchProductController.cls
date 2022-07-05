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
}
