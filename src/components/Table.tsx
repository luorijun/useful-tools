import {ReactNode} from 'react'

export type TableColumn<T> = {
  label: string
  name?: string
  builder?: (value: T, index: number) => (ReactNode | string)
}

export type TableProps<T extends Record<string, any>> = {
  data?: T[]
  columns?: TableColumn<T>[]
  loading?: boolean
  selectable?: boolean
  selected?: T[]
  onSelect?: (selected: T[]) => void
}

export function Table<T extends Record<string, any>>(props: TableProps<T>) {

  const columns = props.columns ?? []
  const data = props.data ?? []

  return (
    <table className={`w-full border border-separate border-spacing-0 rounded-lg`}>
      <thead>
        <tr className={`h-10`}>
          {columns.map((column, index) => (
            <th key={index} className={`px-4 border-r font-normal last:border-r-0`}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.loading &&
          <LoadData span={columns.length}/>}

        {!props.loading && data.length === 0 &&
          <EmptyData span={columns.length}/>}

        {!props.loading && data.length > 0 &&
          <ShowData columns={columns} data={data}/>}
      </tbody>
    </table>
  )
}

function LoadData({
  span,
}: {
  span: number
}) {
  return (
    <tr>
      <td colSpan={span} className={`h-10 border-t text-center align-middle text-gray-500`}>
        加载中...
      </td>
    </tr>
  )
}

function EmptyData({
  span,
}: {
  span: number
}) {
  return (
    <tr>
      <td colSpan={span} className={`h-10 border-t text-center align-middle text-gray-500`}>
        暂无数据
      </td>
    </tr>
  )
}

function ShowData<T extends Record<string, any>>({
  columns,
  data,
}: {
  columns: TableColumn<T>[]
  data: T[]
}) {
  return <>
    {data.map((row, index) => (
      <tr key={index} className={`h-10`}>
        {columns.map((column, index) => (
          <td key={index} className={`border-t`} align={`center`}>
            {column.builder?.(row, index) ?? row[column.name!]}
          </td>
        ))}
      </tr>
    ))}
  </>
}
