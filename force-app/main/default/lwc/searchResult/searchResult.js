import { LightningElement } from 'lwc';
import getSearchedProducts from '@salesforce/apex/CS_ProductSearchComunityController.getSearchedProducts';

export default class SearchResult extends LightningElement {
    name;
    model;
    mark;
    products = [];
    pageNumber = 0;
    pageRecords = 4;
    maxPages = 0;
    pageData = [];
    pageNumberForPrint = 1;
    currentPage = 0;
    isDisplay = false;
    isLoading = false;
    isEmpty = true;

    get isLast(){
        if(this.pageNumber == (this.maxPages - 1)){
            return true;
        } else{
            return false;
        }
    }
    
    get isFirst(){
        if(this.pageNumber == 0){
            return true;
        } else{
            return false;
        }
    }

    connectedCallback(){
        this.products = JSON.parse(sessionStorage.getItem('search--products'));
        if(this.products.length <= 0){
            this.isEmpty = true;
        } else{
            this.isEmpty = false;
        }
        this.updatePage();
        this.isDisplay = true;
    }

    handleName(event) {
        this.name = event.detail.value;
    }

    handleModel(event) {
        this.model = event.detail.value;
    }

    handleMark(event) {
        this.mark = event.detail.value;
    }

    handleSearch(){
        this.isLoading = true;
        getSearchedProducts({ productName: this.name, model: this.model, mark: this.mark })
        .then((result) => {
            this.products = result;
            if(this.products.length <= 0){
                this.isEmpty = true;
            } else{
                this.isEmpty = false;
            }
            this.pageNumber = 0;
            this.pageNumberForPrint = 1;
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
            this.isLoading = false;
        })
    }

    updatePage(){
        this.pageData = this.products.slice(this.pageNumber*this.pageRecords, this.pageNumber*this.pageRecords+this.pageRecords);
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
        this.pageNumber = Math.min(Math.round((this.products.length-(this.pageRecords - 1))/this.pageRecords), this.pageNumber + 1);
        this.pageNumberForPrint = this.pageNumber + 1;
        this.updatePage()
    }

    handleLast() {
        this.pageNumber = Math.round((this.products.length-(this.pageRecords - 1))/this.pageRecords);
        this.pageNumberForPrint = this.pageNumber + 1;
        this.updatePage();
    }

    handleMaxPages(){
        this.maxPages = Math.round((this.products.length-(this.pageRecords - 1))/this.pageRecords) + 1;
    }

}