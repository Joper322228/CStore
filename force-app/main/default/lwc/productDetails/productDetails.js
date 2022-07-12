import { LightningElement, api, wire, track } from 'lwc';
import getProductDetails from '@salesforce/apex/CS_ProductDetailsController.getProductDetails';
import getProductImages from '@salesforce/apex/CS_ProductDetailsController.getProductImages';

export default class ProductDetails extends LightningElement {
    @api recordId;
    @track recordImages = [];
    @track imagesUrl = [];
    currentImgUrl;
    currentImgNumber = 0;

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

    handleNext(){
        if(this.currentImgNumber != (this.imagesUrl.length - 1)){
            this.currentImgNumber += 1;
        }
        this.currentImgUrl = this.imagesUrl[this.currentImgNumber];
        this.detailsUrlBuilder();
    }

    handlePrev(){
        if(this.currentImgNumber != 0){
            this.currentImgNumber -= 1;
        }
        this.currentImgUrl = this.imagesUrl[this.currentImgNumber];
        this.detailsUrlBuilder();
    }
}