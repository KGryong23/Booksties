'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Input from 'antd/es/input/Input';
import Form, { FormProps } from 'antd/es/form';
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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { validate as isValidUUID } from 'uuid';
import { UpdateStatusOrder } from '@/utils/action/action';
import ModalItems from './modal.item';

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
        token: { borderRadiusLG,colorBgContainer },
      } = theme.useToken();
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const [form] = Form.useForm();
      const router = useRouter()
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IOrder) => record.order_id === editingKey;
      const [status,setStatus] = useState<string>('')
      const [userId,setUserId] = useState<string>('')
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
      const [orderId,setOrderId] = useState<string>()
      const [nameId,setNameId] = useState<string>()
      const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 6,
        },
        sortField:"",
        sortOrder:""
      });
    const showModal = (id :string,id_1 :string) => {
        setNameId(id_1)
        setOrderId(id)
        setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
     };
    const memoizedTableParams = useMemo(() => tableParams, [tableParams]);
    const buildQueryString = (check :boolean) => {
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
        if (status && check) queryParams.set('status', status);
        if (userId && check) queryParams.set("user_id",userId)
        return queryParams.toString();
    };
    const handleTableChange: TableProps<any>['onChange'] = (pagination, _ , sorter :any) => {
        setTableParams({
          pagination,
          sortOrder:sorter.order,
          sortField:sorter.field
        });
      };

      const edit = (record: Partial<IOrder> & { order_id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.order_id ?? '');
      };
    
      const cancel = () => {
        setEditingKey('');
      };
    
      const save = async (key: React.Key) => {
        try {
          setLoading(true)
          const row = (await form.validateFields()) as IOrder;
          const originalOrder = orders.find((order) => order.order_id === key);
          if (!originalOrder) {
               notification.error({
               message: "Lỗi",
               description: "Không tìm thấy sản phẩm tương ứng!",
               duration: 2,
               });
               setLoading(false);
               return;
          }
          if( originalOrder?.status !== row.status ){
             const result = await UpdateStatusOrder(originalOrder?.order_id!,row.status)
             if(result.code === 201){
                  notification.success({
                  message:"Update!!!",
                  description:"Cập nhật trạng thái thành công!!!",
                  duration:2
             })
             }else{
                  notification.error({
                  message:"Update!!!",
                  description:result.message,
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
            render: (text: string) => <a style={{fontSize:"1rem",color:"black"}}>{text ?? `Chưa có`}</a>,
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
          title: 'Cập nhật',
          dataIndex: 'operation',
          render: (index: number, record: IOrder) => {
            const editable = isEditing(record);
            return editable ? (
              <div style={{display:'flex',gap:5}} key={index}>
                <Typography.Link onClick={() => save(record.order_id)} style={{ marginRight: 8 }}>
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
          title: 'Xem',
          dataIndex: 'check',
          render: (_: any, record: IOrder) => {
            return(
              <EyeOutlined onClick={()=>showModal(record.order_id,record.userId)}/>
            )
          },
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IOrder) => {
            return(
              <DeleteOutlined/>
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
    const handleSearchUserId=()=>{
       if(!isValidUUID(userId)){
         notification.error({
            message:"Cảnh báo!!!",
            description:"ID người dùng không hợp lệ!!!",
            duration:2
         })
         setUserId('')
       }else{
         router.push(`/order?${buildQueryString(true)}`);
       }
    }
    const handleChangeStatus=(value :string)=>{
      setStatus(value)
    }
    const handleDeleteStatus=()=>{
      setStatus("")
      setUserId("")
      router.push(`/order?${buildQueryString(false)}`);
    }
    const fetchData = async () => {
      await router.push(`/order?${buildQueryString(true)}`);
    };
    useEffect(() => {
      fetchData();
    }, [memoizedTableParams, status]);
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
             Quản lý đơn hàng
         </div>
         <div style={{
            background:colorBgContainer,
            borderRadius:"0.5rem",
            marginTop:"0.5rem",
         }}>
           <div style={{ display:'flex',padding:"1rem 0rem 1rem 1rem" }}>
            <div style={{ display:'flex',gap:'0.5rem',marginLeft:"15rem"}}>
               <div style={{ 
                  width:"7.7rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
               }}>
                 Theo trạng thái:
               </div>
               <Select
                  defaultValue={status}
                  style={{ width: "7rem" }}
                  onChange={handleChangeStatus}
                  options={[
                  { value: 'pending', label: `Đang xử lý` },
                  { value: 'shipped', label: 'Đang giao' },
                  { value: 'delivered', label: 'Đã giao' },
                  { value: 'cancelled', label: 'Bị hủy' },
                  ]}
               />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <div style={{marginLeft:"2rem",display:'flex',gap:'0.5rem', width:"auto"}}>
              <div style={{ 
                width:"9rem",
                marginTop:"0.3rem",
                fontSize:"1.1rem"
              }}>
                Tìm theo ID:
              </div>
              <Input style={{height:"2rem"}}  onChange={(e)=>setUserId(e.target.value)} value={userId} />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <Button style={{ marginLeft:"2rem" }} type='primary' onClick={handleSearchUserId}>Tìm kiếm</Button>
            <Button style={{ marginLeft:"1rem" }} type='default' onClick={handleDeleteStatus}>Clear</Button>
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
               dataSource={orders}
               rowKey={"order_id"}
               columns={mergedColumns}
               rowClassName="editable-row"
               pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100}}
               onChange={handleTableChange}
               />
            </Form>
         </div>
         { isModalOpen && (
          <ModalItems
             handleCancel={handleCancel}
             isModalOpenItems={isModalOpen}
             orderId={orderId}
             userId={nameId}
          />
         ) }
      </div>
    )
}
export default OrderApp