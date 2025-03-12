import Button from "@/Components User/Button";
import { CartContext } from "@/Components User/CartContext";
import Center from "@/Components User/Center";
import Header from "@/Components User/Header";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import StylingTable from "@/Components User/StylingTable";
import { Input } from "@/Components User/CommonStyles";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 40px;
    margin-top: 40px;

`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductImageStyling = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 150px;
    height: 150px;
    padding: 10px;
    backhround-color: #f9f9f9;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justifu-content: center;
    img { 
    max-width: 130px;
    max-height: 130px;
    }
`;

const QuantityLabel = styled.span`
    padding: 0 6px;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        console.log("cartProducts:", cartProducts);
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts })
                .then(response => {
                    console.log("API Response:", response.data); // Debug API response
                    setProducts(response.data);
                });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);
    
    useEffect(() => { 
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, []);


    function addingMoreProducts(id) {
        addProduct(id);
    }

    function removingProducts(id) {
        removeProduct(id);
    }

    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name,
            email,
            phone,
            streetAddress,
            country,
            city,
            postcode,
            cartProducts,
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    }


    let total = 0;
    for(const productId of cartProducts) {
        const price = products.find(product => product._id === productId)?.price || 0;
        total+=price;
    }

    if (isSuccess) {
        return (
            <>
            <Header/>
            <Center>
                <ColumnsWrapper>
                <Box>
                  <h2>Order completed successfully!</h2>  
                  <p> We will email you when your order will be sent.</p>
                </Box>
                </ColumnsWrapper>
            </Center>
            </>
        )
    }


  return (
    <>
      <Header /> 
      <Center>
       <ColumnsWrapper>
      <Box>
        <h2>Your Cart</h2>
        {!cartProducts?.length && (
            <p>Your cart is empty</p>
        )}
        {products?.length > 0 && (
        <StylingTable>
        <thead>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
        </thead>
        <tbody>
         {products.map(product => (
                <tr key={product._id}>
                <ProductImageStyling>
                    <ProductImageBox>
                    <img src={product.photos[0]} alt=''/>
                    </ProductImageBox>
                    {product.title}
                    </ProductImageStyling>
                <td>
                    <Button onClick={() => removingProducts(product._id)}>-</Button> 
                    <QuantityLabel>
                     {cartProducts.filter(id => id === product._id).length}      
                    </QuantityLabel>
                    <Button onClick={() => addingMoreProducts(product._id)}>+</Button>
                </td>
                <td>
                £{cartProducts.filter(id => id === product._id).length * product.price}
                </td>
                </tr>
            ))}
            <tr>
                <td></td>
                <td></td>
                <td>£{total}</td>
            </tr>
            <>          
            </>           
        </tbody>
        </StylingTable>
        )}
      </Box>
      {!!cartProducts?.length > 0 && (
        <Box>
                <h2>Order Information</h2>
                <Input 
                type="text" 
                placeholder="Name" 
                value={name}
                name="name"
                onChange={e => setName(e.target.value)}
                />
                <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                name="email"
                onChange={e => setEmail(e.target.value)}
                />
                <Input 
                type="tel"  
                placeholder="Phone" 
                value={phone}
                name="phone"
                onChange={e => 
                    {const inputValue = e.target.value; 
                    const isValidPhone = inputValue.startsWith("+") 
                    ? /^\+\d*$/.test(inputValue) // If it starts with "+", ensure only digits follow
                    : /^\d*$/.test(inputValue);  // Otherwise, allow only digits
                        if (isValidPhone) {
                            setPhone(inputValue);
                        }
                        }} />
                <CityHolder>
                <Input 
                type="text" 
                placeholder="Street Address" 
                value={streetAddress}
                name="streetAddress"
                onChange={e => setStreetAddress(e.target.value)}
                />
                <Input 
                type="text" 
                placeholder="Country" 
                value={country}
                name="country"
                onChange={e => setCountry(e.target.value)}
                />  
                </CityHolder>
                <Input 
                type="text" 
                placeholder="City" 
                value={city}
                name="city"
                onChange={e => setCity(e.target.value)}
                />
                <Input 
                type="text" 
                placeholder="Postcode" 
                value={postcode}
                name="postcode"
                onChange={e => setPostcode(e.target.value)}
                />
                <Button block onClick={goToPayment}>Continue to payment</Button>   
            </Box>
      )}
      </ColumnsWrapper> 
      </Center>
        
    </>
  );
}
