import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecentlyViewedProducts from '@salesforce/apex/CS_SearchProductController.getRecentlyViewedProducts';

export default class RecentlyViewedProducts extends LightningElement {

    recentlyViewed;
    currentProduct = [];
    currentProductNumber = 1;
    renderProducts = false;

    connectedCallback(){
        getRecentlyViewedProducts({})
        .then((result) =>{
            this.recentlyViewed = result;
            this.currentProduct.push(this.recentlyViewed[0]);
            this.currentProduct.push(this.recentlyViewed[1]);
            this.renderProducts = true;
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
        this.currentProduct = [];
        this.currentProduct.push(this.recentlyViewed[this.currentProductNumber - 1]);
        this.currentProduct.push(this.recentlyViewed[this.currentProductNumber]);
    }

    handlePrev(){
        if(this.currentProductNumber != 1){
            this.currentProductNumber -= 1;
        }
        this.currentProduct = [];
        this.currentProduct.push(this.recentlyViewed[this.currentProductNumber - 1]);
        this.currentProduct.push(this.recentlyViewed[this.currentProductNumber]);
    }
}