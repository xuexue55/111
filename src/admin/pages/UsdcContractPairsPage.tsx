import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'

type ContractType = 'virtual' | 'reload'
type LeverageMode = 'continuous' | 'discrete'

type PairRecord = {
  id: string
  contractType: ContractType
  symbol: string
  baseCoin: string
  coinFullName: string
  pricePrecision: 1 | 2 | 4 | 6
  minOrderQty: number
  maxOrderQty: number
  qtyPrecision: 0 | 1 | 2 | 3 | 4
  maxPositionQty: number
  leverageMode: LeverageMode
  leverage: number | string
  defaultLeverage: number
  mmMaintainPct: number
  addMarginWarnPct: number
  takerFeePct: number
  makerFeePct: number
  fundingIntervalH: 1 | 4 | 8 | 24
  fundingRatePct: number
  liquidationFeePct: number
  sort: number
  depthPriceProportional: boolean
  allowLong: boolean
  allowShort: boolean
  marketLong: boolean
  marketShort: boolean
  apply: boolean
  show: boolean
  hedge: boolean
  inFlightOrders: number
}

type FilterValues = {
  keyword?: string
  contractType?: 'all' | ContractType
}

type FormValues = {
  contractType: ContractType
  symbol: string
  baseCoin: string
  coinFullName: string
  pricePrecision: 1 | 2 | 4 | 6
  minOrderQty: number
  maxOrderQty: number
  qtyPrecision: 0 | 1 | 2 | 3 | 4
  maxPositionQty: number
  leverageMode: LeverageMode
  leverageMax?: number
  leverageList?: string
  defaultLeverage: number
  mmMaintainPct: number
  addMarginWarnPct: number
  takerFeePct: number
  makerFeePct: number
  fundingIntervalH: 1 | 4 | 8 | 24
  fundingRatePct: number
  liquidationFeePct: number
  sort: number
  depthPriceProportional: boolean
  allowLong: boolean
  allowShort: boolean
  marketLong: boolean
  marketShort: boolean
  apply: boolean
  show: boolean
  hedge: boolean
}

const nextId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const booleanIcon = (v: boolean) =>
  v ? (
    <CheckCircleFilled style={{ color: '#16a34a', fontSize: 16 }} />
  ) : (
    <CloseCircleFilled style={{ color: '#ef4444', fontSize: 16 }} />
  )

const contractTypeTag = (t: ContractType) =>
  t === 'virtual' ? <Tag color="blue">虚拟货币</Tag> : <Tag color="purple">Reload</Tag>

const pct = (n: number) => `${n}%`

const defaultNewValues: FormValues = {
  contractType: 'virtual',
  symbol: '',
  baseCoin: '',
  coinFullName: '',
  pricePrecision: 2,
  minOrderQty: 1,
  maxOrderQty: 1000,
  qtyPrecision: 0,
  maxPositionQty: 10000,
  leverageMode: 'continuous',
  leverageMax: 125,
  leverageList: '1,5,10,20,50,100',
  defaultLeverage: 10,
  mmMaintainPct: 2,
  addMarginWarnPct: 3,
  takerFeePct: 0.05,
  makerFeePct: 0.02,
  fundingIntervalH: 8,
  fundingRatePct: 0.01,
  liquidationFeePct: 0.5,
  sort: 99,
  depthPriceProportional: false,
  allowLong: true,
  allowShort: true,
  marketLong: true,
  marketShort: true,
  apply: true,
  show: true,
  hedge: false,
}

