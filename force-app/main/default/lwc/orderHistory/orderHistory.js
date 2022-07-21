import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUserOrders from '@salesforce/apex/CS_OrderHistoryController.getUserOrders';

export default class OrderHistory extends LightningElement {
    @track userOrders = [];
    isEmpty = false;

    @wire(getUserOrders, {})
    getUserOrders({ error, data }) {
        if (data) {
            if(data.length <= 0){
                this.isEmpty = true;
            }
            this.userOrders = data;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error creating order",
                    message: error,
                    variant: "error"
                })
            )
        }
    }
}