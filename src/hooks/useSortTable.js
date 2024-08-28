import { useState } from 'react';

export default function useSortTable(fieldValue = 'id', orderValue = 'asc') {
  const [sortField, setSortFieldValue] = useState(fieldValue);
  const [order, setOrderValue] = useState(orderValue);

  const setSortField = (filed) => {
    setSortFieldValue(filed);
  };

  const setOrder = (order) => {
    setOrderValue(order);
  };

  return {
    sortField,
    order,
    setSortField,
    setOrder,
  };
}