const fromRecordToForm = (r: PairRecord): FormValues => ({
  contractType: r.contractType,
  symbol: r.symbol,
  baseCoin: r.baseCoin,
  coinFullName: r.coinFullName,
  pricePrecision: r.pricePrecision,
  minOrderQty: r.minOrderQty,
  maxOrderQty: r.maxOrderQty,
  qtyPrecision: r.qtyPrecision,
  maxPositionQty: r.maxPositionQty,
  leverageMode: r.leverageMode,
  leverageMax: typeof r.leverage === 'number' ? r.leverage : 125,
  leverageList: typeof r.leverage === 'string' ? r.leverage : '1,5,10,20,50,100',
  defaultLeverage: r.defaultLeverage,
  mmMaintainPct: r.mmMaintainPct,
  addMarginWarnPct: r.addMarginWarnPct,
  takerFeePct: r.takerFeePct,
  makerFeePct: r.makerFeePct,
  fundingIntervalH: r.fundingIntervalH,
  fundingRatePct: r.fundingRatePct,
  liquidationFeePct: r.liquidationFeePct,
  sort: r.sort,
  depthPriceProportional: r.depthPriceProportional,
  allowLong: r.allowLong,
  allowShort: r.allowShort,
  marketLong: r.marketLong,
  marketShort: r.marketShort,
  apply: r.apply,
  show: r.show,
  hedge: r.hedge,
})

const normalizeSymbol = (v: string) => v.trim().toUpperCase()
const normalizeCoin = (v: string) => v.trim().toUpperCase()

const makeInitialData = (): PairRecord[] => [
  {
    id: nextId(),
    contractType: 'virtual',
    symbol: 'BTC_USDC',
    baseCoin: 'BTC',
    coinFullName: 'Bitcoin',
    pricePrecision: 2,
    minOrderQty: 1,
    maxOrderQty: 1000,
    qtyPrecision: 3,
    maxPositionQty: 20000,
    leverageMode: 'continuous',
    leverage: 125,
    defaultLeverage: 10,
    mmMaintainPct: 2,
    addMarginWarnPct: 3,
    takerFeePct: 0.05,
    makerFeePct: 0.02,
    fundingIntervalH: 8,
    fundingRatePct: 0.01,
    liquidationFeePct: 0.5,
    sort: 1,
    depthPriceProportional: false,
    allowLong: true,
    allowShort: true,
    marketLong: true,
    marketShort: true,
    apply: true,
    show: true,
    hedge: false,
    inFlightOrders: 12,
  },
  {
    id: nextId(),
    contractType: 'reload',
    symbol: 'XAU_USDC',
    baseCoin: 'XAU',
    coinFullName: 'Gold',
    pricePrecision: 2,
    minOrderQty: 1,
    maxOrderQty: 200,
    qtyPrecision: 2,
    maxPositionQty: 2000,
    leverageMode: 'discrete',
    leverage: '1,5,10,20,50',
    defaultLeverage: 10,
    mmMaintainPct: 3,
    addMarginWarnPct: 4,
    takerFeePct: 0.08,
    makerFeePct: 0.03,
    fundingIntervalH: 8,
    fundingRatePct: -0.01,
    liquidationFeePct: 0.8,
    sort: 9,
    depthPriceProportional: true,
    allowLong: true,
    allowShort: true,
    marketLong: false,
    marketShort: false,
    apply: true,
    show: true,
    hedge: true,
    inFlightOrders: 0,
  },
]

