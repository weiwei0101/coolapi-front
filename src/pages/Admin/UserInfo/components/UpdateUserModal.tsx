import {
  ProColumns,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';

export type Props = {
  values: API.User;
  columns: ProColumns<API.User>[];
  onCancel: () => void;
  onSubmit: (values: API.UserUpdateRequest) => Promise<void>;
  visible: boolean;
};
const UpdateModal: React.FC<Props> = (props) => {
  const { values, visible, columns, onCancel, onSubmit } = props;

  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (formRef){
      formRef.current?.setFieldsValue(values);
    }
  }, [values]);

  return (
    <Modal title={'更新接口'} visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        formRef={formRef}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }
      }/>
    </Modal>
  );
};
export default UpdateModal;
