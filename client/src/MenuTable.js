import {
    Box,
    Button,
    Flex,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MenuTable = () => {
  const [menuData, setMenuData] = useState([]);
  const [order,setOrder]=useState("");
  const [category,setCategory]=useState();

  const fetchData = async () => {
    try {
        const params={
            _sort:"price",
            _order:order,
            category
        }
      const response = await axios.get('http://localhost:3000/data',{params});
      setMenuData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [order,category]);




  

  return (
    <Box  w='80%'  m='auto'>
        <Flex>
            <Select placeholder='Sort By Price' onChange={(e)=>setOrder(e.target.value)} >
                <option value="asc">Ascending order</option>
                <option value='desc'>Descending order</option>
            </Select>
            <Select placeholder='Sort By Category' onChange={(e)=>setCategory(e.target.value)} >
              <option value="appetizer">appetizer</option>
              <option value="weird">weird</option>
              <option value="dessert">dessert</option>
              <option value="mains">mains</option>
              <option value="clone">clone</option>
            </Select>
        </Flex>
    <Table variant="simple">
      <Thead >
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
            <Td>{item.price}</Td>
            <Td>{item.description.slice(0,50)}....</Td>
            <Td><img src={item.image} width={100} /></Td>
            <Td><Button>Edit</Button></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    </Box>
  );
};

export default MenuTable;
