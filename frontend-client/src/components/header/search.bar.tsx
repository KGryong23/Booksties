'use client'
import { GetAllTitle, GetAllTitleAuction } from '@/utils/action/action';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import AutoComplete, { AutoCompleteProps } from 'antd/es/auto-complete';
import Button from 'antd/es/button/button';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce'; 

const SearchBar = ({
  onChange,
  searchValue,
  handleSearch,
  setSearch
}: {
  onChange: (e: string) => void;
  searchValue: string;
  handleSearch: ()=>void;
  setSearch:(v :any)=>void;
}) => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [data, setData] = useState<ITitle[]>([]);
  const [dataAuction,setDataAuction] = useState<ITitle[]>([])
  const handleGetDataAuction = async() => {
    const result = await GetAllTitleAuction()
    if(result.code === 201){
       setDataAuction(result.data)
    } 
  }

  const handleGetData = async () => {
    const result = await GetAllTitle();
    if (result.code === 201) {
      setData(result.data);
    }
  };
  const fetchSuggestions = useCallback(
    debounce((searchText: string) => {
      if (!searchText.trim()) {
        setOptions([]);
        return;
      }
      const isAuctionPage =
        typeof window !== 'undefined' && window.location.pathname.includes('/auctions');

      const activeData = isAuctionPage ? dataAuction : data;
      const filteredOptions = activeData
        .filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()))
        .map((item) => ({
          value: item.title,
          label: item.title,
      }));
    
      setOptions(filteredOptions);
    }, 300),
    [data,dataAuction]
  );
  const onSearch = (text: string) => {
    fetchSuggestions(text);
  };

  useEffect(() => {
    handleGetData();
    handleGetDataAuction()
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '0.5rem',
        border: '2px solid #ccc',
        borderRadius: '999px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        height: '3rem',
      }}
    >
      <AutoComplete
        options={options}
        style={{ width: '55rem',fontSize:"1rem" }}
        onSearch={onSearch}
        onChange={onChange}
        value={searchValue}
        placeholder="Tìm kiếm ở đây"
        allowClear
        variant='borderless'
      />
      <Button
        type="primary"
        shape="circle"
        icon={<SearchOutlined />}
        size="large"
        onClick={handleSearch}
        style={{
          marginLeft: '0.5rem',
          backgroundColor: '#F87171',
          border: 'none',
        }}
      />
    </div>
  );
};

export default SearchBar;
