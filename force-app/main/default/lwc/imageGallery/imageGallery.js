import { LightningElement, api, wire } from 'lwc';
import getVersionFiles from '@salesforce/apex/uploadProductImages.getVersionFiles';
import getProfileImageId from '@salesforce/apex/ManageProductImage.getProfileImageId';

export default class ImageGallery extends LightningElement {
    @api recordId;
    @api objectApiName;
    files = [];
    fileList;
    idForProfileImage;
    
    connectedCallback(){
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

    handleUpdateList(event){
        this.handleImages();
    }

    handleUpdateProfileImage(event){
        this.idForProfileImage = event.detail;
        this.handleImages();
    }
}