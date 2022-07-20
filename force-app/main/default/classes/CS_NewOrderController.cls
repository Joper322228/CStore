public with sharing class CS_NewOrderController {
    
    @AuraEnabled
    public static String createContract(){
        Contract contract = new Contract(
            AccountId = '0017Q00000NsYxJQAV',
            StartDate = Date.Today(),
            Status = 'Draft',
            ContractTerm = 1
        );

        insert contract;

        return contract.Id;
    }

    @AuraEnabled
    public static void createOrderItems(String orderId){
        List<CS_ProductCartWrapper> productCart = (List<CS_ProductCartWrapper>)Cache.Session.get('Shoping');

        Set<Id> productIds = new Set<Id>();
        for(CS_ProductCartWrapper product : productCart){
            productIds.add(product.id);
        }

        List<PricebookEntry> standartPricebookEntries = [SELECT Id, Product2Id FROM PricebookEntry WHERE Pricebook2.IsStandard = true AND Product2Id IN: productIds];

        List<OrderItem> orderItems = new List<OrderItem>();

        for(CS_ProductCartWrapper product : productCart){
            OrderItem orderItem = new OrderItem(
                OrderId = orderId,
                Product2Id = product.id,
                Quantity = product.amount,
                UnitPrice = product.price
            );
            for(PricebookEntry pricebookEntry : standartPricebookEntries){
                if(orderItem.Product2Id == pricebookEntry.Product2Id){
                    orderItem.PricebookEntryId = pricebookEntry.Id;
                }
            }
            orderItems.add(orderItem);
        }

        insert orderItems;
    }

    @AuraEnabled
    public static List<Pricebook2> getStandartPricebook(){
        return [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
    }
}
