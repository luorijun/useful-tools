'use client'
import {Page, PageProps} from '@/components/page/Page'
import {Table, TableColumn} from '@/components/Table'
import {createContext, useContext, useEffect, useId, useState} from 'react'
import {useStatus, wrapHttpStatus} from '@/utils/status'
import {Button} from '@/components/Button'
import {Dialog} from '@/components/feedbacks/Dialog'
import {AlertDialog} from '@/components/feedbacks/AlertDialog'
import {FieldProxyProps, Form} from '@/components/form/Form'
import {Message} from '@/components/feedbacks/Message'

type Model = Record<string, any>

export type ModelPageProps<T extends Model> = {
  api: string
  name: string
  operations?: Operation
  tableColumns: TableColumn<T>[]
  addFormFields?: FieldProxyProps[]
  editFormFields?: FieldProxyProps[]
  keyProp?: keyof T
} & Omit<PageProps, 'title'>

export type Operation = {
  add?: boolean
  edit?: boolean
  delete?: boolean
}

export const OperationStateful = {
  add: true,
  edit: true,
  delete: true,
}

export const OperationReadonly = {
  add: false,
  edit: false,
  delete: false,
}

export const OperationImmutable = {
  add: true,
  edit: false,
  delete: true,
}

const ModelPageContext = createContext<{
  props: ModelPageProps<any>
  refresh: () => Promise<void>
} | null>(null)

/**
 * 模型页面
 */
export default function ModelPage<T extends Model>(rawProps: ModelPageProps<T>) {
  const props = {
    operations: OperationStateful,
    ...rawProps,
  }

  // 组件初始化
  const [loadStatus, setLoadStatus] = useStatus()
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    refresh().then()
  }, [])

  // 组件函数
  const refresh = async () => {
    const {success, data} = await wrapHttpStatus(() => {
      return fetch(process.env.NEXT_PUBLIC_PROJECT_API_URL + props.api)
    }, setLoadStatus)
    setData(success ? data : [])
  }

  // 返回视图
  return (
    <Page title={`${props.name}管理`}>
      <ModelPageContext.Provider
        value={{
          props: props,
          refresh,
        }}>

        {/* 全局操作栏 */}
        <div className={`flex gap-4`}>
          {props.operations?.add && <AddModel/>}
          {props.operations?.delete && <RemoveSelectedModel/>}
        </div>


        {/* 数据表格 */}
        <Table<T>
          loading={loadStatus === 'load'}
          data={data}
          columns={props.tableColumns.concat({
            label: '操作',
            builder: (model, index) => (
              <div className={`flex gap-2 justify-center`}>
                {props.operations?.edit && <EditModel<T> index={index} model={model}/>}
                {props.operations?.delete && <RemoveModel<T> index={index} model={model}/>}
              </div>
            ),
          })}
        />

      </ModelPageContext.Provider>
    </Page>
  )
}

function AddModel() {
  const context = useContext(ModelPageContext)
  if (!context) throw new Error(`ModelPageContext is null`)

  const {props, refresh} = context
  const {api, name, addFormFields} = props

  const formId = useId()
  const [status, setStatus] = useStatus()
  const [showDialog, setShowDialog] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [showFail, setShowFail] = useState(false)

  const onSubmit = async (model: Model) => {
    const {success} = await wrapHttpStatus(() => {
      return fetch(process.env.NEXT_PUBLIC_PROJECT_API_URL + api, {
        method: 'POST',
        body: JSON.stringify(model),
      })
    }, setStatus)

    if (success) {
      setShowDialog(false)
      setShowDone(true)
      await refresh()
    }
    else {
      setShowFail(true)
    }
  }

  return <div>
    <Button
      type={`primary`}
      onClick={() => setShowDialog(true)}
    >
      新增
    </Button>

    <Dialog
      show={showDialog}
      title={`新增${name}`}
      width={500}
      onClose={() => setShowDialog(false)}
    >
      <Form
        id={formId}
        fields={addFormFields}
        onSubmit={onSubmit}
      />

      <Dialog.Footer>
        <Button onClick={() => setShowDialog(false)}>
          取消
        </Button>
        <Button type={`danger`} wait={status === 'load'} form={formId} mode={`submit`}>
          确定
        </Button>
      </Dialog.Footer>
    </Dialog>

    <Message type={`success`} open={showDone} onClose={() => setShowDone(false)}>
      {`新增${name}成功`}
    </Message>

    <Message type={`error`} open={showFail} onClose={() => setShowFail(false)}>
      {`新增${name}失败`}
    </Message>
  </div>
}

