@IsTest
public with sharing class uploadProductImagesTest {

    @IsTest
    public static void shouldGetVersionFiles(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;
        Product2 productForUpdate = [SELECT Id FROM Product2 LIMIT 1];
        System.assert(uploadProductImages.getVersionFiles(productForUpdate.Id) != null);
    }

    @IsTest
    public static void shouldNotGetVersionFiles(){
        Product2 testProduct = new Product2(Name = 'testProduct');
        insert testProduct;
        Product2 productForUpdate = [SELECT Id FROM Product2 LIMIT 1];
        try{
            uploadProductImages.getVersionFiles('77477474747384123128');
        }
        catch(Exception ex){
            System.assert(ex.getMessage() != null);
        }
    }

}
