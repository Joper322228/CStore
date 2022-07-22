public with sharing class CS_ProductSearchComunityController {
    @AuraEnabled
    public static List<Product2> getProducts(String productName){
        List<Product2> foundedProducts = new List<Product2>();

        String query = 'SELECT Name, Family, Model__c, ProductCode, Mark__c, Amount__c, DisplayUrl FROM Product2 ' +
            'WHERE Id != null';

        if(!String.isBlank(productName)){
            query += ' AND Name Like  \'%' + productName + '%\'';
        }

        foundedProducts = Database.query(query);
        return foundedProducts;
    }

    @AuraEnabled
    public static List<Product2> getSearchedProducts(String productName, String model, String mark){
        
        List<Product2> foundedProducts = new List<Product2>();

        String query = 'SELECT Name, Family, Model__c, ProductCode, Mark__c, Amount__c, DisplayUrl FROM Product2 ' +
            'WHERE Id != null';

        if(!String.isBlank(productName)){
            query += ' AND Name Like  \'%' + productName + '%\'';
        }
        if(!String.isBlank(model)){
            query += ' AND Model__c =: model';
        }
        if(!String.isBlank(mark)){
            query += ' AND Mark__c =: mark';
        }

        foundedProducts = Database.query(query);

        return foundedProducts;
    }
}
