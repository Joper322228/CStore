public with sharing class CS_CaseHistoryController {

    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases(){
        return [SELECT Id, CaseNumber, Reason, Subject, Status FROM Case WHERE CreatedById =: UserInfo.getUserId()];
    }
}
