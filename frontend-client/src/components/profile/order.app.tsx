'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Form from 'antd/es/form';
import Table, { TableProps } from 'antd/es/table';
import { TablePaginationConfig} from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'

import EyeOutlined from '@ant-design/icons/EyeOutlined'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import ModalUpdateUserAddress from '../modal/modal.update.order.address';
import ModalItems from '../modal/modal.item';
import { OrderCancell } from '@/utils/action/action';
import { GetProp } from 'antd/es/_util/type';
import Select from 'antd/es/select';
import theme from 'antd/es/theme';
import notification from 'antd/es/notification';
import Tag from 'antd/es/tag';

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
         { value: 'pending', label: `Đang xử lý` },
         { value: 'shipped', label: 'Giao hàng' },
         { value: 'delivered', label: 'Đã giao' },
         { value: 'cancelled', label: 'Hủy hàng' },
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

const OrderApp=( { orders } : { orders : IOrder[] } )=>{
      const {
        token: { borderRadiusLG },
      } = theme.useToken();
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const [form] = Form.useForm();
      const router = useRouter()
      
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IOrder) => record.order_id === editingKey;
      const [isModalAddressOpen, setIsModalAddressOpen] = useState<boolean>(false);
      const [isModalItemOpen, setIsModalItemOpen] = useState<boolean>(false);
      const [orderItemId,setOrderItemId] = useState<string>()
      const [orderId,setOrderId] = useState<string>()
      const [address,setAddress] = useState<string>('')
      const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 6,
        },
        sortField:"",
        sortOrder:""
      });
    const showModalAddress = (record :IOrder) => {
        setOrderId(record.order_id)
        setAddress(record.full_address)
        setIsModalAddressOpen(true);
    };
    const handleCancelAddress = () => {
      setIsModalAddressOpen(false);
    };
    const showModalItem = (record :IOrder) => {
      setOrderItemId(record.order_id)
      setIsModalItemOpen(true);
    };
    const handleCancelItem = () => {
      setIsModalItemOpen(false);
    };
    const memoizedTableParams = useMemo(() => tableParams, [tableParams]);
    const buildQueryString = () => {
        const { pagination, sortOrder, sortField } = tableParams;
        const queryParams = new URLSearchParams();
        if (pagination?.current) queryParams.set('page', pagination.current.toString());
        if (pagination?.pageSize) queryParams.set('limit', pagination.pageSize.toString());
        if (sortOrder && sortOrder !== ''){
           if(sortOrder === 'ascend'){
             queryParams.set('order', 'asc');
           } else if (sortOrder === 'descend'){
            queryParams.set('order', 'desc');
           }
        } 
        if (sortField && sortField !== '')
           queryParams.set('field', sortField);
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
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            render: (text: string) => <a style={{fontSize:"1rem",color:"#A52A2A"}}>
               {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
            </a>,
            editable: false,
            sorter: (a :IOrder, b :IOrder)  => 0 
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'full_address',
            render: (text: string) => <a style={{
              fontSize:"1rem",
              color:"black",
              display: "inline-block",
              maxWidth:"10rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{text ?? `Chưa có`}</a>,
            editable: false,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            render: (text: number) => <a style={{fontSize:"1rem",color:"red"}}>{text.toLocaleString('vi-VN')}</a>,
            editable: false,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text: string) => {
                let string = ''
                let color = ''
                if(text === 'pending'){
                  string = "Đang xử lý"
                  color = "orange"
                }else if(text === 'shipped'){
                  string = "Đang giao"
                  color = "blue"
                } else if (text === 'delivered'){
                  string = "Đã giao"
                  color = "green"
                } else if (text === 'cancelled'){
                  string = "Đã hủy"
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
          title: 'Xem',
          dataIndex: 'check',
          render: (_: any, record: IOrder) => {
            return(
              <EyeOutlined onClick={()=>showModalItem(record)}/>
            )
          },
        },
        {
          title: 'Cập nhật',
          dataIndex: 'cancel',
          render: (_: any, record: IOrder) => {
            return(
              <EditOutlined style={{ marginLeft:"1.5rem" }} onClick={()=>showModalAddress(record)}/>
            )
          },
        },
        {
          title: 'Hủy',
          dataIndex: 'cancel',
          render: (_: any, record: IOrder) => {
            return(
              <CloseOutlined onClick={()=>handleCancelOrder(record)}/>
            )
          },
        },
    ];
    const mergedColumns: TableProps<IOrder>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: IOrder) => {
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
    const handleCancelOrder = async(record :IOrder) => {
      if(record.status !== "pending"){
        notification.error({
          message: "Failed",
          description: "Không cho phép hủy",
        })
        return
      }
        const result = await OrderCancell(record.order_id)
        if(result.code === 201){
          notification.success({
            message: "Thành công",
            description: "Hủy đơn thành công",
          })
        }else{
          notification.error({
            message: "Failed",
            description: "Hủy đơn không thành công",
          })
        }
    }
    const fetchData = async () => {
      await router.push(`/account/profile?${buildQueryString()}`);
    };
    useEffect(() => {
      fetchData();
    }, [memoizedTableParams]);
    return(
        <div style={{ height:"auto",width:"68rem" }}>
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
               dataSource={orders}
               rowKey={"order_id"}
               columns={mergedColumns}
               rowClassName="editable-row"
               pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100}}
               onChange={handleTableChange}
               />
           </Form>
           {
            isModalAddressOpen && (
              <ModalUpdateUserAddress
                address={address}
                handleCancel={handleCancelAddress}
                isModalOpenAddressOrder={isModalAddressOpen}
                orderId={orderId!}
                setAddress={setAddress}
                setIsModalOpenAddressOrder={setIsModalAddressOpen}
                setOrderId={setOrderId}
              />
            )
           }
           {
            isModalItemOpen && (
              <ModalItems
                handleCancel={handleCancelItem}
                isModalOpenItems={isModalItemOpen}
                orderId={orderItemId}
              />
            )
           }
      </div>
    )
}
export default OrderApp