@IsTest
public with sharing class ManageProductImageTest {
 
    @IsTest
    public static void shouldSetProfileImage(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;
        String url = 'testUrl';
        Product2 productForUpdate = [SELECT Id FROM Product2 LIMIT 1];
        System.assertEquals(ManageProductImage.setProfileImage(productForUpdate.Id, url), true);

    }

    @IsTest
    public static void shouldDeleteImage(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;

        ManageProductImage.deleteImage('');
    }

    @IsTest
    public static void shoulGetProfileImage(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;
        
        System.assertEquals(ManageProductImage.getProfileImageId(testProduct.Id), '');

    }
}
