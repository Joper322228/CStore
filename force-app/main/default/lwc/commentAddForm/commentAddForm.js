import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Product_Comment__c.Name';
import TEXT_FIELD from '@salesforce/schema/Product_Comment__c.Comment_Text__c';
import Id from '@salesforce/user/Id';
import getCommentForUser from '@salesforce/apex/CS_CommentReviewController.getCommentForUser';

export default class CommentAddForm extends LightningElement {
    @api productId;
    userId = Id;
    nameField = NAME_FIELD;
    commentField = TEXT_FIELD;
    rating = 0;
    labelSubject = 'Subject';
    labelRating  = 'Rating';
    isCommentForApprove = true;
    commentsToUser;
    isLoading = false;

    connectedCallback(){
        this.getComment();
    }

    @api
    refresh(){
        this.getComment();
    }

    // @wire(getCommentForUser, {productId: '$productId', userId: '$userId'})
    getComment(){
        getCommentForUser({productId: this.productId, userId: this.userId})
        .then((result) => {
            console.log(result);
            this.commentsToUser = result;
            if(this.commentsToUser > 0){
                this.isCommentForApprove = true;
            } else{
                this.isCommentForApprove = false;
            }
            console.log(this.isCommentForApprove);
        })
        .catch((error) => {
            const toast = new ShowToastEvent({
                title: 'Unexpected error',
                message: error,
                variant: 'error',
            });
            this.dispatchEvent(toast);
        })
                
    }

    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }
    
    handleSubmit(event) {
        this.isLoading = true;
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.User__c = this.userId;    
        fields.Product__c = this.productId; 
        fields.Is_Approved__c = false; 
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const toast = new ShowToastEvent({
            title: 'Thank you for your opinion',
            message: 'Please wait until your comment will be approved',
            variant: 'success',
        });
        this.dispatchEvent(toast);
        this.isCommentForApprove = true;
        this.isLoading = false;
        console.log(this.isCommentForApprove);
        
    }

    handleError(event) {
        this.getComment();
        this.isLoading = false;
    }

    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
        this.isLoading = false;
     }
}