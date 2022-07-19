public with sharing class CS_CommentReviewController {
    @AuraEnabled
    public static List<Product_Comment__c> getProductComments(String productId){
        return [SELECT
                Id,
                Name,
                Comment_Text__c,
                Rating__c,
                LastModifiedDate,
                CreatedDate,
                CreatedBy.Name,
                CreatedBy.SmallPhotoUrl,
                CreatedBy.CompanyName,
                CreatedById
            FROM
                Product_Comment__c
            WHERE
                Product__c =: productId
            AND 
                Is_Approved__c =: true
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getCommentForUser(String productId, String userId){
        List<Product_Comment__c> commentsToApprove = 
            [SELECT
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
            AND 
                CreatedById =: userId
        ];
        return commentsToApprove.size();
    }

    @AuraEnabled
    public static void deleteComment(String commentId){
        delete [SELECT Id FROM Product_Comment__c WHERE Id =: commentId];
    }
}
