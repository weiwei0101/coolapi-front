import { deleteUserUsingPOST, listUserByPageUsingGET, updateUserUsingPOST } from '@/services/api-back/userController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';
import UpdateUserModal from './components/UpdateUserModal';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  // const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();  
  const [currentRow, setCurrentRow] = useState<API.User>();

  /**
   * @en-US Add node
   * @zh-CN 添加用户
   * @param fields
   */
  // const handleAdd = async (fields: API.UserAddRequest) => {
  //   const hide = message.loading('正在添加...');
  //   try {
  //     await addUserUsingPOST({
  //       ...fields,
  //     });
  //     hide();
  //     message.success('添加成功！');
  //     actionRef.current?.reload();
  //     handleModalOpen(false);
  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('添加失败，' + error.message);
  //     return false;
  //   }
  // };

  /**
   * @en-US Update node
   * @zh-CN 修改用户
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.UserUpdateRequest) => {
    if(!currentRow){
      return;
    }
    const hide = message.loading('修改中...');
    try {
      await updateUserUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('修改成功！');
      actionRef.current?.reload();
      return true;
    } catch (error:any) {
      hide();
      message.error('修改失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除用户
   *
   * @param record
   */
  const handleRemove = async (record: API.User) => {
    const hide = message.loading('正在删除...');
    if (!record) return true;
    try {
      await deleteUserUsingPOST({
        id: record.id
      });
      hide();
      message.success('删除成功！');
      actionRef.current?.reload();
      return true;
    } catch (error:any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      valueType: 'text',
    },
    {
      title: '用户头像',
      dataIndex: 'userAvatar',
      valueType: 'textarea',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'text',
      valueEnum: {
        0: {
          text: '男',
          status: 'Processing',
        },
        1: {
          text: '女',
          status: 'Processing',
        }
      },
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="primary"
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </Button>,
        <Button
          type="primary"
          danger
          key="config.Delete"
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.User, API.PageParams>
        headerTitle={'用户详情'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        pagination={{ pageSize: 5 }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalOpen(true);
          //   }}
          // >
          //   <PlusOutlined /> 新建
          // </Button>,
        ]}
        request={async (
          params: {
            pageSize?: number;
            current?: number;
            keyword?: string;
          }, 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          sort: Record<string, SortOrder>,filter: Record<string, (string | number)[] | null>,
        ) => {
             const res = await listUserByPageUsingGET({ ...params });
             if (res.data) {
                 return {
                     data: res.data.records || [],
                     success: true,
                     total: res.data.total,
                 };
             } else {
                 return {
                     data: [],
                     success: false,
                     total: 0,
                 };
             }
         }
        }
        columns={columns}
        scroll={{ x: 700 }}        
        options={{
          reload: true,
          setting: {
            draggable: true,
            checkable: true,
            checkedReset: false,
            extra: [<a key="confirm">确认</a>],
          },
        }}
      />      
      <UpdateUserModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />
      {/* <CreateUserModal
        columns={columns}
        onCancel={() => handleModalOpen(false)}
        onSubmit={(values) => handleAdd(values)}
        visible={createModalOpen}
      /> */}
    </PageContainer>
  );
};
export default TableList;
