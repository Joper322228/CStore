public without sharing class CS_FaqListController {

    @AuraEnabled(cacheable = true)
    public static List<Knowledge__DataCategorySelection> getKnowledgeRecord(){
        return [SELECT ParentId, DataCategoryGroupName, Parent.Answer__c, Parent.Question__c 
                FROM Knowledge__DataCategorySelection 
                WHERE Parent.IsLatestVersion = true];
    }
}
