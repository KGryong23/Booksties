'use client'

import Form, { FormProps } from "antd/es/form";
import Input from "antd/es/input/Input";
import Table, { TablePaginationConfig, TableProps } from "antd/es/table"
import Typography from "antd/es/typography";
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined'
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AddRole, DeletePermissionRole, DeleteRole, GetPermissionWithRole, UpdateRole } from "@/utils/action/action";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { GetProp } from "antd/es/_util/type";
import theme from "antd/es/theme";
import Button from "antd/es/button";
import notification from "antd/es/notification";
import ModalCreate from "./modal.create";
import ModalPermission from "./modal.permission";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType:'text';
  record: IRoleDetail;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = <Input />;
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
interface Iprops {
  roles:IRoleDetail[],
}
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

interface ICreateRole{
  roleName:string
}

const RoleApp=(props: Iprops)=>{
    const {
      token: { borderRadiusLG,colorBgContainer },
    } = theme.useToken();
    dayjs.extend(relativeTime);
    dayjs.locale('vi');
    const { roles } = props
    const [form] = Form.useForm();
    const [loading,setLoading] = useState<boolean>(false)
    const [editingKey, setEditingKey] = useState('');
    const [permissions,setPermissions] = useState<IPermission[]>([]);
    const [checkId,setCheckId] = useState<IRoleDetail>()
    const [roleName,setRoleName] = useState<string>("")
    const [isModalPermissionOpen, setIsModalPermissionOpen] = useState<boolean>(false);
    const [roleId,setRoleId] = useState<string>("")
    const router = useRouter();
    const isEditing = (record: IRoleDetail) => record.roleId === editingKey;
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          current: 1,
          pageSize: 5,
        },
        sortField:"",
        sortOrder:""
      });
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
    const showModalCreate = () => {
      setIsModalCreateOpen(true);
    };
    const handleCancelCreate = () => {
      setIsModalCreateOpen(false);
    };
    const showModalPermission = (id :string) => {
      setRoleId(id)
      setIsModalPermissionOpen(true);
    };
    const handleCancelPermission = () => {
      setRoleId("")
      setIsModalPermissionOpen(false);
    };
    const expandedRowRender = () => { 
      const columns = [
        {
          title: 'Tên',
          dataIndex: 'description',
          render:(text:string) => <a style={{color:"orange",fontSize:16}}>{text}</a>,
        },
        {
          title: 'Kí hiệu',
          dataIndex: 'permissionName',
          render:(text:string) => <a style={{color:"blue",fontSize:16}}>{text}</a>,
        },
        {
          title: 'Thời gian tạo',
          dataIndex: 'createdAt',
          render:(text:string) => <a style={{color:"green",fontSize:16}}>
             {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')} 
          </a>
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IPermission) => {
            return(
              <DeleteOutlined style={{color:'red'}} onClick={()=>handleDeletePermissionRole(record.permissionId)}/>
            )
          },
        },
      ];
      return (
        <Form form={form} component={false}>
            <Table
              bordered
              dataSource={permissions}
              columns={columns}
              rowKey={"permissionId"}
              pagination={false}
            />
        </Form>
      );
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
            queryParams.set('field', 'created_at');
        if(roleName && roleName !== "") queryParams.set('roleName', roleName);
        return queryParams.toString();
    };
    const handleTableChange: TableProps<any>['onChange'] = (pagination, _ , sorter :any) => {
        setTableParams({
          pagination,
          sortOrder:sorter.order,
          sortField:sorter.field
        });
      };
    const edit = (record: Partial<IRoleDetail> & { roleId: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.roleId ?? "");
    };
    const cancel = () => {
    setEditingKey('');
    };
    const save = async (key: React.Key) => {
        setLoading(true)
        const row = (await form.validateFields()) as IRoleDetail;
        const result = await UpdateRole(key as string,row.roleName)
        if(result.code === 201){
          notification.success({
           message:"Update!!!",
           description:"Cập nhật thành công!!!",
           duration:2
         })
        }else{
          notification.error({
           message:"Update!!!",
           description:"Cập nhật không thành công!!!",
           duration:2
         })
        }
        setEditingKey('');
        setLoading(false)
    };
    const columns = [
        { 
          title: 'Tên', 
          dataIndex: 'roleName',
          render:(text:string) => <a style={{color:"orange",fontSize:17}}>{text}</a>,
          editable: true,
        },
        { 
          title: 'Thời gian tạo', 
          dataIndex: 'createdAt',
          render:(text:string) => <a style={{color:"red",fontSize:16}}>
            {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
          </a>,
          sorter: (a :IRoleDetail, b :IRoleDetail)  => 0
        },
        { 
          title: 'Thời gian cập nhật', 
          dataIndex: 'updatedAt',
          render:(text:string) => <a style={{color:"green",fontSize:16}}>
            {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
          </a>
        },
        {
            title: 'Cập nhật',
            dataIndex: 'operation',
            render: (_: any, record: IRoleDetail) => {
              const editable = isEditing(record);
              return editable ? (
                <div style={{display:'flex',gap:4}}>
                  <Typography.Link onClick={() => save(record.roleId)} style={{ marginRight: 8 }}>
                    Lưu
                  </Typography.Link>
                  <div onClick={cancel}>
                    <a>Hủy</a>
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
          title: 'Thêm quyền', 
          render: (_: any, record: IRoleDetail) => {
            return(
              <PlusSquareOutlined onClick={()=>showModalPermission(record.roleId)}/>
            )
          },
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IRoleDetail) => {
            return(
              <DeleteOutlined onClick={()=>handleDeleteRole(record.roleId)}/>
            )
          },
        },
    ];
    const mergedColumns: TableProps<IRoleDetail>['columns'] = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: IRoleDetail) => {
            return {
              record,
              inputType: "text",
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
            }
          },
        };
      });
    
    const handleExpand = async (expanded :boolean, record :IRoleDetail) => {
      setCheckId(record)
      setLoading(true)
        if (expanded) {
            const result = await GetPermissionWithRole(record.roleId)
            if(result.code === 201){
              setExpandedRowKeys([record.roleId]);
              setPermissions(result.data ?? [])
            }
        } else {
            setExpandedRowKeys([]);
        }
      setLoading(false)
    };
   
    const onFinish: FormProps<ICreateRole>["onFinish"] = async (values) => {
      setLoading(true)
      const result = await AddRole(values.roleName)
      if(result.code === 201){
        notification.success({
          message:"Create success!!!",
          description:"Tạo mới thành công!!!",
          duration:2
        })
      }else{
        notification.error({
          message:"Create failed!!!",
          description:"Tạo mới không thành công!!!",
          duration:2
        })
      }
      setIsModalCreateOpen(false);
      setLoading(false)
    };
    const handleDeleteRole=async(id:string)=>{
      setLoading(true)
      const result = await DeleteRole(id)
      if(result.code === 201){
        notification.success({
          message:"Delete success!!!",
          description:"Xóa thành công!!!",
          duration:2
        })
      }else{
        notification.error({
          message:"Delete failed!!!",
          description:"Xóa không thành công!!!",
          duration:2
        })
      }
      setLoading(false)
    }
    const handleDeletePermissionRole=async(id:string)=>{
       const result = await DeletePermissionRole(checkId?.roleId ?? '',id)
       if(result.code === 201){
        notification.success({
          message:"Delete success!!!",
          description:"Xóa thành công!!!",
          duration:1
        })
        handleExpand(true,checkId!)
       }else{
        notification.error({
          message:"Delete error!!!",
          description:"Xóa không thành công!!!",
          duration:1
        })
       }
    }
    const fetchData = async () => {
        await router.push(`/role?${buildQueryString()}`);
    };
    useEffect(() => {
        fetchData();
    }, [memoizedTableParams,roleName]);
    return(
        <div style={{ height:'auto' }}>
          <div style={{
            width:"100%",
            borderRadius:"0.5rem",
            background:colorBgContainer,
            height:"7vh",
            padding:"0.7rem",
            fontSize:"1.5rem"
           }}>
             Quản lý phân quyền
          </div>
          <div style={{
            background:colorBgContainer,
            borderRadius:"0.5rem",
            marginTop:"0.5rem",
          }}>
            <div style={{ display:'flex',padding:"1rem 0rem 1rem 1rem" }}>
              <div style={{marginLeft:"20rem",display:'flex',gap:'0.5rem', width:"auto"}}>
                <div style={{ 
                  width:"10rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
                }}>
                  Tìm theo tên:
                </div>
                <Input style={{height:"2rem"}} onChange={(e)=>setRoleName(e.target.value)}/>
              </div>
              <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"2rem" }}></div>
              <Button style={{ marginLeft:"2rem" }} onClick={()=>setRoleName("")}>Clear</Button>
              <Button style={{ marginLeft:"1rem" }} type="primary" onClick={showModalCreate}>Tạo mới</Button>
            </div>
            <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                columns={mergedColumns}
                expandable={{ expandedRowRender,onExpand:handleExpand,expandedRowKeys: expandedRowKeys }}
                dataSource={roles}
                rowClassName="editable-row"
                loading={loading}
                rowKey={"roleId"}
                pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100 }}
                onChange={handleTableChange}
            />
            </Form>
          </div>
          {
            isModalCreateOpen && (
              <ModalCreate
                handleCancel={handleCancelCreate}
                handleOk={onFinish}
                isModalOpen={isModalCreateOpen}
                loading={loading}
              />
            )
          }
          {
            isModalPermissionOpen && (
              <ModalPermission
                  handleCancel={handleCancelPermission}
                  isModalOpen={isModalPermissionOpen}
                  loading={loading}
                  roleId={roleId}
                  setIsModalOpen={setIsModalPermissionOpen}
              />
            )
          }
        </div>
    )
}
export default RoleApp
