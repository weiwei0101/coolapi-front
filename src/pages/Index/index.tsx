import { Link } from '@/.umi/exports';
import { listInterfaceInfoByPageUsingGET } from '@/services/api-back/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { List, message } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';

/**
 * 主页
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = 1, pageSize = 5) => {
    try{
      const res = await listInterfaceInfoByPageUsingGET({
        current, pageSize
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    }catch(error){
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <PageContainer title="在线接口开放平台">
      <List
      className="api-list"
      loading={loading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={item => {
        const apiLink = `/interface_info/${item.id}`;
        return(
          <List.Item actions={[<Link key={item.id} to={apiLink}>查看</Link>]}>
              <List.Item.Meta
                title={<Link to={apiLink}>{item.name}</Link>}
                description={item.description}
              />
          </List.Item>
        );
      }}
      pagination={{
          showTotal(total: number){
            return '总数：' + total;
          },
          pageSize: 5,
          total,
          onChange(page, pageSize){
            loadData(page, pageSize);
          }
        }
      }
    />
    </PageContainer>
  );
};

export default Index;
