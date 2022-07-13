import { LightningElement, api, wire } from 'lwc';

export default class ProductCard extends LightningElement {
    @api product;

    get detailsUrl(){
        return 'https://computerstore-developer-edition.eu44.force.com/s/product/Product2/' +
            this.product.Id;
    }
}