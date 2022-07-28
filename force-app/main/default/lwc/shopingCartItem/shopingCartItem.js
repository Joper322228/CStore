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
        if(event.target.value <= 0){
            let amount = 1;
            this.productAmount = 1;
            this.template.querySelector('input').value = 1;
        } else
        if(event.target.value >= 100){
            let amount = 99;
            this.productAmount = 99;
            this.template.querySelector('input').value = 99;
        } else{
            let amount = event.target.value;
            this.productAmount = event.target.value;
        }
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