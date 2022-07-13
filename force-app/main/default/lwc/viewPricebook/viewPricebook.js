import { LightningElement, wire } from 'lwc';
import selectPricebook from '@salesforce/messageChannel/Pricebook_Selected__c';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import getPricebookEntries from '@salesforce/apex/CS_PricebookManagerController.getPricebookEntries';
import updatePricebookEntriesCurrency from '@salesforce/apex/CS_PricebookManagerController.updatePricebookEntriesCurrency';
import updatePricebookEntriesPercentage from '@salesforce/apex/CS_PricebookManagerController.updatePricebookEntriesPercentage';

const columns = [
    { label: 'Product name', fieldName: 'Name' },
    { label: 'Price', fieldName: 'Price', type: 'currency' },
    { label: 'New price', fieldName: 'NewPrice', type: 'currency' },
];

export default class ViewPricebook extends LightningElement {
    recordId;
    pricebookEntries;
    columns = columns;
    percentageValue;
    currencyValue;
    usePercentage = false;
    openModal = false;
    newPrice;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                selectPricebook,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        this.recordId = message.recordId;
        getPricebookEntries({recordId: this.recordId})
        .then((result) => {
            //this.pricebookEntries = result;
            this.pricebookEntries = [];
            console.log(this.recordId);
            for(let i = 0; i < result.length; i++){
                let pricebookEntry = {
                    Id: result[i].Id,
                    Name: result[i].Product2.Name,
                    Price: result[i].UnitPrice,
                    NewPrice: result[i].UnitPrice,
                }
                this.pricebookEntries.push(pricebookEntry);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    handleCurrency(event){
        this.currencyValue = event.detail.value;
        getPricebookEntries({recordId: this.recordId})
        .then((result) => {
            this.pricebookEntries = [];
            for(let i = 0; i < result.length; i++){
                let pricebookEntry = {
                    Id: result[i].Id,
                    Name: result[i].Product2.Name,
                    Price: result[i].UnitPrice,
                    NewPrice: result[i].UnitPrice + parseInt(this.currencyValue)
                }
                this.pricebookEntries.push(pricebookEntry);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handlePercentage(event){
        this.percentageValue = event.detail.value;
        getPricebookEntries({recordId: this.recordId})
        .then((result) => {
            this.pricebookEntries = [];
            for(let i = 0; i < result.length; i++){
                let pricebookEntry = {
                    Id: result[i].Id,
                    Name: result[i].Product2.Name,
                    Price: result[i].UnitPrice,
                    NewPrice: result[i].UnitPrice + result[i].UnitPrice * (this.percentageValue / 100)
                }
                this.pricebookEntries.push(pricebookEntry);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleToggle(event){
        this.usePercentage = event.target.checked;
    }

    handleOpenModal(event){
        this.openModal = true;
    }

    handleCloseModal(event){
        this.openModal = event.detail;
        getPricebookEntries({recordId: this.recordId})
        .then((result) => {
            this.pricebookEntries = [];
            console.log(this.recordId);
            for(let i = 0; i < result.length; i++){
                let pricebookEntry = {
                    Id: result[i].Id,
                    Name: result[i].Product2.Name,
                    Price: result[i].UnitPrice,
                    NewPrice: result[i].UnitPrice
                }
                this.pricebookEntries.push(pricebookEntry);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleUpdatePrice(event){
        let chosenProducts = this.template.querySelector("lightning-datatable").getSelectedRows();
        let Ids = [];
        for(let i = 0; i < chosenProducts.length; i++){
            Ids.push(chosenProducts[i].Id);
        }
        if(this.usePercentage){
            updatePricebookEntriesPercentage({entryIds: Ids, valueForUpdate: this.percentageValue / 100, recordId: this.recordId})
            .then((result) => {
                this.pricebookEntries = [];
                for(let i = 0; i < result.length; i++){
                    let pricebookEntry = {
                        Id: result[i].Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: result[i].UnitPrice + result[i].UnitPrice * (this.percentageValue / 100)
                    }
                    this.pricebookEntries.push(pricebookEntry);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else{
            updatePricebookEntriesCurrency({entryIds: Ids, valueForUpdate: this.currencyValue, recordId: this.recordId})
            .then((result) => {
                this.pricebookEntries = [];
                for(let i = 0; i < result.length; i++){
                    let pricebookEntry = {
                        Id: result[i].Id,
                        Name: result[i].Product2.Name,
                        Price: result[i].UnitPrice,
                        NewPrice: result[i].UnitPrice + parseInt(this.currencyValue)
                    }
                    this.pricebookEntries.push(pricebookEntry);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
}