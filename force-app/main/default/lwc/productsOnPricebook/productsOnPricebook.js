import { LightningElement, wire, api} from 'lwc';
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
        })
    }
}