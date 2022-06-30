import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setProfileImage from '@salesforce/apex/ManageProductProfileImage.setProfileImage';

export default class PreviewFileThumbnailCard extends LightningElement {
    @api file;
    @api recordId;
    @api thumbnail;

    get iconName() {
        if (this.file.Extension) {
        if (this.file.Extension === "pdf") {
            return "doctype:pdf";
        }
        if (this.file.Extension === "ppt") {
            return "doctype:ppt";
        }
        if (this.file.Extension === "xls") {
            return "doctype:excel";
        }
        if (this.file.Extension === "csv") {
            return "doctype:csv";
        }
        if (this.file.Extension === "txt") {
            return "doctype:txt";
        }
        if (this.file.Extension === "xml") {
            return "doctype:xml";
        }
        if (this.file.Extension === "doc") {
            return "doctype:word";
        }
        if (this.file.Extension === "zip") {
            return "doctype:zip";
        }
        if (this.file.Extension === "rtf") {
            return "doctype:rtf";
        }
        if (this.file.Extension === "psd") {
            return "doctype:psd";
        }
        if (this.file.Extension === "html") {
            return "doctype:html";
        }
        if (this.file.Extension === "gdoc") {
            return "doctype:gdoc";
        }
        }
        return "doctype:image";
    }

    handleProfileImage(){
        setProfileImage({ recordId : this.recordId, url : this.file.downloadUrl })
        .then((result) =>  {
            const evt = new ShowToastEvent({
                title: 'Profile Image',
                message: 'Image ' + this.file.Title + ' is setted as profile',
                variant: 'success',
            });
            this.dispatchEvent(evt);
        })
        .catch((error) => {
            const evt = new ShowToastEvent({
                title: 'Sory we got unexpected error',
                message: 'Error message:' + error,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        })
    }

}