public with sharing class CS_PricebookActivateBatch implements Database.Batchable<sObject>, Database.Stateful {

    public Database.QueryLocator start(Database.BatchableContext BC){
        String query = 'SELECT Id, IsActive, Start_Date__c, End_Date__c FROM Pricebook2';
        return Database.getQueryLocator(query);
    }
  
    public void execute(Database.BatchableContext BC, List<Pricebook2> scope){
        List<Pricebook2> pricebookForUpdate = new List<Pricebook2>();
        for(Pricebook2 pricebook : scope){
            if((Date.today() >= pricebook.Start_Date__c) && (Date.today() <= pricebook.End_Date__c)){
                pricebook.IsActive = true;
                pricebookForUpdate.add(pricebook);
            } else{
                pricebook.IsActive = false;
                pricebookForUpdate.add(pricebook);
            }
        }
        update pricebookForUpdate;
    }
  
    public void finish(Database.BatchableContext BC){
    }
}
