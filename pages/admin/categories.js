import Layout from '@/Components Admin/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import styled from 'styled-components';
import InputStyling from '@/Components User/InputStyling';
const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
  color: #374151;
`;

const Form = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
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

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: none;
  color: white;
  margin-right: 8px;

  ${({ variant }) =>
    variant === "primary"
      ? `background-color: #1f2937; &:hover { background-color: #374151; }`
      : variant === "default"
      ? `background-color: white; color: #1f2937; border: 1px solid #d1d5db; &:hover { background-color: #f3f4f6; }`
      : `background-color: #b91c1c; &:hover { background-color: #991b1b; }`}
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 1rem;
`;

const TableHeader = styled.thead`
  background-color: #1f2937;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.875rem;
`;

const TableHeadCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 0.875rem;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
`;

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      features: features.map((f) => ({
        name: f.name,
        values: f.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setFeatures([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setFeatures(
      category.features.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    );
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name} category?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async (result) => {
        // when confirmed and promise resolved...
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete('/api/categories?_id=' + _id);
          fetchCategories();
        }
      });
  }

  function addFeature() {
    setFeatures((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  }
  function handleFeatureNameChange(index, feature, newName) {
    setFeatures((prev) => {
      const features = [...prev];
      features[index].name = newName;
      return features;
    });
  }
  function handleFeatureValueChanges(index, feature, newValues) {
    setFeatures((prev) => {
      const features = [...prev];
      features[index].values = newValues;
      return features;
    });
  }
  function removeFeature(indexToRemove) {
    setFeatures((prev) => {
      return [...prev].filter((f, fIndex) => {
        return fIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <Title>Categories</Title>
      <Label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create new Category"}
      </Label>
      <Form onSubmit={saveCategory}>
        <FlexContainer>
          <Input
            type="text"
            placeholder="Category Name"
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <Select onChange={(ev) => setParentCategory(ev.target.value)} value={parentCategory}>
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </Select>
        </FlexContainer>

        <div>
          <Label>Properties</Label>
          <Button type="button" variant="default" onClick={addFeature}>
            Add new property
          </Button>
          {features.length > 0 &&
            features.map((feature, index) => (
              <FlexContainer key={index}>
                <Input
                  type="text"
                  value={feature.name}
                  onChange={(ev) =>
                    handleFeatureNameChange(index, feature, ev.target.value)
                  }
                  placeholder="Feature name (e.g., color)"
                />
                <Input
                  type="text"
                  value={feature.values}
                  onChange={(ev) =>
                    handleFeatureValueChanges(index, feature, ev.target.value)
                  }
                  placeholder="Values (comma separated)"
                />
                <Button type="button" variant="danger" onClick={() => removeFeature(index)}>
                  Remove
                </Button>
              </FlexContainer>
            ))}
        </div>

        <FlexContainer>
          {editedCategory && (
            <Button
              type="button"
              variant="default"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setFeatures([]);
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            Save
          </Button>
        </FlexContainer>
      </Form>

      {!editedCategory && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadCell>Category Name</TableHeadCell>
              <TableHeadCell>Parent Category</TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category?.parent?.name || "None"}</TableCell>
                  <TableCell>
                    <Button onClick={() => editCategory(category)} variant="default">
                      Edit
                    </Button>
                    <Button onClick={() => deleteCategory(category)} variant="danger">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </tbody>
        </Table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => <Categories swal={swal} />);