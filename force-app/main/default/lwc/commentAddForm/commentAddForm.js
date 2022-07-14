import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Product_Comment__c.Name';
import TEXT_FIELD from '@salesforce/schema/Product_Comment__c.Comment_Text__c';
import Id from '@salesforce/user/Id';

export default class CommentAddForm extends LightningElement {
    @api productId;
    userId = Id;
    nameField = NAME_FIELD;
    commentField = TEXT_FIELD;
    rating = 0;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    
    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.User__c = this.userId;    
        fields.Product__c = this.productId; 
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const toast = new ShowToastEvent({
            title: 'Created comment',
            message: event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(toast);
        const createReviewEvent = new CustomEvent('createreview');
        this.dispatchEvent(createReviewEvent);  
        console.log('success');
    }
}