import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getNewestProducts from '@salesforce/apex/CS_SearchProductController.getNewestProducts';

export default class NewestProducts extends LightningElement {
    newestProducts;
    currentProduct;
    currentProductNumber = 0;


    connectedCallback(){
        getNewestProducts({})
        .then((result) =>{
            this.newestProducts = result;
            this.currentProduct = this.newestProducts[0];
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
    }

    handlePrev(){
        if(this.currentProductNumber != 0){
            this.currentProductNumber -= 1;
        }
        this.currentProduct = this.newestProducts[this.currentProductNumber];
    }
}