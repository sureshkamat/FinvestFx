import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MenuTable = () => {
  const [menuData, setMenuData] = useState([]);
  const [order, setOrder] = useState('');
  const [category, setCategory] = useState();
  
  const [editedPrice, setEditedPrice] = useState({});
  const [originalMenuData, setOriginalMenuData] = useState([]);

  
  useEffect(() => {
    const storedOriginalData = localStorage.getItem('originalMenuData');
    if (storedOriginalData) {
      setOriginalMenuData(JSON.parse(storedOriginalData));
    } else {
      fetchOriginalData();
    }
  }, []);

  const fetchOriginalData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data');
      setOriginalMenuData(response.data);
      localStorage.setItem('originalMenuData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching original data:', error);
    }
  };


  
  const fetchData = async () => {
    try {
      const params = {
        _sort: 'price',
        _order: order,
        category,
      };
      const response = await axios.get('http://localhost:3000/data', { params });
      setMenuData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [order, category]);

  const handleEdit = (itemId, price) => {
    setEditedPrice({ ...editedPrice, [itemId]: price });
  };
console.log(editedPrice);


  const handleSave = async (itemId) => {
    try {
      await axios.patch(`http://localhost:3000/data/${itemId}`, { price: editedPrice[itemId] });
      const updatedEditedPrice = { ...editedPrice };
      delete updatedEditedPrice[itemId];
      setEditedPrice(updatedEditedPrice);
      fetchData();

    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  
  const handleReset = async (itemId) => {
    const originalPrice = originalMenuData.find((item) => item.id === itemId).price;
    try {
      await axios.patch(`http://localhost:3000/data/${itemId}`, { price: originalPrice });
        const updatedEditedPrice = { ...editedPrice };
      delete updatedEditedPrice[itemId];
      setEditedPrice(updatedEditedPrice);
      fetchData();
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  return (
    <Box w="90%" m="auto">
      <Flex>
        <Select placeholder="Sort By Price" onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending order</option>
          <option value="desc">Descending order</option>
        </Select>
        <Select
          placeholder="Sort By Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="appetizer">appetizer</option>
              <option value="weird">weird</option>
              <option value="dessert">dessert</option>
              <option value="mains">mains</option>
              <option value="clone">clone</option>
        </Select>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Description</Th>
            <Th>Image</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {menuData.map((item) => (
            <Tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.category}</Td>
              <Td>
                {editedPrice[item.id] !== undefined ? (
                  <Input
                    value={editedPrice[item.id] || item.price}
                    onChange={(e) => handleEdit(item.id, e.target.value)}
                  />
                ) : (
                  item.price
                )}
              </Td>
              <Td>{item.description.slice(0, 50)}....</Td>
              <Td>
                <img src={item.image} width={100} alt={item.name} />
              </Td>
              <Td>
                {editedPrice[item.id] !== undefined ? (
                  <>
                    <Button onClick={() => handleSave(item.id)}>Save</Button>
                    <Button onClick={() => handleReset(item.id)}>Reset</Button>
                  </>
                ) : (
                  <Button onClick={() => {handleEdit(item.id, item.price) }}>Edit</Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MenuTable;
