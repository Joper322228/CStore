import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBaseUrl from '@salesforce/apex/CS_ShopingCartController.getBaseUrl';
import getProductCartSize from '@salesforce/apex/CS_ShopingCartController.getProductCartSize';
import SHOPING_CART_IMG from '@salesforce/resourceUrl/Shoping_Cart';
import increaseCart from '@salesforce/messageChannel/Shopping_Cart__c';

export default class ShopingCartButton extends LightningElement {
    shopingCartImg = SHOPING_CART_IMG;
    cartSize;

    get shopingCartUrl(){
        let url = this.baseUrl.data + '/s/shopingcart';
        return url;
    }

    @wire(getBaseUrl, {})
    baseUrl;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                increaseCart,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {

        getProductCartSize({})
        .then((result)=>{
            this.cartSize = result;
            console.log(this.cartSize);
        })
    }

    connectedCallback() {
        this.subscribeToMessageChannel();

        getProductCartSize({})
        .then((result)=>{
            this.cartSize = result;
        })
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading contact',
                message: reduceErrors(error).join(', '),
                variant: 'error',
            })
        );
    }
}