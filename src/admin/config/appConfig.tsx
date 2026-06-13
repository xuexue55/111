import type { ReactNode } from 'react'
import type { ItemType } from 'antd/es/menu/interface'
import {
  AuditOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileTextOutlined,
  FundOutlined,
  GlobalOutlined,
  NotificationOutlined,
  PercentageOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'

export type FilterFieldType = 'text' | 'select' | 'dateRange' | 'numberRange'

export type FilterField = {
  key: string
  label: string
  type: FilterFieldType
  placeholder?: string
  options?: Array<{ label: string; value: string }>
}

export type ColumnKind = 'text' | 'number' | 'dateTime' | 'status' | 'switch'

export type ColumnConfig = {
  title: string
  dataIndex: string
  width?: number
  kind?: ColumnKind
}

export type RowActionType = 'drawer' | 'modal'

export type RowAction = {
  key: string
  label: string
  type: RowActionType
  danger?: boolean
}

export type ListPageConfig = {
  title: string
  filters: FilterField[]
  columns: ColumnConfig[]
  actions?: RowAction[]
}

export type PageConfig =
  | { kind: 'list'; config: ListPageConfig }
  | { kind: 'placeholder'; title: string; todo?: boolean }

export type NavNode = {
  key: string
  label: string
  icon?: ReactNode
  path?: string
  page?: PageConfig
  children?: NavNode[]
}

const listPage = (config: ListPageConfig): PageConfig => ({ kind: 'list', config })
const placeholderPage = (title: string, todo?: boolean): PageConfig => ({
  kind: 'placeholder',
  title,
  todo,
})

export const defaultPath = '/members/list'

export const navTree: NavNode[] = [
  {
    key: 'price-source',
    label: '价格源菜单',
    icon: <FundOutlined />,
    children: [
      {
        key: 'price-source-list',
        label: '价格源管理',
        path: '/price-sources/list',
        page: listPage({
          title: '价格源管理',
          filters: [
            { key: 'symbol', label: '交易对/币种', type: 'text', placeholder: '如 BTC/USDC' },
            { key: 'source', label: '价格源', type: 'text', placeholder: '来源标识' },
            {
              key: 'status',
              label: '状态',
              type: 'select',
              options: [
                { label: '启用', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
              ],
            },
          ],
          columns: [
            { title: '交易对', dataIndex: 'symbol', kind: 'text', width: 140 },
            { title: '价格源', dataIndex: 'source', kind: 'text', width: 160 },
            { title: '权重/优先级', dataIndex: 'weight', kind: 'number', width: 120 },
            { title: '更新时间', dataIndex: 'updatedAt', kind: 'dateTime', width: 180 },
            { title: '状态', dataIndex: 'status', kind: 'status', width: 100 },
          ],
          actions: [
            { key: 'view', label: '查看', type: 'drawer' },
            { key: 'edit', label: '编辑', type: 'modal' },
          ],
        }),
      },
    ],
  },
  {
    key: 'members',
    label: '会员管理',
    icon: <TeamOutlined />,
    children: [
      {
        key: 'members-list',
        label: '会员管理',
        path: '/members/list',
        page: listPage({
          title: '会员管理',
          filters: [
            {
              key: 'account',
              label: '邮箱/Telegram/区块链地址',
              type: 'text',
              placeholder: '输入邮箱/Telegram/地址',
            },
            { key: 'inviteCode', label: '本人邀请码', type: 'text' },
            { key: 'memberId', label: '会员ID', type: 'text' },
            { key: 'nickname', label: '昵称', type: 'text' },
            {
              key: 'memberStatus',
              label: '会员状态',
              type: 'select',
              options: [
                { label: '正常', value: 'normal' },
                { label: '禁用', value: 'disabled' },
              ],
            },
            {
              key: 'whitelist',
              label: '是否白名单',
              type: 'select',
              options: [
                { label: '是', value: 'yes' },
                { label: '否', value: 'no' },
              ],
            },
            {
              key: 'userType',
              label: '用户类型',
              type: 'select',
              options: [
                { label: '普通用户', value: 'normal' },
                { label: '内部代理', value: 'agent' },
              ],
            },
            { key: 'timeRange', label: '时间范围', type: 'dateRange' },
          ],
          columns: [
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '注册类型', dataIndex: 'registerType', kind: 'text', width: 120 },
            { title: '会员名称', dataIndex: 'memberName', kind: 'text', width: 140 },
            { title: '本人邀请码', dataIndex: 'inviteCode', kind: 'text', width: 140 },
            { title: '会员等级', dataIndex: 'level', kind: 'text', width: 100 },
            { title: '会员昵称', dataIndex: 'nickname', kind: 'text', width: 140 },
            { title: '真实姓名', dataIndex: 'realName', kind: 'text', width: 120 },
            { title: '邀请ID', dataIndex: 'inviterId', kind: 'text', width: 120 },
            { title: '注册时间', dataIndex: 'registeredAt', kind: 'dateTime', width: 180 },
            { title: '会员状态', dataIndex: 'memberStatus', kind: 'status', width: 120 },
            { title: '白名单', dataIndex: 'whitelist', kind: 'status', width: 100 },
          ],
          actions: [
            { key: 'view', label: '查看', type: 'drawer' },
            { key: 'setInviter', label: '设置邀请人', type: 'modal' },
            { key: 'setWhitelist', label: '设置白名单', type: 'modal' },
            { key: 'setAgent', label: '设置内部代理', type: 'modal' },
          ],
        }),
      },
      {
        key: 'members-balance',
        label: '余额管理',
        path: '/members/balances',
        page: listPage({
          title: '余额管理',
          filters: [
            { key: 'product', label: '搜索入账产品', type: 'text' },
            { key: 'settlementAlgo', label: '入账结算算法', type: 'select' },
            { key: 'incomeType', label: '入账种类', type: 'select' },
            { key: 'chainAmount', label: '链币市最低/最高数量', type: 'numberRange' },
            { key: 'spotAmount', label: '币市最低/最高数量', type: 'numberRange' },
          ],
          columns: [
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '账户', dataIndex: 'account', kind: 'text', width: 180 },
            { title: '真实姓名', dataIndex: 'realName', kind: 'text', width: 120 },
            { title: '币种名称', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '钱包地址', dataIndex: 'walletAddress', kind: 'text', width: 260 },
            { title: '可用币数', dataIndex: 'available', kind: 'number', width: 120 },
            { title: '冻结币数', dataIndex: 'frozen', kind: 'number', width: 120 },
            { title: '总币个数', dataIndex: 'total', kind: 'number', width: 120 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
    ],
  },
  {
    key: 'contract-listing',
    label: '合约上币配置',
    icon: <SwapOutlined />,
    children: [
      {
        key: 'contract-pair-config',
        label: '交易对配置',
        path: '/contract-listing/pair-config',
        page: placeholderPage('合约上币配置 / 交易对配置', false),
      },
    ],
  },
  {
    key: 'contracts',
    label: 'USDC 市场',
    icon: <DollarOutlined />,
    children: [
      {
        key: 'contracts-platform',
        label: '合约平台数据',
        path: '/contracts/platform-stats',
        page: listPage({
          title: '合约平台数据',
          filters: [
            { key: 'dateRange', label: '日期范围', type: 'dateRange' },
            { key: 'contractType', label: '合约类型', type: 'select' },
          ],
          columns: [
            { title: '日期', dataIndex: 'date', kind: 'dateTime', width: 180 },
            { title: '平台总盈亏', dataIndex: 'platformPnl', kind: 'number', width: 140 },
            { title: '用户已实现盈亏', dataIndex: 'userRealizedPnl', kind: 'number', width: 160 },
            { title: '开仓手续费', dataIndex: 'openFee', kind: 'number', width: 120 },
            { title: '平仓手续费', dataIndex: 'closeFee', kind: 'number', width: 120 },
            { title: '强平清算费', dataIndex: 'liqFee', kind: 'number', width: 140 },
            { title: '资金费用', dataIndex: 'fundingFee', kind: 'number', width: 120 },
            { title: '开仓手续费返佣', dataIndex: 'openFeeRebate', kind: 'number', width: 160 },
            { title: '平仓手续费返佣', dataIndex: 'closeFeeRebate', kind: 'number', width: 160 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'contracts-orders',
        label: '委托管理',
        path: '/contracts/orders',
        page: listPage({
          title: '委托管理',
          filters: [
            { key: 'symbol', label: '合约交易对', type: 'text' },
            { key: 'side', label: '方向', type: 'select' },
            { key: 'status', label: '状态', type: 'select' },
            { key: 'timeRange', label: '时间区间', type: 'dateRange' },
            { key: 'address', label: '账户地址', type: 'text' },
            { key: 'memberId', label: '会员ID', type: 'text' },
            { key: 'minQty', label: '委托量大于', type: 'numberRange' },
            { key: 'accountType', label: '账户类型', type: 'select' },
            { key: 'contractType', label: '合约类型', type: 'select' },
          ],
          columns: [
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '账户', dataIndex: 'account', kind: 'text', width: 220 },
            { title: '合约类型', dataIndex: 'contractType', kind: 'text', width: 120 },
            { title: '账户类型', dataIndex: 'accountType', kind: 'text', width: 120 },
            { title: '合约', dataIndex: 'symbol', kind: 'text', width: 140 },
            { title: '方向', dataIndex: 'side', kind: 'text', width: 100 },
            { title: '委托类型', dataIndex: 'orderType', kind: 'text', width: 120 },
            { title: '委托数量', dataIndex: 'qty', kind: 'number', width: 120 },
            { title: '委托价', dataIndex: 'price', kind: 'number', width: 120 },
            { title: '平均价格', dataIndex: 'avgPrice', kind: 'number', width: 120 },
            { title: '成交数量', dataIndex: 'filledQty', kind: 'number', width: 120 },
            { title: '开仓手续费', dataIndex: 'openFee', kind: 'number', width: 120 },
            { title: '平仓手续费', dataIndex: 'closeFee', kind: 'number', width: 120 },
            { title: '撮合清算费', dataIndex: 'matchFee', kind: 'number', width: 120 },
            { title: '状态', dataIndex: 'status', kind: 'status', width: 120 },
            { title: '更新时间', dataIndex: 'updatedAt', kind: 'dateTime', width: 180 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'contracts-positions',
        label: '持仓管理',
        path: '/contracts/positions',
        page: listPage({
          title: '持仓管理',
          filters: [
            { key: 'symbol', label: '合约交易对', type: 'text' },
            { key: 'netSide', label: '净头寸方向', type: 'select' },
            { key: 'address', label: '账户地址', type: 'text' },
            { key: 'memberId', label: '会员ID', type: 'text' },
            { key: 'balanceMin', label: '可用/冻结余额大于', type: 'numberRange' },
            { key: 'posMin', label: '持仓量大于', type: 'numberRange' },
            { key: 'accountType', label: '账户类型', type: 'select' },
            { key: 'contractType', label: '合约类型', type: 'select' },
            { key: 'activityId', label: '活动ID', type: 'text' },
            { key: 'timeRange', label: '时间区间', type: 'dateRange' },
          ],
          columns: [
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '账户', dataIndex: 'account', kind: 'text', width: 220 },
            { title: '合约类型', dataIndex: 'contractType', kind: 'text', width: 120 },
            { title: '账户类型', dataIndex: 'accountType', kind: 'text', width: 120 },
            { title: '合约交易对', dataIndex: 'symbol', kind: 'text', width: 140 },
            { title: '可用余额', dataIndex: 'available', kind: 'number', width: 120 },
            { title: '冻结余额', dataIndex: 'frozen', kind: 'number', width: 120 },
            { title: '仓位模式', dataIndex: 'positionMode', kind: 'text', width: 120 },
            { title: '净头寸方向', dataIndex: 'netSide', kind: 'text', width: 120 },
            { title: '净头寸仓位', dataIndex: 'netQty', kind: 'number', width: 120 },
            { title: '未实现盈亏', dataIndex: 'unrealizedPnl', kind: 'number', width: 140 },
            { title: '回报率', dataIndex: 'roi', kind: 'text', width: 120 },
            { title: '开仓时间', dataIndex: 'openedAt', kind: 'dateTime', width: 180 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'contracts-monitor',
        label: '持仓监控',
        path: '/contracts/position-monitor',
        page: listPage({
          title: '持仓监控',
          filters: [
            { key: 'symbol', label: '选择合约交易对', type: 'text' },
            { key: 'sortDirection', label: '选择排序方向', type: 'select' },
            { key: 'contractType', label: '合约类型', type: 'select' },
          ],
          columns: [
            { title: '合约类型', dataIndex: 'contractType', kind: 'text', width: 120 },
            { title: '合约交易对', dataIndex: 'symbol', kind: 'text', width: 140 },
            { title: '更新时间', dataIndex: 'updatedAt', kind: 'dateTime', width: 180 },
            { title: '净头寸方向', dataIndex: 'netSide', kind: 'text', width: 120 },
            { title: '净头寸仓位', dataIndex: 'netQty', kind: 'number', width: 120 },
            { title: '净头寸平均杠杆', dataIndex: 'netLeverage', kind: 'number', width: 140 },
            { title: '净头寸持仓均价', dataIndex: 'netAvgPrice', kind: 'number', width: 140 },
            { title: '净头寸占用保证金', dataIndex: 'netMargin', kind: 'number', width: 160 },
            { title: '多仓位', dataIndex: 'longQty', kind: 'number', width: 120 },
            { title: '多仓平均杠杆', dataIndex: 'longLeverage', kind: 'number', width: 140 },
            { title: '多仓持仓均价', dataIndex: 'longAvgPrice', kind: 'number', width: 140 },
            { title: '多仓占用保证金', dataIndex: 'longMargin', kind: 'number', width: 160 },
            { title: '多仓未实现盈亏', dataIndex: 'longUpnl', kind: 'number', width: 160 },
            { title: '空仓位', dataIndex: 'shortQty', kind: 'number', width: 120 },
            { title: '空仓平均杠杆', dataIndex: 'shortLeverage', kind: 'number', width: 140 },
            { title: '空仓持仓均价', dataIndex: 'shortAvgPrice', kind: 'number', width: 140 },
            { title: '空仓占用保证金', dataIndex: 'shortMargin', kind: 'number', width: 160 },
            { title: '空仓未实现盈亏', dataIndex: 'shortUpnl', kind: 'number', width: 160 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'contracts-history-orders',
        label: '历史委托（TODO）',
        path: '/contracts/history-orders',
        page: placeholderPage('历史委托（TODO）', true),
      },
      {
        key: 'contracts-history',
        label: '合约历史',
        children: [
          {
            key: 'contracts-adl-history',
            label: '自动减仓历史',
            path: '/contracts/history/adl',
            page: placeholderPage('自动减仓历史', true),
          },
          {
            key: 'contracts-tpsl-history',
            label: '止盈止损历史',
            path: '/contracts/history/tpsl',
            page: placeholderPage('止盈止损历史', true),
          },
        ],
      },
      {
        key: 'contracts-liquidation',
        label: '清算历史（TODO）',
        path: '/contracts/liquidations',
        page: placeholderPage('清算历史（TODO）', true),
      },
      {
        key: 'contracts-hedge-allocation',
        label: '对冲数量分配（待斟酌）',
        path: '/contracts/hedge-allocation',
        page: listPage({
          title: '对冲数量分配',
          filters: [
            { key: 'symbol', label: '合约交易对', type: 'text' },
            { key: 'contractType', label: '合约类型', type: 'select' },
          ],
          columns: [
            { title: '合约交易对', dataIndex: 'symbol', kind: 'text', width: 160 },
            { title: '合约类型', dataIndex: 'contractType', kind: 'text', width: 140 },
            { title: '净多头杠杆区间→对冲比例%', dataIndex: 'longRanges', kind: 'text', width: 260 },
            { title: '净空头杠杆区间→对冲比例%', dataIndex: 'shortRanges', kind: 'text', width: 260 },
          ],
          actions: [
            { key: 'edit', label: '编辑', type: 'modal' },
            { key: 'delete', label: '删除', type: 'modal', danger: true },
          ],
        }),
      },
      {
        key: 'contracts-hedge',
        label: '合约对冲（待斟酌）',
        path: '/contracts/hedge',
        page: listPage({
          title: '合约对冲',
          filters: [
            { key: 'contractType', label: '合约类型', type: 'select' },
            { key: 'symbol', label: '选择合约交易对', type: 'text' },
          ],
          columns: [
            { title: '杠杆倍数', dataIndex: 'leverage', kind: 'text', width: 160 },
            { title: '价格滑点%', dataIndex: 'slippage', kind: 'number', width: 120 },
            { title: '订单时效', dataIndex: 'tif', kind: 'text', width: 120 },
            { title: '调整比例%', dataIndex: 'adjustRatio', kind: 'number', width: 120 },
            { title: '调整次数', dataIndex: 'adjustTimes', kind: 'number', width: 120 },
            { title: '剩余未成交阈值%', dataIndex: 'unfilledThreshold', kind: 'number', width: 160 },
            { title: '对冲数量差额阈值', dataIndex: 'diffThreshold', kind: 'number', width: 180 },
            { title: '变动率阈值%', dataIndex: 'changeThreshold', kind: 'number', width: 140 },
          ],
          actions: [{ key: 'edit', label: '编辑', type: 'modal' }],
        }),
      },
      {
        key: 'contracts-account',
        label: '合约账户',
        path: '/contracts/accounts',
        page: listPage({
          title: '合约账户',
          filters: [
            { key: 'address', label: '账户地址', type: 'text' },
            { key: 'memberId', label: '会员ID', type: 'text' },
            { key: 'accountType', label: '账户类型', type: 'select' },
          ],
          columns: [
            { title: '账户类型', dataIndex: 'accountType', kind: 'text', width: 120 },
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '账户', dataIndex: 'account', kind: 'text', width: 220 },
            { title: '币种', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '余额', dataIndex: 'balance', kind: 'number', width: 120 },
            { title: '冻结保证金', dataIndex: 'frozenMargin', kind: 'number', width: 140 },
            { title: '可用余额', dataIndex: 'available', kind: 'number', width: 120 },
            { title: '未实现盈亏', dataIndex: 'unrealizedPnl', kind: 'number', width: 140 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'contracts-mm',
        label: '做市机器人管理',
        path: '/contracts/mm-bots',
        page: listPage({
          title: '做市机器人管理',
          filters: [
            { key: 'coin', label: '选择币种', type: 'text' },
            { key: 'contractType', label: '合约类型', type: 'select' },
          ],
          columns: [
            { title: '合约类型', dataIndex: 'contractType', kind: 'text', width: 120 },
            { title: '币种名称', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '价格变动率', dataIndex: 'priceChange', kind: 'number', width: 140 },
            { title: '盘口档位', dataIndex: 'depthLevel', kind: 'number', width: 120 },
            { title: '挂单数量范围', dataIndex: 'qtyRange', kind: 'text', width: 160 },
            { title: '挂单间隔', dataIndex: 'interval', kind: 'text', width: 120 },
            { title: '状态（开关）', dataIndex: 'enabled', kind: 'switch', width: 140 },
          ],
          actions: [{ key: 'edit', label: '编辑', type: 'modal' }],
        }),
      },
      {
        key: 'contracts-risk-limits',
        label: '风险限额档位设置（TODO）',
        path: '/contracts/risk-limits',
        page: placeholderPage('风险限额档位设置（TODO）', true),
      },
      {
        key: 'contracts-adl',
        label: 'ADL减仓记录',
        path: '/contracts/adl',
        page: listPage({
          title: 'ADL减仓记录',
          filters: [
            { key: 'coin', label: '币种', type: 'text' },
            { key: 'positionId', label: '仓位ID', type: 'text' },
            { key: 'userId', label: '用户ID', type: 'text' },
          ],
          columns: [
            { title: '用户ID', dataIndex: 'userId', kind: 'text', width: 140 },
            { title: '币种', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '仓位ID', dataIndex: 'positionId', kind: 'text', width: 160 },
            { title: '减仓数量', dataIndex: 'qty', kind: 'number', width: 120 },
            { title: '减仓价格', dataIndex: 'price', kind: 'number', width: 120 },
            { title: '减仓盈亏', dataIndex: 'pnl', kind: 'number', width: 120 },
            { title: '创建时间', dataIndex: 'createdAt', kind: 'dateTime', width: 180 },
            { title: '更新时间', dataIndex: 'updatedAt', kind: 'dateTime', width: 180 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
    ],
  },
  {
    key: 'price-module',
    label: '价格模块（TODO）',
    icon: <DatabaseOutlined />,
    children: [
      {
        key: 'price-module-todo',
        label: '价格模块（TODO）',
        path: '/price-module',
        page: placeholderPage('价格模块（TODO）', true),
      },
    ],
  },
  {
    key: 'finance',
    label: '财务流水',
    icon: <WalletOutlined />,
    children: [
      {
        key: 'finance-trades',
        label: '交易明细',
        path: '/finance/trades',
        page: listPage({
          title: '交易明细',
          filters: [
            { key: 'address', label: '账户地址', type: 'text' },
            { key: 'memberId', label: '会员ID', type: 'text' },
            { key: 'tradeType', label: '交易类型', type: 'select' },
            { key: 'walletType', label: '钱包类型', type: 'select' },
            { key: 'amountRange', label: '最高/最低交易金额', type: 'numberRange' },
            { key: 'feeRange', label: '最高/最低手续费', type: 'numberRange' },
            { key: 'timeRange', label: '时间范围', type: 'dateRange' },
          ],
          columns: [
            { title: '订单号', dataIndex: 'orderNo', kind: 'text', width: 180 },
            { title: '账户', dataIndex: 'account', kind: 'text', width: 220 },
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '钱包类型', dataIndex: 'walletType', kind: 'text', width: 120 },
            { title: '交易类型', dataIndex: 'tradeType', kind: 'text', width: 120 },
            { title: '交易前金额', dataIndex: 'beforeAmount', kind: 'number', width: 140 },
            { title: '交易金额', dataIndex: 'amount', kind: 'number', width: 120 },
            { title: '交易后金额', dataIndex: 'afterAmount', kind: 'number', width: 140 },
            { title: '交易时间', dataIndex: 'tradedAt', kind: 'dateTime', width: 180 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'finance-fees',
        label: '手续费管理',
        path: '/finance/fees',
        page: listPage({
          title: '手续费管理',
          filters: [
            { key: 'tradeType', label: '交易类型', type: 'select' },
            { key: 'tradeTime', label: '交易时间', type: 'dateRange' },
          ],
          columns: [
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '账户', dataIndex: 'account', kind: 'text', width: 220 },
            { title: '交易类型', dataIndex: 'tradeType', kind: 'text', width: 120 },
            { title: '币种', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '交易手续费', dataIndex: 'fee', kind: 'number', width: 120 },
            { title: '交易时间', dataIndex: 'tradedAt', kind: 'dateTime', width: 180 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'finance-summary',
        label: '财务统计',
        path: '/finance/summary',
        page: listPage({
          title: '财务统计',
          filters: [{ key: 'timeRange', label: '时间范围', type: 'dateRange' }],
          columns: [
            { title: '日期', dataIndex: 'date', kind: 'dateTime', width: 180 },
            { title: '手续费总收入', dataIndex: 'feeIncome', kind: 'number', width: 140 },
            { title: '提现总额', dataIndex: 'withdrawTotal', kind: 'number', width: 140 },
            { title: '充值总额', dataIndex: 'depositTotal', kind: 'number', width: 140 },
            { title: '平台总盈亏', dataIndex: 'platformPnl', kind: 'number', width: 140 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'finance-deposits',
        label: '充值记录',
        path: '/finance/deposits',
        page: listPage({
          title: '充值记录',
          filters: [
            { key: 'address', label: '账户地址', type: 'text' },
            { key: 'coin', label: '币种', type: 'text' },
            { key: 'protocol', label: '协议', type: 'text' },
            { key: 'timeRange', label: '时间范围', type: 'dateRange' },
          ],
          columns: [
            { title: '会员ID', dataIndex: 'memberId', kind: 'text', width: 120 },
            { title: '用户名', dataIndex: 'username', kind: 'text', width: 160 },
            { title: '充值币种', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '协议名称', dataIndex: 'protocol', kind: 'text', width: 120 },
            { title: '充值地址', dataIndex: 'depositAddress', kind: 'text', width: 260 },
            { title: '充值数量', dataIndex: 'amount', kind: 'number', width: 120 },
            { title: '状态', dataIndex: 'status', kind: 'status', width: 120 },
            { title: '哈希', dataIndex: 'hash', kind: 'text', width: 260 },
            { title: '确认数', dataIndex: 'confirmations', kind: 'number', width: 120 },
            { title: '到账时间', dataIndex: 'arrivedAt', kind: 'dateTime', width: 180 },
          ],
          actions: [{ key: 'view', label: '查看', type: 'drawer' }],
        }),
      },
      {
        key: 'finance-withdraw-review',
        label: '提币审核',
        path: '/finance/withdraw-review',
        page: listPage({
          title: '提币审核',
          filters: [
            { key: 'contact', label: '邮箱/手机', type: 'text' },
            { key: 'toAddress', label: '到账地址', type: 'text' },
            { key: 'coin', label: '币种', type: 'text' },
            { key: 'protocol', label: '协议', type: 'text' },
            { key: 'status', label: '状态', type: 'select' },
            { key: 'submitTime', label: '提交时间', type: 'dateRange' },
            { key: 'auditTime', label: '审核时间', type: 'dateRange' },
            { key: 'hash', label: '哈希', type: 'text' },
          ],
          columns: [
            { title: '邮箱/手机号', dataIndex: 'contact', kind: 'text', width: 180 },
            { title: '提现币种', dataIndex: 'coin', kind: 'text', width: 120 },
            { title: '协议名称', dataIndex: 'protocol', kind: 'text', width: 120 },
            { title: '到账地址', dataIndex: 'toAddress', kind: 'text', width: 260 },
            { title: '提现数量', dataIndex: 'amount', kind: 'number', width: 120 },
            { title: '手续费', dataIndex: 'fee', kind: 'number', width: 120 },
            { title: '到账数量', dataIndex: 'arriveAmount', kind: 'number', width: 120 },
            { title: '提现时间', dataIndex: 'withdrawAt', kind: 'dateTime', width: 180 },
            { title: '审核时间', dataIndex: 'auditAt', kind: 'dateTime', width: 180 },
            { title: 'Hash', dataIndex: 'hash', kind: 'text', width: 260 },
            { title: '状态', dataIndex: 'status', kind: 'status', width: 120 },
          ],
          actions: [
            { key: 'approve', label: '通过', type: 'modal' },
            { key: 'reject', label: '拒绝', type: 'modal', danger: true },
          ],
        }),
      },
    ],
  },
]

export type FlatRoute = {
  path: string
  labels: string[]
  page: PageConfig
}

export const flatRoutes: FlatRoute[] = []

const walk = (nodes: NavNode[], parents: string[]) => {
  for (const node of nodes) {
    const nextParents = [...parents, node.label]
    if (node.path && node.page) {
      flatRoutes.push({ path: node.path, labels: nextParents, page: node.page })
    }
    if (node.children?.length) {
      walk(node.children, nextParents)
    }
  }
}

walk(navTree, [])

export const routeMap = new Map<string, FlatRoute>(
  flatRoutes.map((r) => [r.path, r]),
)

export const buildMenuItems = (nodes: NavNode[]): ItemType[] =>
  nodes.map((node) => {
    if (node.children?.length) {
      return {
        key: node.key,
        icon: node.icon,
        label: node.label,
        children: buildMenuItems(node.children),
      }
    }

    return {
      key: node.path ?? node.key,
      icon: node.icon,
      label: node.label,
    }
  })

type KeyPathResult = { selectedKey: string; openKeys: string[] }

export const getMenuKeyPathByPathname = (
  nodes: NavNode[],
  pathname: string,
): KeyPathResult => {
  const openKeys: string[] = []
  let selectedKey = pathname

  const dfs = (list: NavNode[], parents: string[]): boolean => {
    for (const n of list) {
      if (n.children?.length) {
        if (dfs(n.children, [...parents, n.key])) {
          return true
        }
      }
      if (n.path === pathname) {
        openKeys.push(...parents)
        selectedKey = pathname
        return true
      }
    }
    return false
  }

  dfs(nodes, [])

  return { selectedKey, openKeys }
}

export const sidebarTitle = 'DEX Admin'

export const iconMap: Record<string, ReactNode> = {
  members: <UserOutlined />,
  invite: <PercentageOutlined />,
  contracts: <DollarOutlined />,
  finance: <WalletOutlined />,
  content: <FileTextOutlined />,
  system: <SettingOutlined />,
  risk: <SafetyCertificateOutlined />,
  bot: <RobotOutlined />,
  log: <AuditOutlined />,
  global: <GlobalOutlined />,
  data: <DatabaseOutlined />,
  notice: <NotificationOutlined />,
}
