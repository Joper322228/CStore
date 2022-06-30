import { LightningElement, api, track, wire  } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import PRODUCT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import MARK_FIELD from '@salesforce/schema/Product2.Mark__c';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';
import AMOUNT_FIELD from '@salesforce/schema/Product2.Amount__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import CODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import setStandartPrice from '@salesforce/apex/PricebookEntryManagerForProduct.setStandartPricebook';
import getVersionFiles from '@salesforce/apex/uploadProductImages.getVersionFiles';

export default class EditProduct extends LightningElement {}