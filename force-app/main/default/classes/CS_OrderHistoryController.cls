public with sharing class CS_OrderHistoryController {
    
    @AuraEnabled(cacheable=true)
    public static List<Order> getUserOrders(){
        String userId = UserInfo.getUserId();

        return [SELECT Id, OrderNumber, Status, EffectiveDate, TotalAmount FROM Order WHERE CreatedById =: userId ORDER BY OrderNumber];
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItems(String orderId){
        return [SELECT Id, Product2.Name, Product2.DisplayUrl, Quantity, TotalPrice, UnitPrice FROM OrderItem WHERE OrderId =: orderId];
    }
}
