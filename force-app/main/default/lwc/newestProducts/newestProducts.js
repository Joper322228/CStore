import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getNewestProducts from '@salesforce/apex/CS_SearchProductController.getNewestProducts';

export default class NewestProducts extends LightningElement {
    newestProducts;
    currentProduct;
    currentProductNumber = 0;
    currentProductDetailsUrl;

    connectedCallback(){
        getNewestProducts({})
        .then((result) =>{
            this.newestProducts = result;
            this.currentProduct = this.newestProducts[0];
            this.detailsUrlBuilder();
        })
        .catch((error) =>{
            this.dispatchEvent(new ShowToastEvent({
                title: 'Sory we got unexpected error',
                message: 'Error message:' + error,
                variant: 'error',
            }));
        })
    }

    handleNext(){
        if(this.currentProductNumber != (this.newestProducts.length - 1)){
            this.currentProductNumber += 1;
        }
        this.currentProduct = this.newestProducts[this.currentProductNumber];
        this.detailsUrlBuilder();
    }

    handlePrev(){
        if(this.currentProductNumber != 0){
            this.currentProductNumber -= 1;
        }
        this.currentProduct = this.newestProducts[this.currentProductNumber];
        this.detailsUrlBuilder();
    }

    detailsUrlBuilder(){
        this.currentProductDetailsUrl = 
            'https://computerstore-developer-edition.eu44.force.com/s/product/Product2/' +
            this.currentProduct.Id;
    }
}