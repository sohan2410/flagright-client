import { Tag } from "./Tag";

export interface Address {
    /** Address lines of the user's residence address */
    addressLines: string[];
    /** Post code of the user's residence address */
    postcode?: string;
    /** City of the user's residence address */
    city: string;
    /** State of the user's residence address */
    state?: string;
    /** User's country of residence */
    country: string;
    /** Type of the address (ex - Residential, Postal, etc.) */
    addressType?: string;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}