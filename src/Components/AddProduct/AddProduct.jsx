import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";

const AddProduct = () => {

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    sizes: [{ name: '', quantity: 0 }],
  });

  const AddProduct = async () => {

    let dataObj;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    await fetch(`${backend_url}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((resp) => resp.json())
      .then((data) => { dataObj = data });

    if (dataObj.success) {
      product.image = dataObj.image_url;
      await fetch(`${backend_url}/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => { data.success ? alert("Product Added") : alert("Failed") });

    }
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  }
  
 
  const sizeChangeHandler = (e, index) => {
    const { name, value } = e.target;
    const newSizes = productDetails.sizes.map((size, idx) => {
      if (index === idx) {
        return { ...size, [name]: value };
      }
      return size;
    });
    setProductDetails({ ...productDetails, sizes: newSizes });
  };

  const addSizeField = () => {
    setProductDetails({
      ...productDetails,
      sizes: [...productDetails.sizes, { name: '', quantity: '' }],
    });
  };

  const removeSizeField = (index) => {
    const newSizes = productDetails.sizes.filter((_, idx) => index !== idx);
    setProductDetails({ ...productDetails, sizes: newSizes });
  };
  const increaseQuantity = (index) => {
    const newSizes = productDetails.sizes.map((size, idx) => {
      if (index === idx) {
        return { ...size, quantity: parseInt(size.quantity) + 1 };
      }
      return size;
    });
    setProductDetails({ ...productDetails, sizes: newSizes });
  };

  const decreaseQuantity = (index) => {
    const newSizes = productDetails.sizes.map((size, idx) => {
      if (index === idx && size.quantity > 0) {
        return { ...size, quantity: parseInt(size.quantity) - 1 };
      }
      return size;
    });
    setProductDetails({ ...productDetails, sizes: newSizes });
  };
  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input type="text" name="name" value={productDetails.name} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input type="text" name="description" value={productDetails.description} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="number" name="old_price" value={productDetails.old_price} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="number" name="new_price" value={productDetails.new_price} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select value={productDetails.category} name="category" className="add-product-selector" onChange={changeHandler}>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
        <p>Product Colour</p>
        <select value={productDetails.colour} name="colour" className="add-product-selector" onChange={changeHandler}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="orange">Orange</option>
          <option value="pink">Pink</option>
          <option value="purple">Purple</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
    
  </div>

  <div className="addproduct-itemfield">
        <p>Sizes</p>
        {productDetails.sizes.map((size, index) => (
          <div key={index} className="size-quantity-field">
            <select
              value={size.name}
              name="name"
              onChange={(e) => sizeChangeHandler(e, index)}
            >
              <option value="">Select size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
            <div className="quantity-field">
              <button type="button" onClick={() => decreaseQuantity(index)}>
                -
              </button>
              <input
                type="number"
                name="quantity"
                value={size.quantity}
                onChange={(e) => sizeChangeHandler(e, index)}
                placeholder="0"
                min="0"
              />
              <button type="button" onClick={() => increaseQuantity(index)}>
                +
              </button>
            </div>
            <button type="button" className="remove-button" onClick={() => removeSizeField(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addSizeField}>
          Add Size
        </button>
      
</div>

<div className="addproduct-itemfield">
        <p>Product image</p>
        <label htmlFor="file-input">
          <img className="addproduct-thumbnail-img" src={!image ? upload_area : URL.createObjectURL(image)} alt="" />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" name="image" id="file-input" accept="image/*" hidden />
      </div>
      <button className="addproduct-btn" onClick={() => { AddProduct() }}>ADD</button>
    </div>
  );
};

export default AddProduct;
