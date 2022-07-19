import { LightningElement, api } from 'lwc';
import updateAmount from '@salesforce/apex/CS_ShopingCartController.updateAmount';
import removeFromCart from '@salesforce/apex/CS_ShopingCartController.removeFromCart';

export default class ShopingCartItem extends LightningElement {
    @api
    productItem;
    productAmount;

    connectedCallback(){
        this.productAmount = this.productItem.Amount;
    }

    get subTotal(){
        return this.productAmount * this.productItem.Price;
    }
    
    handleQuantity(event){
        let amount = event.target.value;
        this.productAmount = event.target.value;
        updateAmount({recordId : this.productItem.Id, amount : amount})
            .then((result) => {
                this.dispatchEvent(new CustomEvent('updatedquantity'));

            })
            .catch((error) => {
                console.log(error);
            })
    }
    

    handleRemove(event){
        removeFromCart({recordId : this.productItem.Id})
            .then((result) =>{
                console.log('removed');
                this.dispatchEvent(new CustomEvent('delete'));
            })
            .catch((error) => {
                console.log(error);
            })
    }

}