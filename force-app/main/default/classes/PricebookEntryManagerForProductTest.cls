@IsTest
public with sharing class PricebookEntryManagerForProductTest {

    @IsTest(SeeAllData=true)
    public static void shouldSetStandartPricebook(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;

        Double standartPrice = 225;
        
        System.assertEquals(PricebookEntryManagerForProduct.setStandartPricebook(testProduct.Id, standartPrice), true);
    }

}
