import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecentlyViewedProducts from '@salesforce/apex/CS_SearchProductController.getRecentlyViewedProducts';

export default class RecentlyViewedProducts extends LightningElement {

    recentlyViewed;
    currentProduct;
    currentProductNumber = 0;

    connectedCallback(){
        getRecentlyViewedProducts({})
        .then((result) =>{
            this.recentlyViewed = result;
            this.currentProduct = this.recentlyViewed[0];
            console.log(this.recentlyViewed);
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
        if(this.currentProductNumber != (this.recentlyViewed.length - 1)){
            this.currentProductNumber += 1;
        }
        this.currentProduct = this.recentlyViewed[this.currentProductNumber];
    }

    handlePrev(){
        if(this.currentProductNumber != 0){
            this.currentProductNumber -= 1;
        }
        this.currentProduct = this.recentlyViewed[this.currentProductNumber];
    }
}