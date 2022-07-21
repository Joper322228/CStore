import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ORDER from '@salesforce/schema/Order';
import BILLING_FIELD from '@salesforce/schema/Order.BillingAddress';
import SHIPPING_FIELD from '@salesforce/schema/Order.ShippingAddress';
import createContract from '@salesforce/apex/CS_NewOrderController.createContract';
import getStandartPricebook from '@salesforce/apex/CS_NewOrderController.getStandartPricebook';
import createOrderItems from '@salesforce/apex/CS_NewOrderController.createOrderItems';
import getBaseUrl from '@salesforce/apex/CS_NewOrderController.getBaseUrl';
import getAccountId from '@salesforce/apex/CS_NewOrderController.getAccountId';
import getProductCart from '@salesforce/apex/CS_ShopingCartController.getProductCart';
import getProduct from '@salesforce/apex/CS_ShopingCartController.getProduct';
import clearShopingCart from '@salesforce/apex/CS_ShopingCartController.clearShopingCart';
import card from '@salesforce/label/c.CS_Card';
import cash from '@salesforce/label/c.CS_Cash';
import blik from '@salesforce/label/c.CS_RuBlik';
import Id from '@salesforce/user/Id';

export default class NewOrder extends LightningElement {
    userId = Id;
    isLoading = false;
    orderApi = ORDER;
    billingAddress = BILLING_FIELD;
    shippingAddress = SHIPPING_FIELD;
    productCart = [];
    total = 0;
    paymentValue = 'card';
    isDisplay = false;

    get options() {
        return [
            { label: card, value: 'card' },
            { label: cash, value: 'cash' },
            { label: blik, value: 'rublik' },
        ];
    }

    connectedCallback(){
        this.getTotal();
        this.getCart();
    }

    async getCart() {
        this.isLoading = true;
        let result = await getProductCart({})

        for (let i = 0; i < result.length; i++) {

            let productFromCard;

            let resultProduct = await getProduct({ id: result[i].id })

            productFromCard = resultProduct[0];

            let productInCard = {
                Id: productFromCard.Id,
                DisplayUrl: productFromCard.DisplayUrl,
                Code: productFromCard.ProductCode,
                Name: productFromCard.Name,
                Amount: result[i].amount,
                Price: result[i].price,
                TotalPrice: result[i].amount * result[i].price
            }

            this.productCart.push(productInCard);

            if (i == result.length - 1) {
                this.isDisplay = true;
            }
        }
        this.isLoading = false;
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.isLoading = true;
        let pricebookId = await getStandartPricebook({});
        let accountId = await getAccountId({});

        const fields = event.detail.fields;
        fields.AccountId = accountId;
        fields.EffectiveDate = this.formatDate(new Date());
        fields.Status = 'Draft';
        fields.Pricebook2Id = pricebookId[0].Id;

        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    getTotal(){
        getProductCart({})
        .then((result) => {
            this.total = 0;
            for (let i = 0; i < result.length; i++) {
                this.total += result[i].amount * result[i].price;
            }
            this.isLoading = false;
        })
    }

    handleSuccess(event) {
        createOrderItems({ orderId: event.detail.id })
            .then((result) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Your order is created",
                        variant: "success"
                    })
                );
                this.isLoading = false;
                clearShopingCart({})
                .then((result) => {
                    getBaseUrl({})
                    .then((result) => {
                        window.location.replace(result + '/s/order/' + event.detail.id);
                    })
                    
                })
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error creating order",
                        message: error,
                        variant: "error"
                    })
                );
                this.isLoading = false;
            })
        
    }

    handleError(event) {
        this.isLoading = false;
    }

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date) {
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
        ].join('-');
    }
}