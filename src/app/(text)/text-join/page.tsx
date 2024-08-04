'use client'
import {ReactNode, useState} from 'react'
import {Page} from '@/components/page/Page'
import {InputText} from '@/components/form/InputText'
import {Button} from '@/components/Button'

export type TextJoinPageProps = {}

export default function TextJoinPage(props: TextJoinPageProps) {

  const [textInput, setTextInput] = useState('')
  const [separator, setSeparator] = useState(',')
  const [textJoined, setTextJoined] = useState('')

  const joinText = () => {
    setTextJoined(
      textInput
        .split('\n')
        .map(v => v.trim())
        .filter(v => v)
        .join(separator)
    )
  }

  return (
    <Page title={`文本合并`}>
      <div className={`flex flex-col gap-8 py-8`}>
        <InputText
          name={`text`}
          label={`文本`}
          multiline={10}
          value={textInput}
          onChange={v => setTextInput(v || '')}
        />
        <InputText
          name={`separator`}
          label={`分隔符`}
          value={separator}
          onChange={v => setSeparator(v || '')}
        />
        <Button type={`primary`} onClick={joinText}>合并</Button>
        <InputText
          name={`textJoined`}
          label={`合并后`}
          multiline={10}
          value={textJoined}
          readonly
        />
      </div>
    </Page>
  )
}
