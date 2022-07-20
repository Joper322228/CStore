import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import ORDER from '@salesforce/schema/Order';
import NAME_FIELD from '@salesforce/schema/Order.Name';
import CONTRACT_FIELD from '@salesforce/schema/Order.ContractId';
import ACCOUNT_FIELD from '@salesforce/schema/Order.AccountId';
import STATUS_FIELD from '@salesforce/schema/Order.Status';
import START_DATE_FIELD from '@salesforce/schema/Order.EffectiveDate';
import BILLING_FIELD from '@salesforce/schema/Order.BillingAddress';
import SHIPPING_FIELD from '@salesforce/schema/Order.ShippingAddress';
import createContract from '@salesforce/apex/CS_NewOrderController.createContract';
import getStandartPricebook from '@salesforce/apex/CS_NewOrderController.getStandartPricebook';
import createOrderItems from '@salesforce/apex/CS_NewOrderController.createOrderItems';
import getProductCart from '@salesforce/apex/CS_ShopingCartController.getProductCart';
import getProduct from '@salesforce/apex/CS_ShopingCartController.getProduct';
import clearShopingCart from '@salesforce/apex/CS_ShopingCartController.clearShopingCart';
import Id from '@salesforce/user/Id';

export default class NewOrder extends LightningElement {
    userId = Id;
    isLoading = false;
    orderApi = ORDER;
    name = NAME_FIELD;
    contract = CONTRACT_FIELD;
    account = ACCOUNT_FIELD;
    status = STATUS_FIELD;
    startDate = START_DATE_FIELD;
    billingAddress = BILLING_FIELD;
    shippingAddress = SHIPPING_FIELD;
    productCart = [];
    total = 0;
    paymentValue = 'card';
    isDisplay = false;

    get options() {
        return [
            { label: 'Card', value: 'card' },
            { label: 'Cash on delivery', value: 'cash' },
            { label: 'RuBlik', value: 'rublik' },
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
        let contractId = await createContract({})
        let pricebookId = await getStandartPricebook({});

        const fields = event.detail.fields;
        fields.AccountId = '0017Q00000NsYxJQAV';
        fields.ContractId = contractId;
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
                    window.location.replace('https://computerstore-developer-edition.eu44.force.com/s/order/' + event.detail.id);
                })
            })
            .catch((error) => {
                console.log(JSON.parse(JSON.stringify(error)));
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