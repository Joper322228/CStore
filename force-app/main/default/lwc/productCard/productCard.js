import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductPrice from '@salesforce/apex/CS_ProductDetailsController.getProductPrice';
import getProductStandartPrice from '@salesforce/apex/CS_ProductDetailsController.getProductStandartPrice';
import addProductToCart from '@salesforce/apex/CS_ShopingCartController.addProductToCart';

export default class ProductCard extends LightningElement {
    @api product;
    priceValue;
    standartValue;
    isDiscount = false;
    isLoading = false;

    get detailsUrl(){
        return 'https://computerstore-developer-edition.eu44.force.com/s/product/Product2/' +
            this.product.Id;
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
            console.log(error);
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
        console.log('test');
        addProductToCart({recordId : this.product.Id, amount : 1, price : price})
            .then((result) => {
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