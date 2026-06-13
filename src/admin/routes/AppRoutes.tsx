import { Navigate, useRoutes } from 'react-router-dom'
import { defaultPath, flatRoutes } from '../config/appConfig'
import { AdminLayout } from '../layout/AdminLayout'
import { CrudListPage } from '../pages/CrudListPage'
import { NotFound } from '../pages/NotFound'
import { PagePlaceholder } from '../pages/PagePlaceholder'
import { UsdcContractPairsPage } from '../pages/UsdcContractPairsPage'

const toChildPath = (absolutePath: string) =>
  absolutePath.startsWith('/') ? absolutePath.slice(1) : absolutePath

export function AppRoutes() {
  const routes = useRoutes([
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to={defaultPath} replace /> },
        ...flatRoutes.map((r) => ({
          path: toChildPath(r.path),
          element:
            r.path === '/contract-listing/pair-config' ? (
              <UsdcContractPairsPage />
            ) : r.page.kind === 'list' ? (
              <CrudListPage config={r.page.config} />
            ) : (
              <PagePlaceholder title={r.page.title} todo={r.page.todo} />
            ),
        })),
        { path: '*', element: <NotFound /> },
      ],
    },
  ])

  return routes
}
