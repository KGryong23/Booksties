'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Form from 'antd/es/form';
import Table, { TableProps } from 'antd/es/table';
import { TablePaginationConfig} from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { GetProp } from 'antd/es/_util/type';
import theme from 'antd/es/theme';
import Tag from 'antd/es/tag';
import Select from 'antd/es/select';
import DrawerDetailsWinner from '../modal/drawer.details.winner';
import Popconfirm, { PopconfirmProps } from 'antd/es/popconfirm';
import { UpdateTransactionByWinner } from '@/utils/action/action';
import notification from 'antd/es/notification';
import ModalUpdateWinnerAddress from '../modal/modal.update.winner';

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

const WinBidApp=( { auctions } : { auctions : IAuctionWinner[] } )=>{
      const {
        token: { borderRadiusLG },
      } = theme.useToken();
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const [form] = Form.useForm();
      const router = useRouter()
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IAuctionWinner) => record.id === editingKey;
      const [openDrawer, setOpenDrawer] = useState(false);
      const [isModalOpenAddress, setIsModalOpenAddress] = useState<boolean>(false);
      const [auctionIdAddress,setAuctionIdAddress] = useState<string>('')
      const [address,setAddress] = useState<string | undefined>()
      const [auctionDrawer,setAuctionDrawer] = useState<IAuctionWinner | null>(null)
      const [auctionId,setAuctionId] = useState<string>("")
      const showDrawer = (value :IAuctionWinner) => {
        setAuctionDrawer(value)
        setOpenDrawer(true);
      };

      const onCloseDrawer = () => {
        setAuctionDrawer(null)
        setOpenDrawer(false);
      };
      const showModalAddress = (id :string,address :string) => {
        setAuctionIdAddress(id)
        setAddress(address)
        setIsModalOpenAddress(true);
      };
      const handleCancelAddress = () => {
        setAuctionIdAddress('')
        setAddress('')
        setIsModalOpenAddress(false);
      };
      const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 5,
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
        return queryParams.toString();
    };
    const handleTableChange: TableProps<any>['onChange'] = (pagination, _ , sorter :any) => {
        setTableParams({
          pagination,
          sortOrder:sorter.order,
          sortField:sorter.field
        });
      };
    const handleUpdateTransaction = async (status :string) => {
        const result = await UpdateTransactionByWinner(auctionId,status)
        if(result.code === 201){
          notification.success({
            message: "Thông báo",
            description: "Xác nhận đơn hàng thành công",
          })
        }else{
          notification.error({
            message: "Thông báo",
            description: "Xác nhận không thành công",
          })
        }
    }
    const confirm: PopconfirmProps['onConfirm'] = async (e) => {
        await handleUpdateTransaction("Completed")
    };
      
    const cancel: PopconfirmProps['onCancel'] = async (e) => {
        await handleUpdateTransaction("Cancelled")
    };
    const columns = [
        {
            title: 'Người bán',
            dataIndex: 'seller',
            render: (text: number) => <a style={{fontSize:"1rem",color:"black"}}>{text?.toLocaleString('vi-VN')}</a>,
            editable: false,
        },
        {
            title: 'Giá đã bán',
            dataIndex: 'soldAmount',
            render: (text: number) => <a style={{fontSize:"1rem",color:"red"}}>{text !== null && text !== 0 ? text?.toLocaleString('vi-VN') : `Chưa có`}</a>,
            editable: false,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'transactionStatus',
            render: (text: string) => {
                let string = ''
                let color = ''
                if(text === 'Pending'){
                  string = "Chờ xử lý"
                  color = "orange"
                }else if(text === 'Shipped'){
                  string = "Đang giao"
                  color = "blue"
                } else if (text === 'Live'){
                  string = "Đang diễn ra"
                  color = "green"
                } else if (text === 'Completed'){
                  string = "Giao thành công"
                  color = "orange"
                } else if (text === "Cancelled"){
                  string = "Bị hủy"
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
          title: 'Địa chỉ giao đến',
          dataIndex: 'shippingAddress',
          render: (text: string) => <a style={{fontSize:"1rem",color:"red"}}>
               {text ? text : "Chưa có"}
          </a>,
          editable: false,
        },
        {
          title: 'Cập nhật',
          dataIndex: 'update',
          render: (_: any, record: IAuctionWinner) => {
            return(
              <EditOutlined onClick={()=>showModalAddress(record.id,record.shippingAddress)}/>
            )
          },
          editable: false,
        },
        {
          title: 'Xác nhận',
          dataIndex: 'check',
          render: (_: any, record: IAuctionWinner) => {
            return(
              <Popconfirm
                title="Xác nhận đơn hàng"
                description="Bạn hãy kiểm tra hàng chắc chắn"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                  <CheckOutlined onClick={()=>setAuctionId(record.id)}/>
              </Popconfirm>
            )
          },
        },
        {
          title: 'Chi tiết',
          dataIndex: 'check',
          render: (_: any, record: IAuctionWinner) => {
            return(
              <EyeOutlined onClick={()=>showDrawer(record)}/>
            )
          },
        },
    ];
    const mergedColumns: TableProps<IAuctionWinner>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: IAuctionWinner) => {
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
    const fetchData = () => {
      router.push(`/account/profile/winbid?${buildQueryString()}`);
    };
    useEffect(() => {
      fetchData();
    }, [memoizedTableParams]);
    return(
        <div style={{ height:"auto",width:"70rem" }}>
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
               openDrawer && auctionDrawer && (
                <DrawerDetailsWinner
                  auction={auctionDrawer}
                  onClose={onCloseDrawer}
                  open={openDrawer}
                />
               )
            }
            {
              isModalOpenAddress && (
                <ModalUpdateWinnerAddress
                  address={address}
                  auctionId={auctionIdAddress}
                  handleCancel={handleCancelAddress}
                  isModalOpenAddressWinner={isModalOpenAddress}
                  setAddress={setAddress}
                  setAuctionId={setAuctionIdAddress}
                  setIsModalOpenAddressWinner={setIsModalOpenAddress}
                />
              )
            }
      </div>
    )
}
export default WinBidApp