import { LightningElement, api, wire, track } from 'lwc';
import getOrderItems from '@salesforce/apex/CS_OrderHistoryController.getOrderItems';

const columns = [
    { label: 'Image', fieldName: 'DisplayUrl', type:'image' },
    { label: 'Name', fieldName: 'ProductUrl', type:'url',
        typeAttributes:{
            label:{
                fieldName:'Name'
            }
        }
    },
    { label: 'Quantity', fieldName: 'Quantity',},
    { label: 'Price', fieldName: 'Price', type: 'currency' },
];

export default class OrderItem extends LightningElement {
    @api
    order;
    @track orderItems = [];
    openModal = false;
    columns = columns;


    @wire(getOrderItems, {orderId : '$order.Id'})
    getOrderItems({error, data}){
        if (data) {
            for(let i = 0; i < data.length; i++){
                let orderItem = {
                    DisplayUrl: data[i].Product2.DisplayUrl,
                    ProductUrl: window.location.origin + '/s/product/' + data[i].Product2.Id,
                    Name: data[i].Product2.Name,
                    Quantity: data[i].Quantity,
                    Price: data[i].UnitPrice,
                }
                this.orderItems.push(orderItem);
            }
        } else if (error) {
            const evt = new ShowToastEvent({
                title: 'Error during loading order products',
                message: error,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }

    handleOpenModal(){
        console.log(JSON.parse(JSON.stringify(this.orderItems)));
        this.openModal = true;
    }

    handleCloseModal(){
        this.openModal = false;
    }

}