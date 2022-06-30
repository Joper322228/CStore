@IsTest
public with sharing class ManageProductImageTest {
 
    @IsTest
    public static void shouldSetProfileImage(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;
        String url = 'testUrl';
        Product2 productForUpdate = [SELECT Id FROM Product2 LIMIT 1];
        System.assertEquals(ManageProductProfileImage.setProfileImage(productForUpdate.Id, url), true);

    }
}
