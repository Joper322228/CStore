public with sharing class ManageProductProfileImage {
    
    @AuraEnabled
    public static Boolean setProfileImage(String recordId, String url){
        Product2 productForUpdate = [SELECT Id FROM Product2 WHERE Id =: recordId LIMIT 1];

        productForUpdate.DisplayUrl = url;
        update productForUpdate;
        return true;
    }

}
