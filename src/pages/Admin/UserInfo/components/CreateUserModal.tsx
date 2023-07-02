import {
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React from 'react';

export type Props = {
  columns: ProColumns<API.UserAddRequest>[];
  onCancel: () => void;
  onSubmit: (values: API.UserAddRequest) => Promise<any>;
  visible: boolean;
};
const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onCancel, onSubmit } = props;
  return (
    <Modal title={'添加接口'} footer={null} visible={visible} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }
      }/>
    </Modal>
  );
};
export default CreateModal;
