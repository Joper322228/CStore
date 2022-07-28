import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getKnowledgeRecord from '@salesforce/apex/CS_FaqListController.getKnowledgeRecord'

export default class FaqList extends LightningElement {
    @track listKnowledge = [];

    @wire(getKnowledgeRecord)
    wiredResulted(result){
        const{data, error} = result;
            if(data){
                let tempList = data;
                tempList.forEach(element => {
                    if(element.DataCategoryGroupName == 'FAQ'){
                        this.listKnowledge.push(element);
                    }
                });
            }
        if(error){
            const evt = new ShowToastEvent({
                title: 'Sory we got unexpected error',
                message: 'Error message:' + error,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }
}
