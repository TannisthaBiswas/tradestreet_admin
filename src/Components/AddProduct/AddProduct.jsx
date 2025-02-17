import React, { useState } from "react";
import "./AddProduct.css";
import { backend_url } from "../../App";

export default function ProductUpload() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    new_price: "",
    old_price: "",
    colour: "",
    sizes: [{ name: "", quantity: 0 }],
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...files],
    }));
    setPreviewImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // Handle input change for text fields
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle size changes dynamically
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...product.sizes];
    updatedSizes[index][field] = field === "quantity" ? Number(value) : value;
    setProduct({ ...product, sizes: updatedSizes });
  };

  // Add new size field
  const addSizeField = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: [...prevProduct.sizes, { name: "", quantity: 0 }],
    }));
  };

  // Remove size field
  const removeSizeField = (index) => {
    const updatedSizes = [...product.sizes];
    updatedSizes.splice(index, 1);
    setProduct({ ...product, sizes: updatedSizes });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (key === "images") {
        product.images.forEach((image) => formData.append("images", image));
      } else if (key === "sizes") {
        product.sizes.forEach((size, index) => {
          formData.append(`sizes[${index}][name]`, size.name);
          formData.append(`sizes[${index}][quantity]`, size.quantity);
        });
      } else {
        formData.append(key, product[key]);
      }
    });

    try {
      const res = await fetch(`${backend_url}/addproduct`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload product");
      const data = await res.json();
      alert("Product added successfully!");
      console.log(data);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="addproduct">
     <form onSubmit={handleSubmit} className="space-y-4">
    <div className="addproduct-itemfield">
    <p>Product Title</p>
    <input type="text" name="name" placeholder="Product Name" onChange={handleChange}  />
    </div>
      <div className="addproduct-itemfield">
      <p>Product Description</p>
      <input type="text" name="description" placeholder="Description" onChange={handleChange}  />
      
      </div>
      
      {/* Category Dropdown */}
      <div className="addproduct-itemfield">
      <p>Category</p>
      <select name="category" onChange={handleChange} className="add-product-selector" >
        <option value="">Select</option>
        <option value="women">Women</option>
        <option value="men">Men</option>
        <option value="kid">Kid</option>
      </select>
      </div>

      {/* Colour Dropdown */}

      <div className="addproduct-itemfield">
      <p>Colour</p>
      <select name="colour" onChange={handleChange} className="add-product-selector" >
        <option value="">Select</option>
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
      {/* Price Fields */}
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
      <input type="number" name="new_price" placeholder="Discounted Price" onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="number" name="old_price" placeholder="Original Price" onChange={handleChange} className="w-full p-2 border rounded" />
</div>
</div>
      {/* Dynamic Sizes Input */}
      <div className="addproduct-itemfield">
        <p>Sizes</p>
        {product.sizes.map((size, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Size"
              value={size.name}
              onChange={(e) => handleSizeChange(index, "name", e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={size.quantity}
              onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
            {index > 0 && (
              <button type="button" onClick={() => removeSizeField(index)} className="text-red-500">
                ❌
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSizeField} className="text-blue-500">
          + Add Size
        </button>
      </div>

      {/* Image Upload */}
      <div className="addproduct-itemfield"><p>Product Image</p></div>
      

      <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
      <div className="addproduct-itemfield">
      
        {previewImages.map((src, idx) => (
          <img key={idx} src={src} alt="Preview" className="addproduct-thumbnail-img" />
        ))}
      </div>

      {/* Submit Button */}
      <button type="submit" className="addproduct-btn">
        Create Product
      </button>
    </form>
  </div>
  );
}