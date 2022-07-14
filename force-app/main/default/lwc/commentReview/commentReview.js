import { LightningElement, api } from 'lwc';
import getProductComments from '@salesforce/apex/CS_CommentReviewController.getProductComments';


export default class CommentReview extends LightningElement {
    @api productId;
    productReviews;
    isLoading;

    connectedCallback(){
        this.getReviews();
    }

    get reviewsToShow() {
        return this.productReviews !== undefined && this.productReviews != null && this.productReviews.length > 0;
    }
    
    @api
    refresh() {
        console.log('refresh');
        this.getReviews();
    }
    
    getReviews() {
        console.log('pizda');
        if (this.productId) {
            this.isLoading = true;
            getProductComments({productId: this.productId})
            .then((result) => {
                this.productReviews = result;
                this.isLoading = false;
            }).catch((error) => {
                console.log(error);
            })
        } else {
            return;
        }
    }
    
}