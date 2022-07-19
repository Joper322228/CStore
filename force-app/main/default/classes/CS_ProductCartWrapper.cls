public with sharing class CS_ProductCartWrapper {
    @AuraEnabled
    public String id;
    @AuraEnabled
    public Integer amount;
    @AuraEnabled
    public Double price;

    public CS_ProductCartWrapper(String id, Integer amount, Double price){
        this.id = id;
        this.amount = amount;
        this.price = price;
    }
}
