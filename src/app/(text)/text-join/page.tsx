'use client'
import {ReactNode, useMemo, useState} from 'react'
import {Page} from '@/components/page/Page'
import {InputText} from '@/components/form/InputText'
import {Button} from '@/components/Button'

export type TextJoinPageProps = {}

export default function TextJoinPage(props: TextJoinPageProps) {

  const [textInput, setTextInput] = useState('')
  const [separator, setSeparator] = useState(',')
  const [quote, setQuote] = useState('\'')
  const [textJoined, setTextJoined] = useState('')

  const textInputList = useMemo(() => {
    return textInput
      .split('\n')
      .map(v => v.trim())
      .filter(v => v)
  }, [textInput])

  const joinText = () => {

    const textJoined = textInputList
      .map(v => `${quote}${v}${quote}`)
      .join(separator)

    setTextJoined(textJoined)
  }

  return (
    <Page title={`文本合并`}>
      <div className={`flex flex-col gap-8 py-8`}>
        <InputText
          name={`text`}
          label={`文本（${textInputList.length} 行）`}
          multiline={10}
          value={textInput}
          onChange={v => setTextInput(v || '')}
        />
        <div className={`flex gap-4`}>
          <InputText
            name={`separator`}
            label={`分隔符号`}
            value={separator}
            onChange={v => setSeparator(v || '')}
          />
          <InputText
            name={`quote`}
            label={`包裹符号`}
            value={quote}
            onChange={v => setQuote(v || '')}
          />
        </div>
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
