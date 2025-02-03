'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Input from 'antd/es/input/Input';
import InputNumber from 'antd/es/input-number';
import Form, { FormProps } from 'antd/es/form';
import Typography from 'antd/es/typography';
import Table, { TableProps } from 'antd/es/table';
import EditOutlined from '@ant-design/icons/EditOutlined'
import { TablePaginationConfig} from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import Select, { LabeledValue } from "antd/es/select";
import { CreateProduct, DeleteProduct, UpdateProduct } from '@/utils/action/action';
import ModalCreateProduct from './modal.create';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import DrawerProduct from './drawer.product';
import { GetProp } from 'antd/es/_util/type';
import theme from 'antd/es/theme';
import notification from 'antd/es/notification';
import Button from 'antd/es/button/button';
import Tag from 'antd/es/tag';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string | number;
  title: any;
  inputType: 'number' | 'text' | 'select' ;
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
    let inputNode
      if (inputType === 'text') {
        inputNode = <Input />;
      } else if (inputType === 'select') {
        inputNode = (
          <Select
            options={[
              { value: true, label: 'Hiện' },
              { value: false, label: 'Ẩn' },
            ]}
          />
        );
    } else if(inputType === 'number'){
      inputNode = <InputNumber />;
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

const ProductApp=( { products, genres } : { products : IProduct[], genres :IGenre[] } )=>{
      const {
        token: { borderRadiusLG,colorBgContainer },
      } = theme.useToken();
      const [form] = Form.useForm();
      const router = useRouter()
      const [editingKey, setEditingKey] = useState<string>('');
      const [loading,setLoading] = useState<boolean>(false)
      const isEditing = (record: IProduct) => record.id === editingKey;
      const [bookTitle,setBookTitle] = useState<string>('')
      const [category,setCategory] = useState<string>('')
      const [rating,setRating] = useState<number>(0)
      const [listGenre,SetListGenre] = useState<LabeledValue[]>([])
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
      const [openDrawer, setOpenDrawer] = useState(false);
      const [productDrawer,setProductDrawer] = useState<IProduct | null>(null)
      const showDrawer = (product :IProduct) => {
        setProductDrawer(product)
        setOpenDrawer(true);
      };

      const onClose = () => {
        setProductDrawer(null)
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
      const showModal = () => {
        setIsModalOpen(true);
      };
    const onFinish: FormProps<ICreateProduct>["onFinish"] = async (values) => {
        setLoading(true)
        try {
          const result = await CreateProduct(values)
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
        } catch (error) {
          notification.error({
            message:"Cảnh báo!!!",
            description:"Bạn không có quyền !!!",
            duration:2
          })
        } 
        setIsModalOpen(false);
        setLoading(false)
     };
     const handleCancel = () => {
      setIsModalOpen(false);
     };
    const handleListGenre=()=>{
      const convertedData = genres.map(item => ({
        value: item.id,
        label: item.name
      }));
      SetListGenre(convertedData)
    }
    const buildQueryString = () => {
        const { pagination, sortOrder, sortField } = tableParams;
        const queryParams = new URLSearchParams();
    
        if (pagination?.current) queryParams.set('page', pagination.current.toString());
        if (pagination?.pageSize) queryParams.set('limit', pagination.pageSize.toString());
        if (sortOrder) queryParams.set('order', sortOrder);
        if (sortField) queryParams.set('field', sortField);
        if (rating) queryParams.set('rating', rating.toString());
        if (bookTitle) queryParams.set('search_term', bookTitle);
        if (category) queryParams.set('genre_id', category);
    
        return queryParams.toString();
    };
    const handleTableChange: TableProps<any>['onChange'] = (pagination, _ , sorter :any) => {
        setTableParams({
          pagination,
          sortOrder:sorter.order,
          sortField:sorter.field
        });
      };
    const handleDeleteProduct= async (id :string)=>{
       try {
         const reuslt = await DeleteProduct(id)
         if(reuslt.code === 201){
          notification.success({
            message:"Delete!!!",
            description:"Xóa thành công!!!",
            duration:2
          })
         }else{
          notification.error({
            message:"Delete!!!",
            description:"Xóa không thành công!!!",
            duration:2
          })
         }
        } catch (error) {
          notification.error({
            message:"Cảnh báo!!!",
            description:"Bạn không có quyền !!!",
            duration:2
          })
        } 
      }
      const edit = (record: Partial<IProduct> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id ?? '');
      };
    
      const cancel = () => {
        setEditingKey('');
      };
    
      const save = async (key: React.Key) => {
        try {
          setLoading(true)
          const row = (await form.validateFields()) as IProduct;

          const originalProduct = products.find((product) => product.id === key);

          if (!originalProduct) {
            notification.error({
              message: "Lỗi",
              description: "Không tìm thấy sản phẩm tương ứng!",
              duration: 2,
            });
            setLoading(false);
            return;
          }

          const updatedProduct: IProduct = { ...originalProduct, ...row };
          try {
             const result = await UpdateProduct(updatedProduct)
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
          } catch (error) {
              notification.error({
                message:"Cảnh báo!!!",
                description:"Bạn không có quyền !!!",
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
          title: 'Tên sách',
          dataIndex: 'title',
          render: (value: string) => <a style={{ 
            fontSize:"1rem",
            color:"black",
            display: "inline-block",
            maxWidth:"10rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{value}</a>,
          width: '13%',
          editable: true,
        },
        {
          title: 'Tác giả',
          dataIndex: 'author',
          render: (value: string) => <a style={{ 
            fontSize:"1rem",
            color:"#3CB371",
            display: "inline-block",
            maxWidth:"7rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{value}</a>,
          width: '10%',
          editable: true,
        },
        {
          title: 'Nhà xuất bản',
          dataIndex: 'publisher',
          render: (value: string) => <a style={{ 
            fontSize:"1rem",
            color:"black",
            display: "inline-block",
            maxWidth:"6rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{value}</a>,
          width: '%',
          editable: true,
        },
        {
           title: 'Ra đời',
           dataIndex: 'publication_year',
           render: (text: string) => <a style={{fontSize:"1rem",color:"orange"}}>{text}</a>,
           width: '6%',
           editable: true,
        },
        {
           title: 'Số trang',
           dataIndex: 'page_count',
           render: (text: string) => <a style={{fontSize:"1rem",color:"black"}}>{text}</a>,
           width: '6.5%',
           editable: true,
        },
        {
            title: 'Kích thước',
            dataIndex: 'dimensions',
            render: (text: string) => <a style={{fontSize:"1rem",color:"blue"}}>{text}</a>,
            width: '8%',
            editable: true,
        },
        {
            title: 'Loại bìa',
            dataIndex: 'cover_type',
            render: (text: string) => <a style={{fontSize:"1rem",color:"black"}}>{text}</a>,
            width: '7%',
            editable: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (text: number) => <a style={{fontSize:"1rem",color:"red"}}>{text.toLocaleString('vi-VN')}</a>,
            width: '7%',
            editable: true,
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'discount_percentage',
            render: (text: string) => <a style={{fontSize:"1rem",color:"black"}}>{text}</a>,
            width: '7.6%',
            editable: true,
        },
        {
            title: 'Hoạt động',
            dataIndex: 'is_active',
            render: (text: boolean) => {
                let string = ''
                let color = ''
                if(text){
                  string = "Active"
                  color = "green"
                }else{
                  string = "Inactive"
                  color = "red"
                }
                return(
                  <Tag color={color}>
                     {string}
                  </Tag>  
                )
              },
            width: '7.5%',
            editable: true,
        },
        {
          title: 'Cập nhật',
          dataIndex: 'operation',
          render: (index: number, record: IProduct) => {
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
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IProduct) => {
            return(
              <div style={{
                 display:'flex',
                 gap:'0.7rem'
              }}>
                <DeleteOutlined onClick={()=>handleDeleteProduct(record.id)}/>
              </div>
            )
          },
          width: '3%',
        },
        {
          title: 'Xem',
          dataIndex: 'check',
          render: (_: any, record: IProduct) => {
            return(
              <EyeOutlined onClick={()=>showDrawer(record)}/>
            )
          },
          width: '3%',
        },
    ];
    const mergedColumns: TableProps<IProduct>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: IProduct) => {
              let inputNode;
              if (col.dataIndex === 'is_active') {
                inputNode = "select";
              } else if (col.dataIndex === 'price' || col.dataIndex === "page_count" || col.dataIndex === "discount_percentage" || col.dataIndex === "publication_year"){
                inputNode = "number";
              } else {
                inputNode = "text";
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
    const memoizedTableParams = useMemo(() => tableParams, [tableParams]);
    const handleChange = (value: string) => {
       setCategory(value)
    };
    const handleChangeRating = (value: number) => {
       setRating(value)
    };
    const handleDeleteStatus = () => {
      setBookTitle('')
      setCategory('')
      setRating(0)
    }
  
    const fetchData = async() => {
      await router.push(`/product?${buildQueryString()}`);
    };
    useEffect(()=>{
        handleListGenre()
    },[])
    useEffect(() => {
      fetchData();
    }, [memoizedTableParams, bookTitle, category, rating]);
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
             Quản lý sản phẩm
         </div>
         <div style={{
            background:colorBgContainer,
            borderRadius:"0.5rem",
            marginTop:"0.5rem",
         }}>
         <div style={{
              display:'flex',
              gap:'2.1rem',
              height:"10%",
              marginLeft:"1rem",
              padding:"1.3rem 0 1.3rem 0"
          }}>
            <div style={{display:'flex',gap:'0.5rem', width:"auto"}}>
              <div style={{ 
                width:"11rem",
                marginTop:"0.3rem",
                fontSize:"1.1rem"
              }}>
                Tìm theo tên:
              </div>
              <Input style={{height:"2rem"}} onChange={(e)=>setBookTitle(e.target.value)} value={bookTitle} />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8" }}></div>
            <div style={{ display:'flex',gap:'0.5rem' }}>
               <div style={{ 
                  width:"8rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
               }}>
                 Theo danh mục:
               </div>
               <Select
                  value={category}
                  style={{ width: "12rem" }}
                  onChange={handleChange}
                  options={listGenre}
                />
            </div>
            <div style={{ borderLeft:"0.05rem solid #C8C8C8" }}></div>
            <div style={{ display:'flex',gap:'0.5rem' }}>
               <div style={{ 
                  width:"7.5rem",
                  marginTop:"0.3rem",
                  fontSize:"1.1rem"
               }}>
                 Theo đánh giá:
               </div>
               <Select
                  defaultValue={rating}
                  style={{ width: "5rem" }}
                  onChange={handleChangeRating}
                  options={[
                    { value: 0, label: `0 sao` },
                    { value: 1, label: '1 sao' },
                    { value: 2, label: '2 sao' },
                    { value: 3, label: '3 sao' },
                    { value: 4, label: '4 sao' },
                    { value: 5, label: '5 sao' },
                  ]}
                />
            </div>
            <div style={{
              display:"flex",
              gap:'1rem',
              marginLeft:"7rem"
            }}>
              <Button type='dashed' onClick={handleDeleteStatus}>Reset</Button>
              <Button type='primary' onClick={showModal}>Thêm mới</Button>
            </div>
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
            dataSource={products}
            rowKey={"id"}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100}}
            onChange={handleTableChange}
            />
         </Form>
         </div>
         <ModalCreateProduct
             handleCancel={handleCancel}
             handleOk={onFinish}
             isModalOpen={isModalOpen}
             loading={loading}
             listGenre={listGenre}
         />
         {
           openDrawer && (
            <DrawerProduct
              onClose={onClose}
              open={openDrawer}
              productDrawer={productDrawer}
              listGenre={listGenre} 
           /> 
           )
         }
        </div>
    )
}
export default ProductApp