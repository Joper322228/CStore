import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import getProductCart from '@salesforce/apex/CS_ShopingCartController.getProductCart';
import getProduct from '@salesforce/apex/CS_ShopingCartController.getProduct';
import SHOPING_CART_IMG from '@salesforce/resourceUrl/Shoping_Cart_Icon';

export default class ShopingCart extends LightningElement {
    shopingCartImg = SHOPING_CART_IMG;
    isLoading = false;
    productCart = [];
    isDisplay = false;
    isEmpty = false;
    total = 0;

    get orderUrl(){
        return 'https://computerstore-developer-edition.eu44.force.com/s/neworder';
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

    connectedCallback() {
        this.isLoading = true;
        this.getCart();
        this.getTotal();
    }

    async getCart() {
        this.isLoading = true;
        let result = await getProductCart({})

        if (result == null || result.length <= 0) {
            this.isEmpty = true;
            this.isDisplay = false;
            this.isLoading = false;
            return;
        }
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
                Price: result[i].price
            }

            this.productCart.push(productInCard);

            if (i == result.length - 1) {
                console.log(this.productCart);
                this.isDisplay = true;
                this.isEmpty = false;
            }
        }
        this.isLoading = false;
    }

    updateTotal(){
        this.getTotal();
    }

    handleDelete(event) {
        this.isLoading = true;
        this.productCart = [];
        this.isEmpty = true;
        this.getCart();
        this.getTotal();
        const deleteEvent = new ShowToastEvent({
            title: 'Product removed from shoping cart',
        });
        this.dispatchEvent(deleteEvent);
    }

}