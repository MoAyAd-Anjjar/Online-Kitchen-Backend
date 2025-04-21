export interface ICartType{
        user_id: string;
        username: string;
        cartList: IProduct[];
    
}
export interface IProduct {
    productname: string;
    productprice: number;
    productdescrpiton: string;
    productimage: string;
    product_id: string;
    product_category: string;
    quantity?: number|any;
  }

 export interface IFoodItem {
        id: number;
        name: string;
        price: string;
        category: string;
        description: string;
        image: string;
        rate?: number;
        
    }
    export interface IUser {
      username: string;
      password: string;
      email: string;
      userid: string |number;
      favoritefood?: [string|number];
      phone: number;
      uservalidateanswer: string;
      role: string;
    }