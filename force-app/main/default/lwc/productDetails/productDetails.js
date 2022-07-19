import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductDetails from '@salesforce/apex/CS_ProductDetailsController.getProductDetails';
import getProductImages from '@salesforce/apex/CS_ProductDetailsController.getProductImages';
import getRatingProduct from '@salesforce/apex/CS_ProductDetailsController.getRatingProduct';
import getProductPrice from '@salesforce/apex/CS_ProductDetailsController.getProductPrice';
import addProductToCart from '@salesforce/apex/CS_ShopingCartController.addProductToCart';

export default class ProductDetails extends LightningElement {
    @api recordId;
    @track recordImages = [];
    @track imagesUrl = [];
    isLoading = false;
    currentImgUrl;
    currentImgNumber = 0;
    ratingValue;
    priceValue;
    standartValue;
    cartAmount = 1;
    isDiscount = false;

    @wire (getProductDetails, {recordId : '$recordId'})
    recordDetails;

    @wire (getProductImages, {recordId : '$recordId'})
    getImages({error, data}){
        this.isLoading = true;
        if(data){
            this.recordImages = data;
            for(let i = 0; i < data.length; i++){
                let url = "/sfc/servlet.shepherd/document/download/" +
                    data[i].ContentDocumentId;
                this.imagesUrl.push(url);
            }
            this.currentImgUrl = this.imagesUrl[0];
        }
        this.isLoading = false;
    };

    @wire (getRatingProduct, {recordId : '$recordId'})
    getRating({error, data}){
        this.isLoading = true;
        if(data){
            this.ratingValue = Math.round(data[0].expr0);
        } else{
            const deleteEvent = new ShowToastEvent({
                title: 'Unexpected error',
                message: error,
                variant: 'error'
            });
            this.dispatchEvent(deleteEvent);
        }
        this.isLoading = false;
    }

    @wire (getProductPrice, {recordId : '$recordId'})
    getPrice({error, data}){
        this.isLoading = true;
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
            this.isLoading = false;
        } else{
            const deleteEvent = new ShowToastEvent({
                title: 'Unexpected error',
                message: error,
                variant: 'error'
            });
            this.dispatchEvent(deleteEvent);
            this.isLoading = false;
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
        addProductToCart({recordId : this.recordId, amount : this.cartAmount, price : price})
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

    handleNext(){
        if(this.currentImgNumber != (this.imagesUrl.length - 1)){
            this.currentImgNumber += 1;
        }
        this.currentImgUrl = this.imagesUrl[this.currentImgNumber];
    }

    handlePrev(){
        if(this.currentImgNumber != 0){
            this.currentImgNumber -= 1;
        }
        this.currentImgUrl = this.imagesUrl[this.currentImgNumber];
    }

    handleReview() {
        this.template.querySelector('lightning-tabset').activeTabValue = '1';
        this.template.querySelector('c-comment-review').refresh();
    }

    handleCartAmount(event){
        if(event.target.value <= 0){
            this.cartAmount = 1;
            this.template.querySelector('input').value = 1;
        } else{
            this.cartAmount = event.target.value;
        }
    }

    handleDelete(event){
        eval("$A.get('e.force:refreshView').fire();");
    }
}