import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CASE from '@salesforce/schema/Case';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import ORDER_FIELD from '@salesforce/schema/Case.Order__c';
import PRODUCT_FIELD from '@salesforce/schema/Case.ProductId';
import REASON_FIELD from '@salesforce/schema/Case.Reason';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import getOrders from '@salesforce/apex/CS_NewCaseController.getOrders';
import getOrderedProducts from '@salesforce/apex/CS_NewCaseController.getOrderedProducts';
import setAssingmentRule from '@salesforce/apex/CS_NewCaseController.setAssingmentRule';
import getBaseUrl from '@salesforce/apex/CS_NewOrderController.getBaseUrl';

export default class NewCase extends LightningElement {

    caseApi = CASE;
    orderField = ORDER_FIELD;
    productField = PRODUCT_FIELD;
    reasonField = REASON_FIELD;
    descriptionField = DESCRIPTION_FIELD;
    subjectField = SUBJECT_FIELD;
    order;
    product;
    @track orderOptions;
    @track productOptions;
    isLoading = false;

    @wire(getOrders, {})
    getOrderPicklist({ error, data }) {
        this.isLoading = true;
        if (data) {
            this.orderOptions = data.map(order => {
                return {
                    label: 'Order: ' + order.OrderNumber,
                    value: order.Id
                };
            });
            this.isLoading = false;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Unexpected error",
                    message: error,
                    variant: "error"
                })
            );
            this.isLoading = false;
        }
    }

    getProductsOnOrder(event) {
        getOrderedProducts({ orderId: event.target.value })
            .then((result) => {
                this.productOptions = result.map(product => {
                    return {
                        label: product.Product2.Name,
                        value: product.Product2.Id
                    };
                })
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Unexpected error",
                        message: error,
                        variant: "error"
                    })
                );
            })
    }

    handleOrder(event) {
        this.order = event.target.value;
        this.getProductsOnOrder(event);
    }

    handleProduct(event) {
        this.product = event.target.value;
    }

    handleSubmit(event) {
        this.isLoading = true;
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Order__c = this.order;
        fields.ProductId = this.product;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Your case is created",
                variant: "success"
            })
        );
        setAssingmentRule({caseId : event.detail.id})
        .then((result) =>{
            getBaseUrl({})
            .then((result) => {
                this.isLoading = false;
                window.location.replace(result + '/s/case/' + event.detail.id);
            })
        })
        .catch((error) =>{
            console.log(error);
        })
    }
}