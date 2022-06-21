@isTest
public with sharing class WebToLeadControllerTest {
    @isTest
    public static void shouldSuccess() {
        ApexPages.currentPage().getParameters().put('addedLead', 'true');
        WebToLeadControllerPageController test = new WebToLeadControllerPageController();
        System.assertEquals(WebToLeadControllerPageController.addedLead, true);
    }
}