function EditModel<T extends Model>({
  index,
  model,
}: {
  index: number
  model: T
}) {
  const context = useContext(ModelPageContext)
  if (!context) throw new Error(`ModelPageContext is null`)
  const {props, refresh} = context
  const modelId = model[props.keyProp as string]

  const key = props.keyProp ? modelId : `edit-${index}`
  const formId = useId()
  const [status, setStatus] = useStatus()
  const [showDialog, setShowDialog] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [showFail, setShowFail] = useState(false)

  const onSubmit = async (value: Model) => {
    const {success} = await wrapHttpStatus(() => {
      return fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL + props.api}/${modelId}`, {
        method: 'PUT',
        body: JSON.stringify(value),
      })
    }, setStatus)

    if (success) {
      setShowDialog(false)
      setShowDone(true)
      await refresh()
    }
    else {
      setShowFail(true)
    }
  }

  return <div>
    <Button
      key={key}
      type={`primary`}
      size={`small`}
      onClick={() => setShowDialog(true)}
    >
      编辑
    </Button>

    <Dialog
      show={showDialog}
      title={`编辑`}
      width={500}
      onClose={() => setShowDialog(false)}
    >
      <Form
        id={formId}
        value={model}
        fields={props.editFormFields}
        onSubmit={onSubmit}
      />

      <Dialog.Footer>
        <Button onClick={() => setShowDialog(false)}>
          取消
        </Button>
        <Button type={`danger`} wait={status === 'load'} form={formId} mode={`submit`}>
          确定
        </Button>
      </Dialog.Footer>
    </Dialog>

    <Message type={`success`} open={showDone} onClose={() => setShowDone(false)}>
      {`编辑成功`}
    </Message>

    <Message type={`error`} open={showFail} onClose={() => setShowFail(false)}>
      {`编辑失败`}
    </Message>
  </div>
}

function RemoveModel<T extends Model>({
  index,
  model,
}: {
  index: number
  model: T
}) {
  const context = useContext(ModelPageContext)
  if (!context) throw new Error(`ModelPageContext is null`)
  const {props, refresh} = context
  const modelId = model[props.keyProp as string]

  const key = props.keyProp ? modelId : `remove-${index}`
  const [showDialog, setShowDialog] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [showFail, setShowFail] = useState(false)

  const remove = async () => {
    const {success} = await wrapHttpStatus(() => {
      return fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL + props.api}/${modelId}`, {
        method: 'DELETE',
      })
    })

    if (success) {
      setShowDialog(false)
      setShowDone(true)
      await refresh()
    }
    else {
      setShowFail(true)
    }
  }

  return <div>
    <Button
      key={key}
      type={`danger`}
      size={`small`}
      onClick={() => setShowDialog(true)}
    >
      删除
    </Button>

    <AlertDialog
      show={showDialog}
      onConfirm={remove}
      onClose={() => setShowDialog(false)}
    >
      你确定要删除这条数据吗？
    </AlertDialog>

    <Message type={`success`} open={showDone} onClose={() => setShowDone(false)}>
      {`删除成功`}
    </Message>

    <Message type={`error`} open={showFail} onClose={() => setShowFail(false)}>
      {`删除失败`}
    </Message>
  </div>
}

function RemoveSelectedModel() {
  const context = useContext(ModelPageContext)
  if (!context) {
    throw new Error(`ModelPageContext is null`)
  }

  const [show, setShow] = useState(false)
  return <div>
    <Button type={`danger`} onClick={() => setShow(true)}>
      删除已选
    </Button>

    <AlertDialog show={show} onClose={() => setShow(false)}>
      你确定要删除所选数据吗？
    </AlertDialog>
  </div>
}
