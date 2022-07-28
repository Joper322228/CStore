public without sharing class CS_NewCaseController {

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderedProducts(String orderId){
        return [SELECT Id, Product2.Id, Product2.Name FROM OrderItem WHERE CreatedById =: UserInfo.getUserId() AND OrderId =: orderId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Order> getOrders(){
        return [SELECT Id, OrderNumber, EffectiveDate FROM Order WHERE CreatedById =: UserInfo.getUserId()];
    }

    @AuraEnabled
    public static void setAssingmentRule(String caseId){
        AssignmentRule AR = new AssignmentRule();
        AR = [SELECT id FROM AssignmentRule WHERE SobjectType = 'Case' AND Active = true limit 1];

        Database.DMLOptions dmlOpts = new Database.DMLOptions();
        dmlOpts.assignmentRuleHeader.assignmentRuleId= AR.id;

        Case caseForUpdate = [SELECT Id, Order__c, ProductId FROM Case WHERE Id =: caseId];
        caseForUpdate.setOptions(dmlOpts);
        update caseForUpdate;
    }
}
