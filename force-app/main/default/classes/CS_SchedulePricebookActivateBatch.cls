public with sharing class CS_SchedulePricebookActivateBatch implements Schedulable {
    public void execute(SchedulableContext sc) {
        CS_PricebookActivateBatch pricebookActivate = new CS_PricebookActivateBatch();
         Database.executeBatch(pricebookActivate);
     }
 }