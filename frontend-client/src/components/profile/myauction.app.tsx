'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Form from 'antd/es/form';
import Table, { TableProps } from 'antd/es/table';
import { TablePaginationConfig} from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import SelectOutlined from '@ant-design/icons/SelectOutlined'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import DrawerDetails from '../modal/drawer.details';
import ModalBid from '../modal/modal.bid';
import ModalCreateAuction from '../modal/modal.create.auction';
import { DeleteAuctionByUser } from '@/utils/action/action';
import { GetProp } from 'antd/es/_util/type';
import theme from 'antd/es/theme';
import Tag from 'antd/es/tag';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import Button from 'antd/es/button/button';

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

const MyAuctionApp=( { auctions } : { auctions : IAuction[] } )=>{
      const {
        token: { borderRadiusLG },
      } = theme.useToken();
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const [form] = Form.useForm();
      const router = useRouter()
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IAuction) => record.id === editingKey;
      const [filterBy,setFilterBy] = useState<string>('')
      const [openDrawer, setOpenDrawer] = useState(false);
      const [auctionDrawer,setAuctionDrawer] = useState<IAuction | null>(null)
      const [isModalOpenBid, setIsModalOpenBid] = useState<boolean>(false);
      const [isModalOpenCreate, setIsModalOpenCreate] = useState<boolean>(false);
      const [auctionBidId,setAuctionBidId] = useState<string>("")
      const showDrawer = (value :IAuction) => {
        setAuctionDrawer(value)
        setOpenDrawer(true);
      };

      const onCloseDrawer = () => {
        setAuctionDrawer(null)
        setOpenDrawer(false);
      };
      const showModalBid = (id :string) => {
        setAuctionBidId(id)
        setIsModalOpenBid(true);
      };
      const handleCancelBid = () => {
        setAuctionBidId('')
        setIsModalOpenBid(false);
      };
      const showModalCreate = () => {
        setIsModalOpenCreate(true);
      };
      const handleCancelCreate = () => {
        setIsModalOpenCreate(false);
      };
      const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 6,
        },
        sortField:"",
        sortOrder:""
      });
    const memoizedTableParams = useMemo(() => tableParams, [tableParams]);
    const buildQueryString = () => {
        const { pagination, sortOrder, sortField } = tableParams;
        const queryParams = new URLSearchParams();
    
        if (pagination?.current) queryParams.set('page', pagination.current.toString());
        if (pagination?.pageSize) queryParams.set('limit', pagination.pageSize.toString());
        if (filterBy) queryParams.set('filterBy', filterBy);
        return queryParams.toString();
    };
    const handleTableChange: TableProps<any>['onChange'] = (pagination, _ , sorter :any) => {
        setTableParams({
          pagination,
          sortOrder:sorter.order,
          sortField:sorter.field
        });
      };

    const columns = [
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
            editable: false,
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
          title: 'Chi tiết',
          dataIndex: 'check',
          render: (_: any, record: IAuction) => {
            return(
              <EyeOutlined onClick={()=>showDrawer(record)}/>
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
              <DeleteOutlined onClick={()=>handleDeleteAuction(record.id)}/>
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
    const handleChangeFilterBy=(value: string)=>{
       setFilterBy(value)
    }
    const handleDeleteAuction = async(id :string) => {
       const result = await DeleteAuctionByUser(id)
       if(result.code === 201){
         message.success("Xóa thành công")
       }else{
         message.error("Xóa thất bại,hãy thử lại sau 1h")
       }
    }
    const handleClearStatus=()=>{
      setFilterBy("")
      router.push(`/account/profile/myauction?${buildQueryString()}`);
    }
    const fetchData = () => {
      router.push(`/account/profile/myauction?${buildQueryString()}`);
    };
    useEffect(() => {
      fetchData();
    }, [memoizedTableParams,filterBy]);
    return(
        <div style={{ height:"auto",width:"70rem" }}>
           <div style={{ display:'flex',margin:"0 0 0.5rem 0rem"}}>
            <div style={{ display:'flex',gap:'0.6rem',fontSize:"1.1rem" }}>
            <div style={{ marginTop:"0.4rem" }}>Lọc:</div>  
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
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"1.3rem" }}></div>
            <Button style={{ marginLeft:"1rem" }} type='default' onClick={handleClearStatus}>Clear</Button>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"1.3rem" }}></div>
            <Button style={{ marginLeft:"1rem" }} onClick={showModalCreate} type='primary'>Tạo mới</Button>
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
        {
          openDrawer && auctionDrawer  && (
             <DrawerDetails
               auction={auctionDrawer}
               onClose={onCloseDrawer}
               open={openDrawer}
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
          isModalOpenCreate && (
            <ModalCreateAuction
               setIsModalOpen={setIsModalOpenCreate}
               setLoading={setLoading}
               handleCancel={handleCancelCreate}
               isModalOpen={isModalOpenCreate}
               loading={loading}
            />
          )
        }
      </div>
    )
}
export default MyAuctionApp