'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Input from 'antd/es/input/Input';
import Form, { FormProps } from 'antd/es/form';
import Typography from 'antd/es/typography';
import Table, { TableProps } from 'antd/es/table';
import EditOutlined from '@ant-design/icons/EditOutlined'
import { TablePaginationConfig} from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import { validate as isValidUUID } from 'uuid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { GetProp } from 'antd/es/_util/type';
import Select, { LabeledValue } from 'antd/es/select';
import InputNumber from 'antd/es/input-number';
import theme from 'antd/es/theme';
import Tag from 'antd/es/tag';
import Button from 'antd/es/button/button';
import { CreateUser, DeleteUser, UpdateUser } from '@/utils/action/action';
import notification from 'antd/es/notification';
import ModalCreate from './modal.create';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string | number;
  title: any;
  inputType: 'select' | 'select_1' | 'text' | 'number' ;
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

const UserApp=( { users, roles } : { users : IUser[],roles :IRole[] } )=>{
      const {
        token: { borderRadiusLG,colorBgContainer },
      } = theme.useToken();
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const [form] = Form.useForm();
      const router = useRouter()
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IUser) => record.userId === editingKey;
      const [authMethod,setAuthMethod] = useState<string>('')
      const [email,setEmail] = useState<string>('')
      const [roleLabels,setRoleLabels] = useState<LabeledValue[]>([])
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
      const showModal = () => {
        setIsModalOpen(true);
      };
      const onFinish: FormProps<ICreateUser>["onFinish"] = async (values) => {
        setLoading(true)
        const result = await CreateUser(values)
        if(result.code === 201){
          notification.success({
            message:"Create success!!!",
            description:"Tạo mới thành công!!!",
            duration:2
          })
        } else{
          notification.error({
            message:"Create failed!!!",
            description:"Tạo mới không thành công!!!",
            duration:2
          })
        }
        setIsModalOpen(false);
        setLoading(false)
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
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
        let inputNode
          if (inputType === 'text') {
            inputNode = <Input />;
          } else if (inputType === 'select') {
            inputNode = (
              <Select
                options={[
                  { value: true, label: 'Hoạt động' },
                  { value: false, label: 'Không hoạt động' },
                ]}
              />
            );
        } else if(inputType === 'number'){
          inputNode = <InputNumber />;
        } else if (inputType === 'select_1'){
          inputNode = (
            <Select
              options={roleLabels}
            />
          );
        }
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
      const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 5,
        },
        sortField:"",
        sortOrder:""
      });
    const handleRoleLabels=()=>{
      const convertedData = roles.map(item => ({
        value: item.roleId,
        label: item.roleName
      }));
      setRoleLabels(convertedData)
    }
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
        if (check){
          if(authMethod) queryParams.set('authMethod', authMethod);
          if(email) queryParams.set('email', email);
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

      const edit = (record: Partial<IUser> & { userId: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.userId ?? '');
      };
    
    const cancel = () => {
        setEditingKey('');
    };
    
    const save = async (key: React.Key) => {
        try {
          setLoading(true)
          const row = (await form.validateFields()) as IUser;

          let roleId :string
          if(!isValidUUID(row.roleName)){
             const foundRole = roles.find((role) => role.roleName === row.roleName);
             roleId = foundRole?.roleId!
          }else{
             roleId = row.roleName
          }
          const result = await UpdateUser(key as string,row.address,row.isActive,roleId,row.reputation)
          if(result.code === 201){
            notification.success({
              message:"Update!!!",
              description:"Cập nhật thành công!!!",
              duration:2
            })
          }else{
            notification.error({
              message:"Update!!!",
              description:"Cập nhật thất bại!!!",
              duration:2
            })
          }
          setLoading(false)
          setEditingKey('');
        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }
    };
    
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text: string) => <a style={{fontSize:"1rem",color:"#A52A2A"}}>{text}</a>,
            editable: false,
        },
        {
            title:'Loại đăng nhập',
            dataIndex: 'authMethod',
            render: (text: number) => <a style={{fontSize:"1rem",color:"black"}}>{text?.toLocaleString('vi-VN')}</a>,
            editable: false,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (text: boolean) => {
                let string = ''
                let color = ''
                if(text){
                    string = "Hoạt động"
                    color = "green"
                }else if(!text){
                    string = "Hạn chế"
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
            title: 'Địa chỉ',
            dataIndex: 'address',
            render: (text: string) => <a style={{fontSize:"1rem",color:"#A52A2A"}}>{text ?? "Chưa có"}</a>,
            editable: true,
        },
        {
          title: 'Độ uy tín',
          dataIndex: 'reputation',
          render: (text: number) => <a style={{fontSize:"1rem",color:"red"}}>
               {text}
          </a>,
          editable: true,
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
            render: (text: string) => <a style={{fontSize:"1rem",color:"red"}}>
                 {text}
            </a>,
            editable: true,
          },
        {
          title: 'Cập nhật',
          dataIndex: 'operation',
          render: (index: number, record: IUser) => {
            const editable = isEditing(record);
            return editable ? (
              <div style={{display:'flex',gap:5}} key={index}>
                <Typography.Link onClick={() => save(record.userId)} style={{ marginRight: 8 }}>
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
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IUser) => {
            return(
              <DeleteOutlined onClick={()=>handleDeleteUser(record.userId)}/>
            )
          },
        },
    ];
    const mergedColumns: TableProps<IUser>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: IUser) => {
              let inputNode;
              if (col.dataIndex === 'isActive') {
                inputNode = "select";
              } else if (col.dataIndex === 'address'){
                inputNode = "text";
              } else if (col.dataIndex === 'roleName'){
                inputNode = 'select_1';
              } else if (col.dataIndex === 'reputation'){
                inputNode = 'number';
              }
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
    const handleDeleteUser = async (id:string) => {
       const result = await DeleteUser(id)
       if(result.code === 201){
        notification.success({
          message:"Delete!!!",
          description:"Xóa thành công!!!",
          duration:2
        })
      }else{
        notification.error({
          message:"Delete!!!",
          description:"Xóa thất bại!!!",
          duration:2
        })
      }
    }
    const handleChangeAuthMethod=(value :string)=>{
        setAuthMethod(value)
    }
    const handleSearch=()=>{
      router.push(`/user?${buildQueryString(true)}`);
    }
    const handleClearStatus=()=>{
      setEmail("")
      setAuthMethod("")
      router.push(`/user?${buildQueryString(false)}`);
    }
    const fetchData = () => {
      router.push(`/user?${buildQueryString(false)}`);
    };
    useEffect(() => {
      handleRoleLabels()
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
             Quản lý người dùng
         </div>
         <div style={{
            background:colorBgContainer,
            borderRadius:"0.5rem",
            marginTop:"0.5rem",
         }}>
           <div style={{ display:'flex',padding:"1rem 0rem 1rem 1rem",marginTop:"1rem" }}>
            <div style={{ display:'flex',gap:'0.5rem',marginLeft:"12rem"}}>
               <div style={{ 
                  width:"8.2rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
               }}>
                 Loại đăng nhập:
               </div>
               <Select
                  defaultValue={authMethod}
                  style={{ width: "7rem" }}
                  onChange={handleChangeAuthMethod}
                  options={[
                    { value: 'credentials', label: `Credentials`},
                    { value: 'github', label: 'Github'},
                    { value: 'google', label: 'Google'},
                  ]}
               />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <div style={{marginLeft:"2rem",display:'flex',gap:'0.5rem', width:"auto"}}>
              <div style={{ 
                width:"12rem",
                marginTop:"0.3rem",
                fontSize:"1.1rem"
              }}>
                Tìm theo email:
              </div>
              <Input style={{height:"2rem"}}  onChange={(e)=>setEmail(e.target.value)} value={email} />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
            <Button style={{ marginLeft:"2rem" }} type='primary' onClick={handleSearch}>Tìm kiếm</Button>
            <Button style={{ marginLeft:"1rem" }} type='default' onClick={handleClearStatus}>Clear</Button>
            <Button style={{ marginLeft:"1rem" }} type='primary' onClick={showModal}>Tạo mới</Button>
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
               dataSource={users}
               rowKey={"userId"}
               columns={mergedColumns}
               rowClassName="editable-row"
               pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100}}
               onChange={handleTableChange}
               />
            </Form>
         </div>
         {
          isModalOpen && (
            <ModalCreate
               handleCancel={handleCancel}
               handleOk={onFinish}
               isModalOpen={isModalOpen}
               loading={loading}
               roles={roles}
            />
          )
         }
      </div>
    )
}
export default UserApp