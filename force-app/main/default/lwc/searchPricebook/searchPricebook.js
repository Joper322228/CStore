import { LightningElement, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import getPricebooks from '@salesforce/apex/CS_PricebookManagerController.getPricebooks';
import selectPricebook from '@salesforce/messageChannel/Pricebook_Selected__c';
import { publish, MessageContext } from 'lightning/messageService';


const actions = [
    { label: 'Show details', name: 'show_details' },
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Is active', fieldName: 'IsActive', type: 'boolean'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];


export default class SearchPricebook extends LightningElement {

    @wire(MessageContext)
    messageContext;
    columns = columns;
    name;
    isActive;
    pricebooks;
    isOpenModal = false;

    handleName(event) {
        this.name = event.detail.value;
    }

    handleFamily(event) {
        this.isActive = event.detail.value;
    }

    handleSearch(){
        getPricebooks({ name: this.name })
        .then((result) => {
            this.pricebooks = result;
            console.log(result);
            console.log(this.pricebooks);
        })
        .catch(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                title: "UnexpectedError",
                message: error.body.message,
                variant: "error"
                })
            );
        })
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    showRowDetails(row){
        const { Id } = row;
        const payload = { recordId: Id };

        publish(this.messageContext, selectPricebook, payload);
    }

    handleOpenAddModal(event){
        this.isOpenModal = true;
    }

    handleCloseAddModal(event){
        this.isOpenModal = event.details;
    }
}