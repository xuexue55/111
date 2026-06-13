import { Card, Tag, Typography } from 'antd'

export function PagePlaceholder({
  title,
  todo,
}: {
  title: string
  todo?: boolean
}) {
  return (
    <Card
      title={
        <span>
          {title} {todo ? <Tag color="gold">TODO</Tag> : null}
        </span>
      }
    >
      <Typography.Text type="secondary">
        该页面已创建路由与菜单，占位用于后续对接接口与完善交互。
      </Typography.Text>
    </Card>
  )
}

