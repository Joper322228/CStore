import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    publish,
    MessageContext
} from 'lightning/messageService';
import getProductPrice from '@salesforce/apex/CS_ProductDetailsController.getProductPrice';
import getProductStandartPrice from '@salesforce/apex/CS_ProductDetailsController.getProductStandartPrice';
import addProductToCart from '@salesforce/apex/CS_ShopingCartController.addProductToCart';
import getBaseUrl from '@salesforce/apex/CS_ShopingCartController.getBaseUrl';
import increaseSize from '@salesforce/messageChannel/Shopping_Cart__c';

export default class ProductCard extends LightningElement {
    @api product;
    priceValue;
    standartValue;
    isDiscount = false;
    isLoading = false;

    get detailsUrl(){
        let url = this.baseUrl.data + '/s/product/Product2/' + this.product.Id;
        return url;
    }

    @wire(getBaseUrl, {})
    baseUrl;

    @wire(MessageContext)
    messageContext;

    handleIncreaseCart() {
        const payload = { flag: 1};

        publish(this.messageContext, increaseSize, payload);
    }

    @wire (getProductPrice, {recordId : '$product.Id'})
    getPrice({error, data}){
        if(data){
            if(data[0].expr0 == undefined){
                this.standartValue = Math.round(data[1].expr0 * 100) / 100;
            } else{
                this.priceValue = Math.round(data[0].expr0 * 100) / 100;
                this.standartValue = Math.round(data[1].expr0 * 100) / 100;
                if(this.standartValue >= this.priceValue){
                    this.isDiscount = true;
                } else{
                    this.isDiscount = false;
                }
            }
        } else{
            const toast = new ShowToastEvent({
                title: 'Unexpected error',
                message: error,
                variant: 'error',
            });
            this.dispatchEvent(toast);
        }
    }

    handleAddToCard(event){
        this.isLoading = true;
        let price;
        if(this.standartValue > this.priceValue){
            price = this.priceValue;
        } else{
            price = this.standartValue;
        }
        addProductToCart({recordId : this.product.Id, amount : 1, price : price})
            .then((result) => {
                this.handleIncreaseCart();
                const deleteEvent = new ShowToastEvent({
                    title: 'Product added to shoping cart',
                    variant: 'success'
                });
                this.dispatchEvent(deleteEvent);
                
                this.isLoading = false;
            })
            .catch((error) => {
                const deleteEvent = new ShowToastEvent({
                    title: 'Unexpected error',
                    message: error,
                    variant: 'error',
                });
                this.dispatchEvent(deleteEvent);
                this.isLoading = false;
            })
        
    }
}