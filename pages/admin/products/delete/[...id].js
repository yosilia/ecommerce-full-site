import Layout from '../../../../componentsadmin/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
// This page is called by the server to render the delete confirmation page
export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();

  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id=' + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/admin/products');
  }
  async function deleteProduct() {
    await axios.delete('/api/products?id=' + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">
        {' '}
        Do you really want to delete &nbsp;"{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  );
}
