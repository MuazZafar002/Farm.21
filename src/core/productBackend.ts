import axios from "axios";
import { IProduct } from "../interfaces/product";
import { KeyUtils } from "../constants/Utils/KeyUtils";
import { DataUtils } from "../constants/Utils/DataUtils";

let token: string;

// Assuming you have a function to retrieve the bearer token
DataUtils.getData(KeyUtils.keys.bearerToken).then(response => {
  if (response) {
    token = response;
  }
});

const baseURL = 'https://farm-21-api.onrender.com';
// const baseURL = 'https://farm-21-api-production.up.railway.app'

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  Attachments: File[];
}


// Function to fetch list of products
export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await axios.get<{products:IProduct[]}>(`${baseURL}/api/product`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string): Promise<string> => {
    try {
      const response = await axios.delete(`${baseURL}/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        return 'Product successfully deleted';
      } else if (response.status === 401) {
        return 'Unauthorized access';
      } else if (response.status === 404) {
        return 'Product not found';
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting Product:', error);
      throw error;
    }
  };
  export const createProduct = async (
    name: string,
    desc: string,
    price: string,
    contact:string,
    images: string[]
  ): Promise<string> => {
    try {
      const formData = new FormData();
  
      // Append product details as string values
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('price', price);
      formData.append('phone',contact);
      images.forEach((image,index)=>{
        formData.append('Attachments',{
          uri:image,
          name: `image${index}.jpeg`,
          type: 'image/jpeg',
        })
      })
      const response = await axios.post(`${baseURL}/api/product`, formData, {
        headers: {
          "Content-Type" : "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        return 'Product created successfully';
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };