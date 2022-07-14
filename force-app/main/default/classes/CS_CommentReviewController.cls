public with sharing class CS_CommentReviewController {
    @AuraEnabled
    public static List<Product_Comment__c> getProductComments(String productId){
        System.debug(productId);
        System.debug([SELECT Id, Rating__c, Name, CreatedById, User__c, Product__c, Comment_Text__c FROM Product_Comment__c]);
        return [SELECT
                Id,
                Name,
                Comment_Text__c,
                Rating__c,
                LastModifiedDate,
                CreatedDate,
                CreatedBy.Name,
                CreatedBy.SmallPhotoUrl,
                CreatedBy.CompanyName
            FROM
                Product_Comment__c
            WHERE
                Product__c =: productId
        ];
    }
}
