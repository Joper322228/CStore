import { LightningElement, api } from 'lwc';
import getProductComments from '@salesforce/apex/CS_CommentReviewController.getProductComments';
import deleteComment from '@salesforce/apex/CS_CommentReviewController.deleteComment';
import Id from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/Product_Comment__c.Name';
import TEXT_FIELD from '@salesforce/schema/Product_Comment__c.Comment_Text__c';


export default class CommentReview extends LightningElement {
    @api productId;
    productReviews;
    isLoading;
    isDisplay = false;
    userId = Id;
    nameField = NAME_FIELD;
    commentField = TEXT_FIELD;
    commentIdForDelete;
    commentIdForEdit;
    openDeleteModal = false;
    openEditModal = false;
    ratingForEdit;

    connectedCallback(){
        this.getReviews();
    }

    get reviewsToShow() {
        return this.productReviews !== undefined && this.productReviews != null && this.productReviews.length > 0;
    }
    
    @api
    refresh() {
        this.getReviews();
    }
    
    getReviews() {
        if (this.productId) {
            this.isLoading = true;
            getProductComments({productId: this.productId})
            .then((result) => {
                this.productReviews = result;
                if(result.length > 0){
                    this.isDisplay = true;
                } else{
                    this.isDisplay = false;
                }
                this.isLoading = false;

                for(let i = 0; i < this.productReviews.length; i++){
                    if(this.productReviews[i].CreatedById == this.userId){
                        this.productReviews[i].isOwner = true;
                    } else{
                        this.productReviews[i].isOwner = false;
                    }
                }
            }).catch((error) => {
                console.log(error);
            })
        } else {
            return;
        }
    }

    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }
    
    handleOpenDeleteModal(event){
        this.commentIdForDelete = event.target.dataset.id;
        this.openDeleteModal = true;
    }

    handleCloseDeleteModal(){
        this.openDeleteModal = false;
    }

    handleDelete(){
        console.log(this.commentIdForDelete);
        this.handleCloseDeleteModal();
        deleteComment({commentId: this.commentIdForDelete})
        .then((result) => {
            this.getReviews();
            const createReviewEvent = new CustomEvent('deletereview');
            this.dispatchEvent(createReviewEvent);       
        }).catch((error) => {
            console.log(error);
        })
    }

    handleOpenEditModal(event){
        this.commentIdForEdit = event.target.dataset.id;
        this.ratingForEdit = event.target.name;
        this.openEditModal = true;
    }

    handleCloseEditModal(){
        this.openEditModal = false;
    }

    handleEdit(){
        this.handleCloseEditModal();
        this.getReviews();
        const toast = new ShowToastEvent({
            title: 'Your commnent was edited',
            message: 'Please wait until your comment will be approved',
            variant: 'success',
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.Is_Approved__c = false;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
}