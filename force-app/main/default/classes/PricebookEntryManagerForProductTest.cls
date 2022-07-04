@IsTest
public with sharing class PricebookEntryManagerForProductTest {

    @IsTest(SeeAllData=true)
    public static void shouldSetStandartPricebook(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;

        Double standartPrice = 225;
        
        System.assertEquals(PricebookEntryManagerForProduct.setStandartPricebook(testProduct.Id, standartPrice), true);
    }

    @IsTest(SeeAllData=true)
    public static void shouldGetStandartPricebook(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;

        PricebookEntryManagerForProduct.setStandartPricebook(testProduct.Id, 232);

        System.assertEquals(PricebookEntryManagerForProduct.getStandartPrice(testProduct.Id), 232);
    }

    @IsTest(SeeAllData=true)
    public static void shouldUpdateStandartPricebook(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;

        Double standartPrice = 225;
        PricebookEntryManagerForProduct.setStandartPricebook(testProduct.Id, standartPrice);

        PricebookEntryManagerForProduct.updateStandartPricebook(testProduct.Id, standartPrice);

    }

}
