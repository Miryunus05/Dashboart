import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Spin } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, editProduct } from '../redux/product/ProductSlice';
import { RootState, AppDispatch } from '../redux/store';

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  rate: number;
  price: number;
  color: string;
  size: string;
}

const productSchema = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  rate: Joi.number().required(),
  price: Joi.number().required(),
  color: Joi.string().required(),
  size: Joi.string().required()
});

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { value: products, isLoading } = useSelector((state: RootState) => state.product);
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (product: Product) => {
    setSelectProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async (): Promise<void> => {
    if (!selectProduct) return;
  
    try {
      const { _id,  ...productData } = selectProduct; 
      const token = localStorage.getItem('token');
      if (!token) return;
  
      await dispatch(editProduct({
        _id: selectProduct._id,
        data: productData 
      }));
    } catch (error) {
      console.error('Error editing product:', error);
    }
  
    setIsModalOpen(false);
  };

  const handleChange = (changedValues: any) => {
    setSelectProduct((prevProduct) => ({
      ...prevProduct,
      ...changedValues
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchProduct());
    }
  }, [navigate, dispatch]);

  const handleCreate = async () => {
    try {
      const { error, value } = productSchema.validate(createForm.getFieldsValue());
      if (error) {
        console.error(error);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/products', value, {
        headers: { Authorization: token }
      });
      
      dispatch(fetchProduct());
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${id}`, {
        headers: { Authorization: token }
      });

      dispatch(fetchProduct());
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image: string) => <img width={100} src={image} alt="product" />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Edit',
      dataIndex: 'editOperation',
      render: (_: any, record: Product) => (
        <Typography.Link onClick={() => showModal(record)}>
          <p className='text-[#B88E2F]'>Edit</p>
        </Typography.Link>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'deleteOperation',
      render: (_: any, record: Product) => (
        <Typography.Link onClick={() => handleDelete(record._id)}>
          <p className='text-[#B88E2F]'>Delete</p>
        </Typography.Link>
      ),
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)}  className='bg-[#B88E2F]'>
        Create Product
      </Button>
      <Modal
        title="Create Product"
        visible={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={createForm}>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Subtitle" name="subtitle">
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Rate" name="rate">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Color" name="color">
            <Input />
          </Form.Item>
          <Form.Item label="Size" name="size">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Product"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={selectProduct || {}} onValuesChange={handleChange}>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Subtitle" name="subtitle">
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Rate" name="rate">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Color" name="color">
            <Input />
          </Form.Item>
          <Form.Item label="Size" name="size">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={isLoading}>
        <Table columns={columns} dataSource={products} rowKey="_id"/>
      </Spin>
    </div>
  );
};

export default ProductsPage;
