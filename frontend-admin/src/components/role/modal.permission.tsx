'use client'

import { AddRolePermission, GetUnassignedPermissions } from "@/utils/action/action"
import Button from "antd/es/button/button"
import Checkbox from "antd/es/checkbox/Checkbox"
import Divider from "antd/es/divider"
import Modal from "antd/es/modal/Modal"
import notification from "antd/es/notification"
import { useEffect, useState } from "react"
interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    roleId:string,
    handleCancel:(v :any) => void,
    setIsModalOpen:(v :any) => void,
}

const ModalPermission=(props: Iprops)=>{
    const {isModalOpen, handleCancel,roleId,setIsModalOpen } = props
    const [permissions,setPermissions] = useState<IPermission[]>([])
    const [permissions_1,setPermissions_1] = useState<string[]>([])
    const [checkedRoles, setCheckedRoles] = useState<{ [key: string]: boolean }>({});
    const onChange = (e :boolean,item :IPermission) => {
      setCheckedRoles(prev => ({
        ...prev,
        [item.permissionId]: e
      }));
      if (e === true) {
        const isPermissionIdExists = permissions_1.some(p => p === item.permissionId);
        if (!isPermissionIdExists) {
            setPermissions_1(prevData => [...prevData, item.permissionId]);
        }
      } else if (e === false) {
        setPermissions_1(prevData => prevData.filter(id => id !== item.permissionId));
      }
    };
    const handleOk = async () => {
      const result = await AddRolePermission(roleId,permissions_1)
      if(result.code === 201){
        notification.success({
          message:"Add!!!",
          description:"Thêm mới thành công!!!",
          duration:1
        })
      }
      setIsModalOpen(false)
    };
    const handleGetPermission = async() => {
      const result = await GetUnassignedPermissions(roleId)
      if(result.code === 201){
        setPermissions(result.data)
      }
    }
    useEffect(()=>{
        handleGetPermission()
    },[])
    return(
      <Modal width={"25rem"} footer={null} title="Thêm permission" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Divider/>
        <div style={{display:'flex',flexDirection:'column',gap:15,marginLeft:-25}}>
         {permissions.map((item,index)=>{
                  return(
                    <div key={index} style={{
                       display:'flex',
                       gap:15,
                       margin:'-10px 0px 0px 30px'
                    }}>
                       <Checkbox onChange={(e)=>onChange(e.target.checked,item)} checked={checkedRoles[item.permissionId] || false}/>
                       <div style={{fontSize:16}}>{item.description}</div>
                    </div>
                  )
        })}
        </div>
        <Divider/>
        <Button type="primary" style={{marginLeft:"7.5rem"}} onClick={handleOk}>Thêm mới</Button>
      </Modal>
    )
}
export default ModalPermission