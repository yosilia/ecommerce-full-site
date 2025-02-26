import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';
import sortablejs from 'react-sortablejs';
import styled from 'styled-components';

const FormContainer = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
    padding: 2.5rem;
  }
`;

const LeftSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: 0.2s ease-in-out;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const PhotoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PhotoBox = styled.div`
  height: 8rem;
  width: 8rem;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const UploadBox = styled.label`
  width: 6rem;
  height: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e5e7eb;
  }

  svg {
    width: 2.5rem;
    height: 2.5rem;
    color: #6b7280;
  }

  span {
    font-size: 0.75rem;
    color: #6b7280;
  }

  input {
    display: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #1f2937;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #374151;
  }
`;

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  photos: existingPhotos,
  category: assignedCategory,
  features: assignedFeatures,
  stock: existingStock = 0,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [category, setCategory] = useState(assignedCategory || '');
  const [itemFeatures, setItemFeatures] = useState(assignedFeatures || {});
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [stock, setStock] = useState(existingStock || 0);
  const [photos, setPhotos] = useState(existingPhotos || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);
  // Function to handle saving products
  async function saveProduct(event) {
  event.preventDefault();
  setError(""); // Clear previous errors
  setSuccessMessage(""); // Clear success messages

  const data = {
    title,
    description,
    price,
    stock,
    photos,
    category,
    features: itemFeatures,
  };

  try {
    let response;

    if (_id) {
      response = await axios.put("/api/products", { ...data, _id });
    } else {
      response = await axios.post("/api/products", data);
    }

    if (response.status === 201 || response.status === 200) {
      setSuccessMessage("Product saved successfully!");
      setTimeout(() => setGoToProducts(true), 1500); // Redirect after success
    }
  } catch (error) {
    console.error("Error saving product:", error);

    // Show error message from API response
    setError(error.response?.data?.error || "Something went wrong. Please try again.");
  }
}

// Only redirect if no errors occurred
if (goToProducts) {
  router.push("/admin/products");
}

  // Function to handle uploading photos
  async function uploadPhotos(event) {
    const files = event.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setPhotos((oldPhotos) => [...oldPhotos, ...res.data.links]);
      setIsUploading(false);
    }
  }
  function updatePhotosOrder(photos) {
    setPhotos(photos);
  }

  function setItemProp(propName, value) {
    setItemFeatures((prev) => {
      const newItemProps = { ...prev };
      newItemProps[propName] = value;
      return newItemProps;
    });
  }

  const featuresToFill = [];
  if (categories.length > 0 && category) {
    let categoryInfo = categories.find(({ _id }) => _id === category);
    featuresToFill.push(...categoryInfo.features);
    while (categoryInfo?.parent?._id) {
      const parentCategory = categories.find(
        ({ _id }) => _id === categoryInfo?.parent?._id
      );
      featuresToFill.push(...parentCategory.features);
      categoryInfo = parentCategory;
    }
  }

return (
  <FormContainer onSubmit={saveProduct}>
    {/* Left Section */}
    <LeftSection>
      <Title>{existingTitle ? "Edit Item" : "New Item"}</Title>

      <Label>Item Name</Label>
      <Input
        type="text"
        placeholder="Enter item name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <Label>Category</Label>
      <Select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((x) => <option key={x._id} value={x._id}>{x.name}</option>)}
      </Select>

      {featuresToFill.length > 0 &&
        featuresToFill.map((x) => (
          <div key={x.name}>
            <Label>{x.name?.[0]?.toUpperCase() + x.name?.substring(1)}</Label>
            <Select value={itemFeatures[x.name]} onChange={(ev) => setItemProp(x.name, ev.target.value)}>
              {x.values.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </Select>
          </div>
        ))}
    </LeftSection>

    {/* Right Section */}
    <RightSection>
      <Label>Photos</Label>
      <PhotoContainer>
        <ReactSortable list={photos} setList={updatePhotosOrder} className="flex flex-wrap gap-1">
          {!!photos?.length &&
            photos.map((link) => (
              <PhotoBox key={link}>
                <img src={link} alt="Uploaded Image" />
              </PhotoBox>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <UploadBox>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
            />
          </svg>
          <span>Upload</span>
          <input type="file" onChange={uploadPhotos} />
        </UploadBox>
      </PhotoContainer>

      <Label>Description</Label>
      <TextArea placeholder="Enter description" value={description} onChange={(ev) => setDescription(ev.target.value)} />

      <Label>Price (in £)</Label>
      <Input type="number" placeholder="Enter price" value={price} onChange={(ev) => setPrice(ev.target.value)} />

      <Label>Stock Level</Label>
      <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      {successMessage && <p style={{ color: "green", fontSize: "14px" }}>{successMessage}</p>}
      <SubmitButton type="submit">Save</SubmitButton>
    </RightSection>
  </FormContainer>
);
}
