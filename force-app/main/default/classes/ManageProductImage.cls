public with sharing class ManageProductImage {
    
    @AuraEnabled
    public static Boolean setProfileImage(String recordId, String url){
        Product2 productForUpdate = [SELECT Id FROM Product2 WHERE Id =: recordId LIMIT 1];

        productForUpdate.DisplayUrl = url;
        update productForUpdate;
        return true;
    }

    @AuraEnabled
    public static void deleteImage(Id imageId){
        ContentDocument contentForDelete = [SELECT Id FROM ContentDocument WHERE Id =: imageId LIMIT 1];
        delete contentForDelete;
    }

}
