public with sharing class CS_NewOrderController {
    
    @AuraEnabled
    public static String createContract(){
        Contract contract = new Contract(
            AccountId = '0017Q00000NsYxJQAV',//chadkoded
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

    @AuraEnabled
    public static String getBaseUrl(){
        Site site = [SELECT Id FROM Site WHERE Name = 'Home' LIMIT 1];

        return [SELECT SecureURL FROM SiteDetail WHERE DurableId =: site.Id].SecureUrl;
    }

    @AuraEnabled
    public static String getAccountId(){
        return [SELECT Id FROM Account WHERE Name = 'LoginAccount' LIMIT 1].Id;
    }
}
