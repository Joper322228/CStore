import { LightningElement, api, wire, track } from 'lwc';
import getProductDetails from '@salesforce/apex/CS_ProductDetailsController.getProductDetails';
import getProductImages from '@salesforce/apex/CS_ProductDetailsController.getProductImages';
import getRatingProduct from '@salesforce/apex/CS_ProductDetailsController.getRatingProduct';
import getProductPrice from '@salesforce/apex/CS_ProductDetailsController.getProductPrice';

export default class ProductDetails extends LightningElement {
    @api recordId;
    @track recordImages = [];
    @track imagesUrl = [];
    currentImgUrl;
    currentImgNumber = 0;
    ratingValue;
    priceValue;

    @wire (getProductDetails, {recordId : '$recordId'})
    recordDetails;

    @wire (getProductImages, {recordId : '$recordId'})
    getImages({error, data}){
        if(data){
            this.recordImages = data;
            for(let i = 0; i < data.length; i++){
                let url = "/sfc/servlet.shepherd/document/download/" +
                    data[i].ContentDocumentId;
                this.imagesUrl.push(url);
            }
            this.currentImgUrl = this.imagesUrl[0];
        }
    };

    @wire (getRatingProduct, {recordId : '$recordId'})
    getRating({error, data}){
        if(data){
            this.ratingValue = Math.round(data[0].expr0);
        } else{
            console.log(error);
        }
    }

    @wire (getProductPrice, {recordId : '$recordId'})
    getPrice({error, data}){
        if(data){
            if(data[0].expr0 == undefined){
                this.priceValue = data[1].expr0;
            } else{
                this.priceValue = data[0].expr0;
            }
        } else{
            console.log(error);
        }
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
}