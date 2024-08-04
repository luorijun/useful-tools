'use client'
import {Page} from '@/components/page/Page'
import {InputText} from '@/components/form/InputText'
import {useState} from 'react'
import {Button} from '@/components/Button'


export default function TextDuplicatePage() {

  const [textA, setTextA] = useState<string>()
  const [textB, setTextB] = useState<string>()

  return (
    <Page title={`文本去重`}>
      <div className={`flex flex-col gap-8 py-8`}>
        {/* 输入 */}
        <div className={`flex-auto flex flex-row gap-4`}>
          <InputText
            name={`textA`}
            label={`文本一`}
            value={textA}
            onChange={setTextA}
            multiline={10}
          />

          <InputText
            name={`textB`}
            label={`文本二`}
            value={textB}
            onChange={setTextB}
            multiline={10}
          />
        </div>

        {/* 结果 */}
        <Button type={`primary`}>去重</Button>
      </div>
    </Page>
  )
}