export function UsdcContractPairsPage() {
  const [filterForm] = Form.useForm<FilterValues>()
  const [editForm] = Form.useForm<FormValues>()
  const [data, setData] = useState<PairRecord[]>(() => makeInitialData())

  const [editing, setEditing] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    record?: PairRecord
  }>({ open: false, mode: 'create' })

  const filtered = useMemo(() => {
    const values = filterForm.getFieldsValue()
    const keyword = values.keyword?.trim().toUpperCase()
    const ct = values.contractType

    return data.filter((r) => {
      const matchKeyword = keyword ? r.symbol.includes(keyword) || r.baseCoin.includes(keyword) : true
      const matchType = !ct || ct === 'all' ? true : r.contractType === ct
      return matchKeyword && matchType
    })
  }, [data, filterForm])

  const columns: ColumnsType<PairRecord> = [
    {
      title: '合约类型',
      dataIndex: 'contractType',
      width: 110,
      align: 'center',
      render: (_, r) => contractTypeTag(r.contractType),
      fixed: 'left',
    },
    {
      title: '合约交易对',
      dataIndex: 'symbol',
      width: 140,
      render: (v) => <Typography.Text strong>{String(v)}</Typography.Text>,
      fixed: 'left',
    },
    { title: '价值精度(USD)', dataIndex: 'pricePrecision', width: 130, align: 'center' },
    { title: '下单数最低精度', dataIndex: 'qtyPrecision', width: 140, align: 'center' },
    {
      title: '杠杆倍数',
      dataIndex: 'leverage',
      width: 120,
      align: 'center',
      render: (_, r) => (
        <Typography.Text style={{ color: '#f97316', fontWeight: 600 }}>
          {typeof r.leverage === 'number' ? `${r.leverage}x` : r.leverage}
        </Typography.Text>
      ),
    },
    {
      title: '允许开多',
      dataIndex: 'allowLong',
      width: 110,
      align: 'center',
      render: (_, r) => booleanIcon(r.allowLong),
    },
    {
      title: '允许开空',
      dataIndex: 'allowShort',
      width: 110,
      align: 'center',
      render: (_, r) => booleanIcon(r.allowShort),
    },
    {
      title: '市价开多',
      dataIndex: 'marketLong',
      width: 110,
      align: 'center',
      render: (_, r) => booleanIcon(r.marketLong),
    },
    {
      title: '市价开空',
      dataIndex: 'marketShort',
      width: 110,
      align: 'center',
      render: (_, r) => booleanIcon(r.marketShort),
    },
    { title: '应用', dataIndex: 'apply', width: 90, align: 'center', render: (_, r) => booleanIcon(r.apply) },
    { title: '显示', dataIndex: 'show', width: 90, align: 'center', render: (_, r) => booleanIcon(r.show) },
    { title: '合约对冲', dataIndex: 'hedge', width: 110, align: 'center', render: (_, r) => booleanIcon(r.hedge) },
    {
      title: 'Taker 手续费',
      dataIndex: 'takerFeePct',
      width: 120,
      align: 'center',
      render: (v) => pct(Number(v)),
    },
    {
      title: 'Maker 手续费',
      dataIndex: 'makerFeePct',
      width: 120,
      align: 'center',
      render: (v) => pct(Number(v)),
    },
    {
      title: '资金费率周期',
      dataIndex: 'fundingIntervalH',
      width: 120,
      align: 'center',
      render: (v) => `${v}H`,
    },
    {
      title: '资金费率',
      dataIndex: 'fundingRatePct',
      width: 120,
      align: 'center',
      render: (v) => {
        const n = Number(v)
        return <Typography.Text style={{ color: n < 0 ? '#ef4444' : undefined }}>{pct(n)}</Typography.Text>
      },
    },
    {
      title: '强平清算费率',
      dataIndex: 'liquidationFeePct',
      width: 140,
      align: 'center',
      render: (v) => pct(Number(v)),
    },
    { title: '排序', dataIndex: 'sort', width: 90, align: 'center' },
    {
      title: '盘口价格等比例分配',
      dataIndex: 'depthPriceProportional',
      width: 170,
      align: 'center',
      render: (_, r) => <Tag color={r.depthPriceProportional ? 'green' : 'default'}>{r.depthPriceProportional ? '开' : '关'}</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      fixed: 'right',
      align: 'center',
      render: (_, r) => (
        <Space size={8}>
          <Button
            size="small"
            onClick={() => {
              setEditing({ open: true, mode: 'edit', record: r })
              editForm.setFieldsValue(fromRecordToForm(r))
            }}
          >
            修改
          </Button>
          <Button
            size="small"
            onClick={() => {
              Modal.confirm({
                title: '生成合约户',
                icon: <ExclamationCircleFilled />,
                content: '将为该合约批量初始化用户合约账户，是否确认？',
                okText: '确认',
                cancelText: '取消',
              })
            }}
          >
            生成合约户
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              let inputValue = ''
              Modal.confirm({
                title: '恢复数据（高危）',
                icon: <ExclamationCircleFilled />,
                content: (
                  <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                    <Typography.Text type="danger">
                      此操作将回滚该交易对数据，不可撤销，请确认是否继续？
                    </Typography.Text>
                    <Typography.Text>
                      请输入 <Typography.Text strong>{r.symbol}</Typography.Text> 确认：
                    </Typography.Text>
                    <Input onChange={(e) => (inputValue = e.target.value)} placeholder="输入交易对名称确认" />
                  </Space>
                ),
                okText: '确认恢复',
                cancelText: '取消',
                okButtonProps: { danger: true },
                onOk: async () => {
                  if (normalizeSymbol(inputValue) !== r.symbol) {
                    throw new Error('确认文字不匹配')
                  }
                },
              })
            }}
          >
            恢复数据
          </Button>
        </Space>
      ),
    },
  ]

  const openCreate = () => {
    setEditing({ open: true, mode: 'create' })
    editForm.setFieldsValue(defaultNewValues)
  }

  const save = async () => {
    const values = await editForm.validateFields()

    const symbol = normalizeSymbol(values.symbol)
    const baseCoin = normalizeCoin(values.baseCoin)

    if (!/^[A-Z]{1,10}_USDC$/.test(symbol)) {
      Modal.error({ title: '保存失败', content: '交易对格式错误，应为 {大写英文}_USDC，如 BTC_USDC' })
      return
    }
    if (!/^[A-Z]{1,10}$/.test(baseCoin)) {
      Modal.error({ title: '保存失败', content: '币种（交易标的）必须为 1~10 位大写英文字母' })
      return
    }

    const leverageMode: LeverageMode = values.leverageMode
    let leverage: number | string = 1
    if (leverageMode === 'continuous') {
      const max = Number(values.leverageMax)
      if (!Number.isInteger(max) || max < 1 || max > 125) {
        Modal.error({ title: '保存失败', content: '连续杠杆：最大杠杆必须为 1~125 的整数' })
        return
      }
      leverage = max
      if (!Number.isInteger(values.defaultLeverage) || values.defaultLeverage < 1 || values.defaultLeverage > max) {
        Modal.error({ title: '保存失败', content: '默认展示杠杆必须在 1~最大杠杆范围内' })
        return
      }
    } else {
      const raw = String(values.leverageList ?? '')
      const items = raw
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
      const nums = items.map((x) => Number(x))
      if (!nums.length || nums.some((n) => !Number.isInteger(n) || n <= 0)) {
        Modal.error({ title: '保存失败', content: '离散杠杆：请输入逗号分隔的正整数列表，如 1,5,10,20' })
        return
      }
      leverage = items.join(',')
      if (!nums.includes(values.defaultLeverage)) {
        Modal.error({ title: '保存失败', content: '默认展示杠杆必须在离散杠杆列表中' })
        return
      }
    }

    if (values.minOrderQty > values.maxOrderQty) {
      Modal.error({ title: '保存失败', content: '最小下单数量不能大于最大下单数量' })
      return
    }
    if (values.maxPositionQty <= values.maxOrderQty) {
      Modal.error({ title: '保存失败', content: '最大持仓数量需大于最大下单数量' })
      return
    }
    if (values.makerFeePct > values.takerFeePct) {
      Modal.error({ title: '保存失败', content: 'Maker 手续费不能大于 Taker 手续费' })
      return
    }
    if (values.fundingRatePct < -0.75 || values.fundingRatePct > 0.75) {
      Modal.error({ title: '保存失败', content: '资金费率范围：-0.75% ~ 0.75%' })
      return
    }
    if (values.liquidationFeePct < 0.1 || values.liquidationFeePct > 1.5) {
      Modal.error({ title: '保存失败', content: '强平清算费率范围：0.1% ~ 1.5%' })
      return
    }
    if (values.addMarginWarnPct <= values.mmMaintainPct) {
      Modal.error({ title: '保存失败', content: '追加保证金提示% 建议高于维持保证金率%' })
      return
    }

    if (editing.mode === 'create') {
      const exists = data.some((d) => d.symbol === symbol)
      if (exists) {
        Modal.error({ title: '保存失败', content: '交易对名称已存在，请检查输入' })
        return
      }

      const record: PairRecord = {
        id: nextId(),
        contractType: values.contractType,
        symbol,
        baseCoin,
        coinFullName: values.coinFullName.trim(),
        pricePrecision: values.pricePrecision,
        minOrderQty: values.minOrderQty,
        maxOrderQty: values.maxOrderQty,
        qtyPrecision: values.qtyPrecision,
        maxPositionQty: values.maxPositionQty,
        leverageMode,
        leverage,
        defaultLeverage: values.defaultLeverage,
        mmMaintainPct: values.mmMaintainPct,
        addMarginWarnPct: values.addMarginWarnPct,
        takerFeePct: values.takerFeePct,
        makerFeePct: values.makerFeePct,
        fundingIntervalH: values.fundingIntervalH,
        fundingRatePct: values.fundingRatePct,
        liquidationFeePct: values.liquidationFeePct,
        sort: values.sort,
        depthPriceProportional: values.depthPriceProportional,
        allowLong: values.allowLong,
        allowShort: values.allowShort,
        marketLong: values.marketLong,
        marketShort: values.marketShort,
        apply: values.apply,
        show: values.show,
        hedge: values.hedge,
        inFlightOrders: 0,
      }
      setData((prev) => [...prev, record].sort((a, b) => a.sort - b.sort))
      setEditing({ open: false, mode: 'create' })
      return
    }

    const record = editing.record
    if (!record) return

    const precisionChanged = record.pricePrecision !== values.pricePrecision
    const hasInFlightOrders = record.inFlightOrders > 0

    const doUpdate = () => {
      setData((prev) =>
        prev
          .map((r) =>
            r.id !== record.id
              ? r
              : {
                  ...r,
                  coinFullName: values.coinFullName.trim(),
                  pricePrecision: values.pricePrecision,
                  minOrderQty: values.minOrderQty,
                  maxOrderQty: values.maxOrderQty,
                  qtyPrecision: values.qtyPrecision,
                  maxPositionQty: values.maxPositionQty,
                  leverageMode,
                  leverage,
                  defaultLeverage: values.defaultLeverage,
                  mmMaintainPct: values.mmMaintainPct,
                  addMarginWarnPct: values.addMarginWarnPct,
                  takerFeePct: values.takerFeePct,
                  makerFeePct: values.makerFeePct,
                  fundingIntervalH: values.fundingIntervalH,
                  fundingRatePct: values.fundingRatePct,
                  liquidationFeePct: values.liquidationFeePct,
                  sort: values.sort,
                  depthPriceProportional: values.depthPriceProportional,
                  allowLong: values.allowLong,
                  allowShort: values.allowShort,
                  marketLong: values.marketLong,
                  marketShort: values.marketShort,
                  apply: values.apply,
                  show: values.show,
                  hedge: values.hedge,
                },
          )
          .sort((a, b) => a.sort - b.sort),
      )
      setEditing({ open: false, mode: 'create' })
    }

    if (precisionChanged && hasInFlightOrders) {
      Modal.confirm({
        title: '确认修改',
        icon: <ExclamationCircleFilled />,
        content: `当前存在 ${record.inFlightOrders} 笔在途委托，修改精度可能影响成交，是否继续？`,
        okText: '继续',
        cancelText: '取消',
        onOk: doUpdate,
      })
      return
    }

    doUpdate()
  }

  const title = (
    <Space size={10}>
      <Badge color="#22c55e" text="合约上币配置" />
      <Typography.Text strong>交易对配置</Typography.Text>
    </Space>
  )

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card
        title={title}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增交易对
          </Button>
        }
      >
        <Form
          form={filterForm}
          layout="vertical"
          initialValues={{ contractType: 'all' }}
        >
          <Row gutter={12}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="keyword" label="合约交易对">
                <Input allowClear placeholder="输入 BTC、ETH 等关键词" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="contractType" label="合约类型">
                <Select
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '虚拟货币', value: 'virtual' },
                    { label: 'Reload', value: 'reload' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={12} style={{ display: 'flex', alignItems: 'end' }}>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    filterForm.validateFields()
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    filterForm.resetFields()
                  }}
                >
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title="数据列表"
        extra={
          <Space size={12}>
            <Button icon={<ReloadOutlined />} onClick={() => setData(makeInitialData())}>
              重置示例数据
            </Button>
            <Typography.Text type="secondary">列表开关仅展示，需进入修改弹窗</Typography.Text>
          </Space>
        }
      >
        <Table<PairRecord>
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          scroll={{ x: 2200 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal
        width={980}
        title={
          editing.mode === 'create'
            ? '新增交易对'
            : `修改交易对 — ${editing.record?.symbol ?? ''}`
        }
        open={editing.open}
        onCancel={() => setEditing({ open: false, mode: 'create' })}
        onOk={save}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={defaultNewValues}
          onValuesChange={(changed, all) => {
            if ('apply' in changed) {
              if (!changed.apply) {
                editForm.setFieldsValue({
                  allowLong: all.allowLong,
                  allowShort: all.allowShort,
                  marketLong: all.marketLong,
                  marketShort: all.marketShort,
                })
              }
            }
          }}
        >
          <Row gutter={12}>
            <Col span={24}>
              <Typography.Text type="secondary">
                分区填写：基础信息 / 精度与数量 / 杠杆与保证金 / 手续费与资金费率 / 展示与对冲
              </Typography.Text>
            </Col>
          </Row>

          <Card size="small" title="区块一：基础信息" style={{ marginTop: 12 }}>
            <Row gutter={12}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="contractType"
                  label="合约类型"
                  rules={[{ required: true, message: '请选择合约类型' }]}
                >
                  <Select
                    disabled={editing.mode === 'edit'}
                    options={[
                      { label: '虚拟货币', value: 'virtual' },
                      { label: 'Reload', value: 'reload' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="symbol"
                  label="交易对"
                  rules={[{ required: true, message: '请输入交易对' }]}
                >
                  <Input
                    disabled={editing.mode === 'edit'}
                    placeholder="如 BTC_USDC"
                    onBlur={(e) => editForm.setFieldValue('symbol', normalizeSymbol(e.target.value))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="baseCoin"
                  label="币种（交易标的）"
                  rules={[{ required: true, message: '请输入币种' }]}
                >
                  <Input
                    disabled={editing.mode === 'edit'}
                    placeholder="如 BTC"
                    onBlur={(e) => editForm.setFieldValue('baseCoin', normalizeCoin(e.target.value))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="coinFullName"
                  label="币种全称"
                  rules={[
                    { required: true, message: '请输入币种全称' },
                    { max: 50, message: '不超过 50 字' },
                  ]}
                >
                  <Input placeholder="如 Bitcoin" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card size="small" title="区块二：精度与数量配置" style={{ marginTop: 12 }}>
            <Row gutter={12}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="pricePrecision"
                  label="价值精度（USDC）"
                  rules={[{ required: true, message: '请选择价值精度' }]}
                >
                  <Select
                    options={[
                      { label: '1', value: 1 },
                      { label: '2', value: 2 },
                      { label: '4', value: 4 },
                      { label: '6', value: 6 },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="minOrderQty"
                  label="最小下单数量"
                  rules={[{ required: true, message: '请输入最小下单数量' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="maxOrderQty"
                  label="最大下单数量"
                  rules={[{ required: true, message: '请输入最大下单数量' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="qtyPrecision"
                  label="下单数量精度"
                  rules={[{ required: true, message: '请选择下单数量精度' }]}
                >
                  <Select
                    options={[
                      { label: '0', value: 0 },
                      { label: '1', value: 1 },
                      { label: '2', value: 2 },
                      { label: '3', value: 3 },
                      { label: '4', value: 4 },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="maxPositionQty"
                  label="最大持仓数量"
                  rules={[{ required: true, message: '请输入最大持仓数量' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card size="small" title="区块三：杠杆与保证金" style={{ marginTop: 12 }}>
            <Row gutter={12}>
              <Col xs={24} md={8}>
                <Form.Item name="leverageMode" label="杠杆倍数类型" rules={[{ required: true }]}>
                  <Radio.Group
                    options={[
                      { label: '连续倍数', value: 'continuous' },
                      { label: '离散倍数', value: 'discrete' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item noStyle shouldUpdate={(p, c) => p.leverageMode !== c.leverageMode}>
                  {({ getFieldValue }) =>
                    getFieldValue('leverageMode') === 'continuous' ? (
                      <Form.Item name="leverageMax" label="杠杆倍数（最大）" rules={[{ required: true }]}>
                        <InputNumber min={1} max={125} style={{ width: '100%' }} />
                      </Form.Item>
                    ) : (
                      <Form.Item name="leverageList" label="杠杆倍数（列表）" rules={[{ required: true }]}>
                        <Input placeholder="如 1,5,10,20,50,100" />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="defaultLeverage"
                  label="默认展示杠杆"
                  rules={[{ required: true, message: '请输入默认展示杠杆' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="mmMaintainPct"
                  label="维持保证金占初始保证金比例%"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0.1} max={5} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="addMarginWarnPct" label="追加保证金提示%" rules={[{ required: true }]}>
                  <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card size="small" title="区块四：手续费与资金费率" style={{ marginTop: 12 }}>
            <Row gutter={12}>
              <Col xs={24} md={6}>
                <Form.Item name="takerFeePct" label="Taker 吃单手续费%" rules={[{ required: true }]}>
                  <InputNumber min={0.001} max={1} step={0.001} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item name="makerFeePct" label="Maker 挂单手续费%" rules={[{ required: true }]}>
                  <InputNumber min={0} max={1} step={0.001} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item name="fundingIntervalH" label="资金费率周期(H)" rules={[{ required: true }]}>
                  <Select
                    options={[
                      { label: '1', value: 1 },
                      { label: '4', value: 4 },
                      { label: '8', value: 8 },
                      { label: '24', value: 24 },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item name="fundingRatePct" label="资金费率%" rules={[{ required: true }]}>
                  <InputNumber min={-0.75} max={0.75} step={0.01} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item name="liquidationFeePct" label="强平清算费率%" rules={[{ required: true }]}>
                  <InputNumber min={0.1} max={1.5} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card size="small" title="区块五：展示与对冲" style={{ marginTop: 12 }}>
            <Row gutter={12}>
              <Col xs={24} md={6}>
                <Form.Item name="sort" label="排序" rules={[{ required: true }]}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="depthPriceProportional"
                  label="盘口价格等比例分配"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开" unCheckedChildren="关" />
                </Form.Item>
              </Col>
            </Row>

            <Card size="small" title="开仓方向与状态开关配置" style={{ marginTop: 12 }}>
              <Row gutter={12}>
                <Col xs={12} md={4}>
                  <Form.Item name="allowLong" label="允许开多" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item name="allowShort" label="允许开空" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item name="marketLong" label="市价开多" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item name="marketShort" label="市价开空" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item name="apply" label="应用" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item name="show" label="显示" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item name="hedge" label="合约对冲" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                <Typography.Text type="secondary">
                  说明：应用关闭后，方向开关将自动失效（但不会重置为关）；显示关闭不影响应用。
                </Typography.Text>
              </Typography.Paragraph>
            </Card>
          </Card>
        </Form>
      </Modal>
    </Space>
  )
}
