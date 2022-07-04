import { LightningElement, api } from 'lwc';

export default class PreviewFileModal extends LightningElement {
    @api url;
    @api fileExtension;
    showFrame = false;
    showModal = false;
    @api show(){
        if(this.fileExtension === "pdf"){
            this.showFrame = false;
        }
        else{
            this.showFrame = false;
        }
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }
}