import { useMemo, useState } from 'react'
import { Breadcrumb, Button, Layout, Menu, Space, Typography } from 'antd'
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  buildMenuItems,
  getMenuKeyPathByPathname,
  navTree,
  routeMap,
  sidebarTitle,
} from '../config/appConfig'

const { Header, Sider, Content } = Layout

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const menuItems = useMemo(() => buildMenuItems(navTree), [])
  const keyPath = useMemo(
    () => getMenuKeyPathByPathname(navTree, location.pathname),
    [location.pathname],
  )
  const mergedOpenKeys = useMemo(() => {
    if (collapsed) return []
    const merged = new Set([...openKeys, ...keyPath.openKeys])
    return Array.from(merged)
  }, [collapsed, keyPath.openKeys, openKeys])

  const crumb = routeMap.get(location.pathname)
  const breadcrumbs = crumb?.labels ?? []

  const pageTitle = breadcrumbs.at(-1) ?? sidebarTitle

  return (
    <Layout style={{ height: '100%' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            height: 56,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography.Text strong ellipsis style={{ width: '100%' }}>
            {sidebarTitle}
          </Typography.Text>
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[keyPath.selectedKey]}
          openKeys={mergedOpenKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          onClick={(info) => {
            const key = String(info.key)
            if (key.startsWith('/')) navigate(key)
          }}
          style={{ height: 'calc(100% - 56px)' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <Space size={12} align="center">
            <Button
              type="text"
              onClick={() => setCollapsed((v) => !v)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography.Text strong>{pageTitle}</Typography.Text>
              <Breadcrumb
                items={breadcrumbs.map((b) => ({ title: b }))}
                style={{ fontSize: 12 }}
              />
            </div>
          </Space>
          <Button type="text" icon={<LogoutOutlined />} onClick={() => navigate('/')}>
            退出
          </Button>
        </Header>
        <Content style={{ padding: 16, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
