public with sharing class WebToLeadControllerPageController {

    public static Boolean addedLead {get; set;}

    public WebToLeadControllerPageController() {
        addedLead = showPage();
    }

    public static Boolean showPage(){
        try{
            return addedLead = Boolean.valueOf(ApexPages.currentPage().getParameters().get('addedLead'));
        }
        catch(Exception e){
            return false;
        }
    }
}