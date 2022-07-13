import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ISACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import END_DATE_FIELD from '@salesforce/schema/Pricebook2.End_Date__c';
import START_DATE_FIELD from '@salesforce/schema/Pricebook2.Start_Date__c';

export default class AddPricebook extends LightningElement {

    fields = [NAME_FIELD, ISACTIVE_FIELD, START_DATE_FIELD, END_DATE_FIELD];

    name = NAME_FIELD;
    isActive = ISACTIVE_FIELD;
    startDate = START_DATE_FIELD;
    endDate = END_DATE_FIELD;
    isModalOpen;

    handleSuccess(event){
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Pricebook created",
            variant: "success"
            })
        );
        this.handleCloseModal(event);
    }

    handleCloseModal(event){
        this.isModalOpen = false;

        const closeModal = new CustomEvent("closemodal", {
            detail: this.isModalOpen 
        });

        this.dispatchEvent(closeModal);
    }
}