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
import DESCRIPTION_FIELD from '@salesforce/schema/Product2.Description';
import setStandartPrice from '@salesforce/apex/PricebookEntryManagerForProduct.setStandartPricebook';
import getVersionFiles from '@salesforce/apex/uploadProductImages.getVersionFiles';



export default class CreateNewProduct extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api isLoaded = false;
    fields = [NAME_FIELD, MARK_FIELD, FAMILY_FIELD, AMOUNT_FIELD, MODEL_FIELD, CODE_FIELD];
    productApi = PRODUCT;
    nameField = NAME_FIELD;
    familyField = FAMILY_FIELD;
    markField = MARK_FIELD;
    amountField = AMOUNT_FIELD;
    modelField = MODEL_FIELD;
    codeField = CODE_FIELD;
    description = DESCRIPTION_FIELD;
    standartPrice = undefined;
    nameForPrint;
    isAddedPricebook = false;
    idForImage = '';
    idForProfileImage = '';
    loaded = false;
    @track files = [];
    @track fileList;

    get acceptedFormats() {
        return ['.pdf','.png','.jpg'];
    }

    handleStandartPriceChange(event){
        this.standartPrice = event.target.value;
    }

    handleNameForPrint(event){
        this.nameForPrint = event.target.value;
    }

    
    handleImages() {
        getVersionFiles({ recordId: this.idForImage })
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
        setStandartPrice({ newProductId: event.detail.id, standartPrice: this.standartPrice })
            .then((result) => {
                if(result == true){
                    const evt = new ShowToastEvent({
                        title: 'Product created',
                        message: 'Record Name: ' + this.nameForPrint,
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
                    this.idForImage = event.detail.id
                    this.isAddedPricebook = true;
                    this.isLoaded = false;
                }
            })
            .catch((error) => {
                const evt = new ShowToastEvent({
                    title: 'Please fill standart price field',
                    variant: 'error',
                });
                this.dispatchEvent(evt);
                this.isAddedPricebook = false;
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

    handleButtonChange(){ 
        if(this.files.length <= 5){
            var close = this.idForImage;
            const closeclickedevt = new CustomEvent('closeclicked', {
                detail: { close },
            });

            this.dispatchEvent(closeclickedevt); 
        } else{
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "You cant upload more than 5 images",
                  message: "Please delete images that you dont need",
                  variant: "Error"
                })
              );
        }
    }
}