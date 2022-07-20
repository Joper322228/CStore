public with sharing class CS_ShopingCartController {
    
    public static Boolean addToCart = true;

    @AuraEnabled
    public static void addProductToCart(String recordId, Integer amount, Double price){
        CS_ProductCartWrapper productCartWrapper = new CS_ProductCartWrapper(recordId, amount, price);

        List<CS_ProductCartWrapper> productCart = (List<CS_ProductCartWrapper>)Cache.Session.get('Shoping');

        if(productCart == null){
            productCart = new List<CS_ProductCartWrapper>();
        }

        for(Integer i = 0; i < productCart.size(); i++){
            if(productCart[i].id == productCartWrapper.id){
                productCart[i].amount += productCartWrapper.amount;
                addToCart = false;
            }
        }

        if(addToCart){
            productCart.add(productCartWrapper);
        }

        Cache.Session.put('Shoping', productCart);
    }

    @AuraEnabled
    public static void removeFromCart(String recordId){
        List<CS_ProductCartWrapper> productCart = (List<CS_ProductCartWrapper>)Cache.Session.get('Shoping');

        for(Integer i = 0; i < productCart.size(); i++){
            if(productCart[i].id == recordId){
                productCart.remove(i);
                Cache.Session.put('Shoping', productCart);
                return;
            }
        }
    }

    @AuraEnabled
    public static void updateAmount(String recordId, Integer amount){
        List<CS_ProductCartWrapper> productCart = (List<CS_ProductCartWrapper>)Cache.Session.get('Shoping');

        for(Integer i = 0; i < productCart.size(); i++){
            if(productCart[i].id == recordId){
                productCart[i].amount = amount;
                Cache.Session.put('Shoping', productCart);
                return;
            }
        }
    }

    @AuraEnabled
    public static List<CS_ProductCartWrapper> getProductCart(){
        return (List<CS_ProductCartWrapper>)Cache.Session.get('Shoping');
    }

    @AuraEnabled
    public static void clearShopingCart(){
        List<CS_ProductCartWrapper> productCart = new List<CS_ProductCartWrapper>();
        Cache.Session.put('Shoping', productCart);
    }

    @AuraEnabled
    public static List<Product2> getProduct(String id){
        return [SELECT 
                    Id, 
                    Name, 
                    Mark__c, 
                    Family, 
                    ProductCode, 
                    Model__c, 
                    DisplayUrl, 
                    Amount__c ,
                    Description
                    FROM Product2 
                    WHERE Id =: id 
                    LIMIT 1
                ];
    }
}
