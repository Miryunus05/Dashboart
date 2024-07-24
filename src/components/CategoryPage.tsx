import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory } from '../redux/category/CategorySlice';
import { RootState, AppDispatch } from '../redux/store'; 

interface Category {
  _id: string;
  image: string;
  name: string;
}

const categorySchema = Joi.object({
  image: Joi.string().required(),
  name: Joi.string().required(),
});

const Categories: React.FC = () => {
  const categories = useSelector((state: RootState) => state.category.value);
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectCategory, setSelectCategory] = useState<Partial<Category> | null>(null);
  const [form, setForm] = useState<Partial<Category>>({
    image: '',
    name: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchCategory());
    }
  }, [navigate, dispatch]);

  const showModal = (category: Category) => {
    setSelectCategory(category);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    if (!selectCategory) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token!,
      };
      const data = {
        name: selectCategory.name,
        image: selectCategory.image,
      };
      await axios.put(
        `https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${selectCategory._id}`,
        data,
        {
          headers: headers,
        }
      );
      dispatch(fetchCategory());
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      const { error } = categorySchema.validate(form);
      if (error) {
        console.error(error);
        return;
      }
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token!,
      };
      const data = {
        name: form.name,
        image: form.image,
      };
      await axios.post(
        'https://ecommerce-backend-fawn-eight.vercel.app/api/categories',
        data,
        {
          headers: headers,
        }
      );
      dispatch(fetchCategory());
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token!,
      };
      await axios.delete(
        `https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${id}`,
        {
          headers: headers,
        }
      );
      dispatch(fetchCategory());
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image: string) => <img width={100} src={image} alt="category" />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Edit',
      dataIndex: 'editOperation',
      render: (_: any, record: Category) => (
        <Typography.Link onClick={() => showModal(record)}>
          <p className='text-[#B88E2F]'>Edit</p>
        </Typography.Link>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'deleteOperation',
      render: (_: any, record: Category) => (
        <Typography.Link onClick={() => handleDelete(record._id)}>
          <p className='text-[#B88E2F]'>Delete</p>
        </Typography.Link>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        className="mb-4 bg-[#B88E2F]"
      >
        Create Category
      </Button>
      <Modal
        title="Create Category"
        visible={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
      >
        <Form>
          <Form.Item label="Image">
            <Input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Name">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Category"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Name">
            <Input
              placeholder="Name"
              value={selectCategory?.name || ''}
              onChange={handleChange}
              name="name"
            />
          </Form.Item>
          <Form.Item label="Image">
            <Input
              placeholder="Image"
              value={selectCategory?.image || ''}
              onChange={handleChange}
              name="image"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={categories} />
    </div>
  );
};

export default Categories;
