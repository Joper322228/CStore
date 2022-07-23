public with sharing class CS_NewCaseController {

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderedProducts(String orderId){
        return [SELECT Id, Product2.Id, Product2.Name FROM OrderItem WHERE CreatedById =: UserInfo.getUserId() AND OrderId =: orderId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Order> getOrders(){
        return [SELECT Id, OrderNumber, EffectiveDate FROM Order WHERE CreatedById =: UserInfo.getUserId()];
    }

}
