import { LightningElement, wire, track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUserCases from '@salesforce/apex/CS_CaseHistoryController.getUserCases';
import getBaseUrl from '@salesforce/apex/CS_NewOrderController.getBaseUrl';
import NO_CASE from '@salesforce/resourceUrl/No_Case';

export default class CaseHistory extends LightningElement {

    @track userCases = [];
    isEmpty = false;
    noCase = NO_CASE;
    
    @wire(getUserCases, {})
    getCases({ error, data }) {
        if (data) {
            if(data.length <= 0){
                this.isEmpty = true;
            }
            this.userCases = data;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error in displaing case",
                    message: error.body,
                    variant: "error"
                })
            )
        }
    }

    handleDetails(event){
        let id = event.target.dataset.id;
        getBaseUrl({})
        .then((result) => {
            window.location.replace(result + '/s/case/' + id);
        })
    }
}