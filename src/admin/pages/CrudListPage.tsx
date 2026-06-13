import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FilterField, ListPageConfig, RowAction } from '../config/appConfig'

type AnyRow = Record<string, unknown> & { key: string }

const toTitle = (v: unknown) => {
  if (v === null || v === undefined) return '--'
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? '是' : '否'
  return JSON.stringify(v)
}

const makeDateTime = (offsetMinutes: number) => {
  const d = new Date(Date.now() - offsetMinutes * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const mockValueByKey = (key: string, index: number) => {
  const k = key.toLowerCase()
  if (k.includes('time') || k.includes('at') || k.includes('date')) return makeDateTime(index * 37)
  if (k.includes('status')) return index % 3 === 0 ? 'disabled' : 'enabled'
  if (k.includes('enable')) return index % 2 === 0
  if (k.includes('fee') || k.includes('amount') || k.includes('balance') || k.includes('pnl'))
    return Number(((index + 1) * 12.34).toFixed(2))
  if (k.includes('qty') || k.includes('count') || k.includes('total') || k.includes('sort'))
    return (index + 1) * 3
  if (k.includes('address') || k.includes('hash'))
    return `0x${String(index + 1).padStart(4, '0')}...${String(index + 9).padStart(4, '0')}`
  if (k.includes('id')) return `${100000 + index}`
  return `${key}-${index + 1}`
}

const renderStatus = (value: unknown) => {
  const v = String(value ?? '').toLowerCase()
  const enabled = ['enabled', 'normal', 'on', 'yes', 'true'].includes(v)
  const disabled = ['disabled', 'off', 'no', 'false'].includes(v)
  if (enabled) return <Tag color="green">启用</Tag>
  if (disabled) return <Tag color="red">禁用</Tag>
  return <Tag>{toTitle(value)}</Tag>
}

const buildField = (field: FilterField) => {
  switch (field.type) {
    case 'text':
      return <Input allowClear placeholder={field.placeholder} />
    case 'select':
      return (
        <Select
          allowClear
          options={field.options ?? []}
          placeholder={field.placeholder}
        />
      )
    case 'dateRange':
      return <DatePicker.RangePicker allowClear style={{ width: '100%' }} />
    case 'numberRange':
      return (
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber style={{ width: '50%' }} placeholder="最小" />
          <InputNumber style={{ width: '50%' }} placeholder="最大" />
        </Space.Compact>
      )
  }
}

type ActionState = { open: boolean; action?: RowAction; record?: AnyRow }

export function CrudListPage({ config }: { config: ListPageConfig }) {
  const [form] = Form.useForm()
  const [drawer, setDrawer] = useState<ActionState>({ open: false })
  const [modal, setModal] = useState<ActionState>({ open: false })

  const dataSource = useMemo(() => {
    const rows: AnyRow[] = []
    for (let i = 0; i < 20; i++) {
      const row: AnyRow = { key: String(i + 1) }
      for (const col of config.columns) {
        row[col.dataIndex] = mockValueByKey(col.dataIndex, i)
      }
      rows.push(row)
    }
    return rows
  }, [config.columns])

  const columns = useMemo(() => {
    const baseCols: ColumnsType<AnyRow> = config.columns.map((c) => {
      if (c.kind === 'switch') {
        return {
          title: c.title,
          dataIndex: c.dataIndex,
          width: c.width,
          render: (value) => <Switch checked={Boolean(value)} />,
        }
      }
      if (c.kind === 'status') {
        return {
          title: c.title,
          dataIndex: c.dataIndex,
          width: c.width,
          render: (value) => renderStatus(value),
        }
      }
      return {
        title: c.title,
        dataIndex: c.dataIndex,
        width: c.width,
        render: (value) => <Typography.Text>{toTitle(value)}</Typography.Text>,
      }
    })

    const actions = config.actions?.length
      ? [
          {
            title: '操作',
            key: '__actions__',
            fixed: 'right' as const,
            width: Math.min(360, 90 + config.actions.length * 72),
            render: (_: unknown, record: AnyRow) => (
              <Space size={8} wrap>
                {config.actions!.map((a) => (
                  <Button
                    key={a.key}
                    size="small"
                    danger={Boolean(a.danger)}
                    onClick={() => {
                      if (a.type === 'drawer') setDrawer({ open: true, action: a, record })
                      if (a.type === 'modal') setModal({ open: true, action: a, record })
                    }}
                  >
                    {a.label}
                  </Button>
                ))}
              </Space>
            ),
          },
        ]
      : []

    return [...baseCols, ...actions]
  }, [config.actions, config.columns])

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card
        title={config.title}
        styles={{ body: { paddingBottom: 0 } }}
        extra={
          <Space>
            <Button onClick={() => form.resetFields()}>重置</Button>
            <Button type="primary" onClick={() => form.validateFields()}>
              查询
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            {config.filters.length ? (
              config.filters.map((f) => (
                <Col key={f.key} xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name={f.key} label={f.label}>
                    {buildField(f)}
                  </Form.Item>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Typography.Text type="secondary">无筛选条件</Typography.Text>
              </Col>
            )}
          </Row>
        </Form>
      </Card>

      <Card
        title="列表"
        extra={<Typography.Text type="secondary">示例数据（仅前端交互）</Typography.Text>}
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Drawer
        title={drawer.action?.label}
        open={drawer.open}
        size="large"
        onClose={() => setDrawer({ open: false })}
      >
        <Typography.Paragraph>
          <Typography.Text type="secondary">当前记录：</Typography.Text>
        </Typography.Paragraph>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(drawer.record ?? {}, null, 2)}
        </pre>
      </Drawer>

      <Modal
        title={modal.action?.label}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
        onOk={() => setModal({ open: false })}
        okText="确认"
        cancelText="取消"
      >
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <Typography.Text type={modal.action?.danger ? 'danger' : undefined}>
            {modal.action?.danger ? '该操作为危险操作，请确认。' : '该操作为示例弹窗。'}
          </Typography.Text>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(modal.record ?? {}, null, 2)}
          </pre>
        </Space>
      </Modal>
    </Space>
  )
}
