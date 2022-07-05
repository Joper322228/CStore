import { LightningElement, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import getSearchedProducts from '@salesforce/apex/CS_SearchProductController.getSearchedProducts';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Family', fieldName: 'Family'},
    { label: 'Model', fieldName: 'Model__c'},
    { label: 'Mark', fieldName: 'Mark__c' },
    { label: 'Code', fieldName: 'ProductCode' },
    { label: 'Amount', fieldName: 'Amount__c' },
];


export default class SearchProduct extends LightningElement {
    @track foundedProducts;
    name;
    family;
    model;
    mark;
    code;
    isLoading = false;
    isFounded = false;
    columns = columns;
    pageNumber = 0;
    pageRecords = 5;
    maxPages = 0;
    pageData = [];
    pageNumberForPrint = 1;

    get options() {
        return [
            { label: 'CPU', value: 'CPU' },
            { label: 'GPU', value: 'GPU' },
            { label: 'Data Store', value: 'Data Store' },
            { label: 'Laptop', value: 'Laptop' },
            { label: 'Personal Computer', value: 'Personal Computer' },
            { label: 'Accessory', value: 'Accessory' },
        ];
    }

    get paginationOptions() {
        return [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
        ];
    }

    connectedCallback() {
        this.pageRecords = this.paginationOptions[0].value;
    }

    handleName(event) {
        this.name = event.detail.value;
    }

    handleFamily(event) {
        this.family = event.detail.value;
    }
    
    handleModel(event) {
        this.model = event.detail.value;
    }

    handleMark(event) {
        this.mark = event.detail.value;
    }

    handleCode(event) {
        this.code = event.detail.value;
    }

    handlePageRecords(event){
        this.pageRecords = event.detail.value;
        this.updatePage();
    }

    handleMaxPages(){
        this.maxPages = Math.round((this.foundedProducts.length-(this.pageRecords - 1))/this.pageRecords) + 1;
    }

    handleSearchButton(event){
        this.isLoading = true;
        getSearchedProducts({ productName: this.name, productFamily: this.family, model: this.model, mark: this.mark, code: this.code })
        .then((result) => {
            this.foundedProducts = result;
            this.isFounded = true;
            this.updatePage();
            this.isLoading = false;
        })
        .catch(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                title: "UnexpectedError",
                message: error.body.message,
                variant: "error"
                })
            );
            this.isFounded = false;
            this.isLoading = false;
        })
    }

    handleClearButton(event){
        this.name = undefined;
        this.family = undefined;
        this.model = undefined;
        this.mark = undefined;
        this.code = undefined;
        this.foundedProducts = [];
        this.isFounded = false;
    }

    updatePage(){
        this.pageData = this.foundedProducts.slice(this.pageNumber*this.pageRecords, this.pageNumber*this.pageRecords+this.pageRecords);
        this.handleMaxPages();
    }

    handlePrevious() {
        this.pageNumber = Math.max(0, this.pageNumber - 1);
        this.pageNumberForPrint = this.pageNumber + 1;
        this.updatePage();
      }

    handleFirst() {
        this.pageNumber = 0;
        this.pageNumberForPrint = this.pageNumber + 1;
        this.updatePage();
      }

    handleNext() {
        this.pageNumber = Math.min(Math.round((this.foundedProducts.length-(this.pageRecords - 1))/this.pageRecords), this.pageNumber + 1);
        this.pageNumberForPrint = this.pageNumber + 1;
        this.updatePage()
      }

    handleLast() {
        this.pageNumber = Math.round((this.foundedProducts.length-(this.pageRecords - 1))/this.pageRecords);
        this.pageNumberForPrint = this.pageNumber + 1;
        this.updatePage();
      }
}