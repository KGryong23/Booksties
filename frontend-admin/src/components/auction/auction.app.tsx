'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Input from 'antd/es/input/Input';
import Form from 'antd/es/form';
import Typography from 'antd/es/typography';
import Table, { TableProps } from 'antd/es/table';
import EditOutlined from '@ant-design/icons/EditOutlined'
import { Button, GetProp, notification, Select,Tag,theme } from 'antd';
import { TablePaginationConfig} from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import FieldTimeOutlined from '@ant-design/icons/FieldTimeOutlined'
import SelectOutlined from '@ant-design/icons/SelectOutlined'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { UpdateStatusAuction } from '@/utils/action/action';
import ModalTime from './modal.time';
import ModalBid from './modal.bid';
import DrawerDetails from './drawer.details';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string | number;
  title: any;
  inputType: 'select' ;
  record: IProduct;
  index: number;
  children: React.ReactNode;
}
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let  inputNode = (
      <Select
       style={{ width:"7rem" }}
       options={[
          { value: 'Pending', label: `Xử lý` },
          { value: 'Upcoming', label: 'Chuẩn bị' },
          { value: 'Live', label: 'Cấp phép' }
       ]}
         />
    );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
};

const AuctionApp=( { auctions } : { auctions : IAuction[] } )=>{
      const {
        token: { borderRadiusLG,colorBgContainer },
      } = theme.useToken();
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const [form] = Form.useForm();
      const router = useRouter()
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IAuction) => record.id === editingKey;
      const [searchName,setSearchName] = useState<string>('')
      const [orderBy,setOrderBy] = useState<string>('')
      const [filterBy,setFilterBy] = useState<string>('')
      const [nameWinner,setNameWinner] = useState<string>('')
      const [nameSeller,setNameSeller] = useState<string>('')
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
      const [isModalOpenBid, setIsModalOpenBid] = useState<boolean>(false);
      const [auctionId,setAuctionId] = useState<string>("")
      const [auctionBidId,setAuctionBidId] = useState<string>("")
      const [openDrawer, setOpenDrawer] = useState(false);
      const [auctionDrawer,setAuctionDrawer] = useState<IAuction | null>(null)
      const showDrawer = (value :IAuction) => {
        setAuctionDrawer(value)
        setOpenDrawer(true);
      };

      const onCloseDrawer = () => {
        setAuctionDrawer(null)
        setOpenDrawer(false);
      };
      
      const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 6,
        },
        sortField:"",
        sortOrder:""
      });
    const showModal = (id :string) => {
        setAuctionId(id)
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setAuctionId('')
        setIsModalOpen(false);
    }; 
    const showModalBid = (id :string) => {
      setAuctionBidId(id)
      setIsModalOpenBid(true);
    };
    const handleCancelBid = () => {
      setAuctionBidId('')
      setIsModalOpenBid(false);
    };
    const memoizedTableParams = useMemo(() => tableParams, [tableParams]);
    const buildQueryString = (check :boolean) => {
        const { pagination, sortOrder, sortField } = tableParams;
        const queryParams = new URLSearchParams();
    
        if (pagination?.current) queryParams.set('page', pagination.current.toString());
        if (pagination?.pageSize) queryParams.set('limit', pagination.pageSize.toString());
        if (check){
          if (orderBy) queryParams.set('orderBy', orderBy);
          if (filterBy) queryParams.set('filterBy', filterBy);
          if (nameSeller) queryParams.set('seller', nameSeller);
          if (nameWinner) queryParams.set('winner', nameWinner);
          if (searchName) queryParams.set('searchTerm', searchName);
        } 
        return queryParams.toString();
    };
    const handleTableChange: TableProps<any>['onChange'] = (pagination, _ , sorter :any) => {
        setTableParams({
          pagination,
          sortOrder:sorter.order,
          sortField:sorter.field
        });
      };

      const edit = (record: Partial<IAuction> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id ?? '');
      };
    
    const cancel = () => {
        setEditingKey('');
    };
    
    const save = async (key: React.Key) => {
        try {
          setLoading(true)
          const row = (await form.validateFields()) as IAuction;
          const originalAuction = auctions.find((auction) => auction.id === key);
          if(row.status !== originalAuction?.status){
            try {
              const result = await UpdateStatusAuction(key.toString(),row.status)
              if(result.code === 201){
                notification.success({
                  message: "Thành công",
                  description: "Cập nhật trạng thái thành công",
                  duration: 2,
                });
              }else{
                notification.error({
                  message: "Thất bại",
                  description: "Cập nhật trạng thái thất bại",
                  duration: 2,
                });
              } 
            } catch (error) {
              notification.error({
                message:"Update!!!",
                description:"Bạn không có quyền !!!",
                duration:2
              })
            } 
          }
          setLoading(false)
          setEditingKey('');
        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }
    };
    
    const columns = [
        {
            title: 'Người bán',
            dataIndex: 'seller',
            render: (text: string) => <a style={{fontSize:"1rem",color:"#A52A2A"}}>{text}</a>,
            editable: false,
        },
        {
            title: 'Giá ban đầu',
            dataIndex: 'reservePrice',
            render: (text: number) => <a style={{fontSize:"1rem",color:"black"}}>{text?.toLocaleString('vi-VN')}</a>,
            editable: false,
        },
        {
            title: 'Giá hiện tại',
            dataIndex: 'currentHighBid',
            render: (text: number) => <a style={{fontSize:"1rem",color:"red"}}>{text !== null && text !== 0 ? text?.toLocaleString('vi-VN') : `Chưa có`}</a>,
            editable: false,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text: string) => {
                let string = ''
                let color = ''
                if(text === 'Pending'){
                  string = "Chờ xử lý"
                  color = "orange"
                }else if(text === 'Upcoming'){
                  string = "Chuẩn chị"
                  color = "blue"
                } else if (text === 'Live'){
                  string = "Đang diễn ra"
                  color = "green"
                } else if (text === 'Finished'){
                  string = "Hoàn thành"
                  color = "orange"
                } else if (text === "ReserveNotMet"){
                  string = "Chưa đạt"
                  color = "red"
                }
                return(
                  <Tag color={color}>
                     {string}
                  </Tag>  
                )
              },
            editable: true,
        },
        {
          title: 'Dự kiến kết thúc',
          dataIndex: 'auctionEnd',
          render: (text: string) => <a style={{fontSize:"1rem",color:"red"}}>
               {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
          </a>,
          editable: false,
        },
        {
          title: 'Cập nhật',
          dataIndex: 'operation',
          render: (index: number, record: IAuction) => {
            const editable = isEditing(record);
            return editable ? (
              <div style={{display:'flex',gap:5}} key={index}>
                <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                   <CheckOutlined />
                </Typography.Link>
                <div onClick={cancel}>
                   <CloseOutlined />
                </div>
              </div>
            ) : (
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                 <EditOutlined />
              </Typography.Link>
            );
          },
        },
        {
          title: 'Chi tiết',
          dataIndex: 'check',
          render: (_: any, record: IAuction) => {
            return(
              <EyeOutlined onClick={()=>showDrawer(record)}/>
            )
          },
        },
        {
          title: 'Thời gian',
          dataIndex: 'time',
          render: (_: any, record: IAuction) => {
            return(
              <FieldTimeOutlined onClick={()=>showModal(record.id)}/>
            )
          },
        },
        {
          title: 'Giá thầu',
          dataIndex: 'bid',
          render: (_: any, record: IAuction) => {
            return(
              <SelectOutlined onClick={()=>showModalBid(record.id)}/>
            )
          },
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IAuction) => {
            return(
              <DeleteOutlined/>
            )
          },
        },
    ];
    const mergedColumns: TableProps<IAuction>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: IAuction) => {
              let inputNode = "select";
              return {
              record,
              inputType: inputNode,
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
              }
            },
        };
    });
    const handleChangeOrderBy=(value: string)=>{
       setOrderBy(value)
    }
    const handleChangeFilterBy=(value: string)=>{
       setFilterBy(value)
    }
    const handleSearch=()=>{
      router.push(`/auction?${buildQueryString(true)}`);
    }
    const handleClearStatus=()=>{
      setOrderBy("")
      setFilterBy("")
      setNameSeller("")
      setNameWinner("")
      setSearchName("")
      router.push(`/auction?${buildQueryString(false)}`);
    }
    const fetchData = () => {
      router.push(`/auction?${buildQueryString(false)}`);
    };
    useEffect(() => {
      fetchData();
    }, [memoizedTableParams]);
    return(
        <div style={{ height:"auto" }}>
         <div style={{
            width:"100%",
            borderRadius:"0.5rem",
            background:colorBgContainer,
            height:"7vh",
            padding:"0.7rem",
            fontSize:"1.5rem"
         }}>
             Quản lý đấu giá
         </div>
         <div style={{
            background:colorBgContainer,
            borderRadius:"0.5rem",
            marginTop:"0.5rem",
         }}>
           <div style={{ display:'flex',gap:'1rem',width:"100%",paddingTop:"1rem" }}>
            <div style={{ marginLeft:"2.2rem",display:'flex',gap:'0.5rem', width:"auto" }}>
              <div style={{ 
                width:"12rem",
                marginTop:"0.3rem",
                fontSize:"1.1rem",
              }}>
                Tên người bán:
              </div>
              <Input style={{height:"2rem"}}  onChange={(e)=>setNameSeller(e.target.value)} value={nameSeller} />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <div style={{marginLeft:"2rem",display:'flex',gap:'0.5rem', width:"auto"}}>
              <div style={{ 
                width:"19rem",
                marginTop:"0.3rem",
                fontSize:"1.1rem"
              }}>
                Tên người chiến thắng:
              </div>
              <Input style={{height:"2rem"}}  onChange={(e)=>setNameWinner(e.target.value)} value={nameWinner} />
            </div>
           </div>
           <div style={{ display:'flex',padding:"0rem 0rem 1rem 1rem",marginTop:"1rem" }}>
           <div style={{ display:'flex',gap:'0.5rem',marginLeft:"2rem"}}>
               <div style={{ 
                  width:"6.8rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
               }}>
                 Sắp xếp theo:
               </div>
               <Select
                  defaultValue={orderBy}
                  style={{ width: "9rem" }}
                  onChange={handleChangeOrderBy}
                  options={[
                    { value: 'new', label: `Mới nhất`},
                    { value: 'endingSoon', label: 'Sắp kết thúc'},
                    { value: 'highBid', label: 'Giá đặt tốt nhất'},
                  ]}
               />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <div style={{ display:'flex',gap:'0.5rem',marginLeft:"2rem"}}>
               <div style={{ 
                  width:"7.7rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
               }}>
                 Theo trạng thái:
               </div>
               <Select
                  defaultValue={filterBy}
                  style={{ width: "7rem" }}
                  onChange={handleChangeFilterBy}
                  options={[
                    { value: 'pending', label: `Chờ xử lý`},
                    { value: 'upcoming', label: 'Chuẩn bị'},
                    { value: 'live', label: 'Đã diễn ra'},
                    { value: 'finished', label: 'Hoàn thành'},
                    { value: 'reserveNotMet', label: 'Chưa đạt'},
                  ]}
               />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <div style={{marginLeft:"2rem",display:'flex',gap:'0.5rem', width:"auto"}}>
              <div style={{ 
                width:"7rem",
                marginTop:"0.3rem",
                fontSize:"1.1rem"
              }}>
                Theo tên:
              </div>
              <Input style={{height:"2rem"}}  onChange={(e)=>setSearchName(e.target.value)} value={searchName} />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <Button style={{ marginLeft:"2rem" }} type='primary' onClick={handleSearch}>Tìm kiếm</Button>
            <Button style={{ marginLeft:"1rem" }} type='default' onClick={handleClearStatus}>Clear</Button>
           </div>
            <Form form={form} component={false}>
               <Table
               components={{
                  body: {
                  cell: EditableCell,
                  },
               }}
               style={{
                 paddingRight:"0.2rem",
                 borderRadius:borderRadiusLG,
               }}
               loading={loading}
               dataSource={auctions}
               rowKey={"id"}
               columns={mergedColumns}
               rowClassName="editable-row"
               pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100}}
               onChange={handleTableChange}
               />
            </Form>
         </div>
         {
          isModalOpen && (
            <ModalTime
               auctionId={auctionId}
               handleCancel={handleCancel}
               isModalOpenTime={isModalOpen}
               setIsModalOpenTime={setIsModalOpen}
            />
          )
         }
         {
          isModalOpenBid && (
            <ModalBid
               auctionId={auctionBidId}
               handleCancel={handleCancelBid}
               isModalOpenBid={isModalOpenBid}
               setIsModalOpenBid={setIsModalOpenBid}
            />
          )
         }
         {
          openDrawer && auctionDrawer && (
            <DrawerDetails
               onClose={onCloseDrawer}
               open={openDrawer}
               auction={auctionDrawer}
            />
          )
         }
      </div>
    )
}
export default AuctionApp