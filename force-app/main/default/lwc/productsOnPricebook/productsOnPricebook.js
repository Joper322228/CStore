import { LightningElement, wire, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProducts from '@salesforce/apex/CS_PricebookManagerController.getProducts';
import addProductsToPricebook from '@salesforce/apex/CS_PricebookManagerController.addProductsToPricebook';

const columns = [
    { label: 'Product name', fieldName: 'Name' },
    { label: 'Family', fieldName: 'Family' },
];

export default class ProductsOnPricebook extends LightningElement {
    @api pricebookId;
    columns = columns;
    products;
    isModalOpen;
    name;

    connectedCallback(){
        getProducts({ productName: this.name})
        .then((result) => {
            this.products = result;
        })
        .catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Unexpected error",
                  message: error,
                  variant: "Error"
                })
            );
        })
    }

    handleName(event) {
        this.name = event.detail.value;
    }

    handleSearch(){
        getProducts({ productName: this.name })
        .then((result) => {
            this.products = result;
        })
        .catch(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Unexpected error",
                  message: error,
                  variant: "Error"
                })
            );
        })
    }

    handleCloseModal(event){
        this.isModalOpen = false;

        const closeModal = new CustomEvent("closemodal", {
            detail: this.isModalOpen 
        });

        this.dispatchEvent(closeModal);
    }

    handleSaveProducts(event){
        let chosenProducts = this.template.querySelector("lightning-datatable").getSelectedRows();
        let Ids = [];
        for(let i = 0; i < chosenProducts.length; i++){
            Ids.push(chosenProducts[i].Id);
        }
        addProductsToPricebook({productIds: Ids, pricebookId: this.pricebookId})
        .then((result) => {
            this.handleCloseModal(event);
        })
        .catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                title: "This product is already in pricebook",
                variant: "error"
                })
            );
        })
    }
}