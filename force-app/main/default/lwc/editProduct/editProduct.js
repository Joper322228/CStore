import { LightningElement, api, track, wire  } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import PRODUCT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import MARK_FIELD from '@salesforce/schema/Product2.Mark__c';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';
import AMOUNT_FIELD from '@salesforce/schema/Product2.Amount__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import CODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import updateStandartPricebook from '@salesforce/apex/PricebookEntryManagerForProduct.updateStandartPricebook';
import getStandartPrice from '@salesforce/apex/PricebookEntryManagerForProduct.getStandartPrice';
import getVersionFiles from '@salesforce/apex/uploadProductImages.getVersionFiles';
import getProfileImageId from '@salesforce/apex/ManageProductImage.getProfileImageId';

export default class EditProduct extends LightningElement {
    @api recordId;

    fields = [NAME_FIELD, MARK_FIELD, FAMILY_FIELD, AMOUNT_FIELD, MODEL_FIELD, CODE_FIELD];
    productApi = PRODUCT;
    nameField = NAME_FIELD;
    familyField = FAMILY_FIELD;
    markField = MARK_FIELD;
    amountField = AMOUNT_FIELD;
    modelField = MODEL_FIELD;
    codeField = CODE_FIELD;
    standartPrice = undefined;
    idForProfileImage;
    loaded = false;
    @track files = [];
    @track fileList;;

    get acceptedFormats() {
        return ['.pdf','.png','.jpg'];
    }

    connectedCallback(){
        getStandartPrice({ productId : this.recordId })
        .then((result) => {
            this.standartPrice = result;
        })
        .catch((error) => {
            const evt = new ShowToastEvent({
                title: 'Sory we got unexpected error',
                message: 'Error message:' + error,
                variant: 'error',
            });
            this.dispatchEvent(evt);
            this.standartPrice = '';
        });
        getProfileImageId({ productId : this.recordId })
        .then((result) => {
            this.idForProfileImage = result;
        })
        .catch((error) => {
            const evt = new ShowToastEvent({
                title: 'Sory we got unexpected error',
                message: 'Error message:' + error,
                variant: 'error',
            });
            this.dispatchEvent(evt);
            this.idForProfileImage = '';
        })
        this.handleImages();
    }

    handleStandartPriceChange(event){
        this.standartPrice = event.target.value;
    }

    handleImages() {
        getVersionFiles({ recordId: this.recordId })
        .then((result) => {
            this.isLoaded = true;
            this.fileList = "";
            this.files = [];
            if (result) {
                this.fileList = result;
                for (let i = 0; i < this.fileList.length; i++) {
                    let file = {
                    Id: this.fileList[i].Id,
                    Title: this.fileList[i].Title,
                    Extension: this.fileList[i].FileExtension,
                    ContentDocumentId: this.fileList[i].ContentDocumentId,
                    ContentDocument: this.fileList[i].ContentDocument,
                    CreatedDate: this.fileList[i].CreatedDate,
                    IsProfile : false,
                    thumbnailFileCard:
                        "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                        this.fileList[i].Id +
                        "&operationContext=CHATTER&contentId=" +
                        this.fileList[i].ContentDocumentId,
                    downloadUrl:
                        "/sfc/servlet.shepherd/document/download/" +
                        this.fileList[i].ContentDocumentId
                    };
                    if(this.idForProfileImage == file.ContentDocumentId){
                        file.IsProfile = true;
                    }
                    this.files.push(file);
                }
                this.loaded = true;
                this.isLoaded = true;
            } else {
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Unexpected error",
                    variant: "error"
                    })
                );
            }
        })
        .catch((error)=>{
            this.dispatchEvent(
                new ShowToastEvent({
                title: "Error loading Files",
                message: error.body.message,
                variant: "error"
                })
            );
        })
    }

    handleSuccess(event) {
        this.isLoaded = true;
        updateStandartPricebook({ productId: this.recordId, newStandartPrice: this.standartPrice })
            .then((result) => {
                    const evt = new ShowToastEvent({
                        title: 'Product edited',
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
                    this.isLoaded = false;
            })
            .catch((error) => {
                const evt = new ShowToastEvent({
                    title: 'Please fill standart price field',
                    variant: 'error',
                });
                this.dispatchEvent(evt);
                this.isLoaded = false;
            })
            
    }

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        this.handleImages();
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success!",
            message: uploadedFiles.length + " Files Uploaded Successfully.",
            variant: "success"
          })
        );
    }

    handleUpdateList(event){
        this.handleImages();
    }

    handleUpdateProfileImage(event){
        this.idForProfileImage = event.detail;
        this.handleImages();
    }

    handleCloseModal(){ 
        var close = this.idForImage;
        const closeclickedevt = new CustomEvent('closeclicked', {
            detail: { close },
        });

        this.dispatchEvent(closeclickedevt); 
    }
}