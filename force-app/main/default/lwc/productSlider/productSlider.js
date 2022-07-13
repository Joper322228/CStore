import { LightningElement, api } from 'lwc';

export default class ProductSlider extends LightningElement {
    @api products;
    @api currentProduct;
    currentProductNumber = 0;

    handleNext(){
        if(this.currentProductNumber != (this.products.length - 1)){
            this.currentProductNumber += 1;
        }
        this.currentProduct = this.products[this.currentProductNumber];
    }

    handlePrev(){
        if(this.currentProductNumber != 0){
            this.currentProductNumber -= 1;
        }
        this.currentProduct = this.products[this.currentProductNumber];
    }
}