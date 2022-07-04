public with sharing class ManageProductImage {
    
    @AuraEnabled
    public static Boolean setProfileImage(String recordId, String url){

        Product2 productForUpdate = [SELECT Id FROM Product2 WHERE Id =: recordId LIMIT 1];

        productForUpdate.DisplayUrl = url;
        update productForUpdate;
        return true;
    }

    @AuraEnabled
    public static void deleteImage(String imageId){
        List<ContentDocument> contentForDelete = [SELECT Id FROM ContentDocument WHERE Id =: imageId LIMIT 1];
        if(contentForDelete.size() > 0){
            delete contentForDelete;
        }
        return;
    }

    @AuraEnabled
    public static String getProfileImageId(Id productId){
        
        List<Product2> productWithDisplayUrl = [SELECT Id, DisplayUrl FROM Product2 WHERE Id =: productId];

        if(productWithDisplayUrl.size() > 0){
            if(productWithDisplayUrl[0].DisplayUrl != null){
                return productWithDisplayUrl[0].DisplayUrl.replaceAll('/sfc/servlet.shepherd/document/download/', '');
            }
        }
        return '';
    }
}
