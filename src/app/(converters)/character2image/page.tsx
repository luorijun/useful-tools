'use client'
import {Page} from '@/components/Page'
import {Section} from '@/components/Section'
import {InputText} from '@/components/InputText'
import {useEffect, useRef, useState} from 'react'
import {InputNumber} from '@/components/InputNumber'
import {Select} from '@/components/Select'
import {Button} from '@/components/Button'

type FontWeight = 'normal' | 'bold'
type FontStyle = 'normal' | 'italic'

type ImgCrop = 'fixed' | 'fit'
type ImgAlign = 'tl' | 'tc' | 'tr' | 'cl' | 'cc' | 'cr' | 'bl' | 'bc' | 'br'

export default function Character2Image() {
  const canvas = useRef<HTMLCanvasElement>(null)

  const [character, setCharacter] = useState('🤭👉😭💔')
  const [fontFamily, setFontFamily] = useState('serif')
  const [fontSize, setFontSize] = useState(96)
  const [fontWeight, setFontWeight] = useState<FontWeight>('normal')
  const [fontStyle, setFontStyle] = useState<FontStyle>('normal')

  const [imgCrop, setImgCrop] = useState<ImgCrop>('fixed')
  const [imgAlign, setImgAlign] = useState<ImgAlign>('cc')
  const [imgBorder, setImgBorder] = useState(10)

  // draw character to canvas
  useEffect(() => {
    if (!canvas.current) return

    const ctx = canvas.current.getContext('2d')
    if (!ctx) return

    // 配置 hdpi
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.current.getBoundingClientRect()
    canvas.current.width = rect.width * dpr
    canvas.current.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // 绘制字符
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(character, rect.width / 2, rect.height / 2)

  }, [character, fontFamily, fontSize, fontWeight, fontStyle])

  const trimImageFixed = (input: HTMLCanvasElement, align: ImgAlign = 'cc') => {
  }

  const trimImageFit = (input: HTMLCanvasElement, border: number = 10) => {
    const iContext = input.getContext('2d')
    if (!iContext) throw new Error('Cannot get context of input canvas')
    const imageData = iContext.getImageData(0, 0, input.width, input.height)
    const width = imageData.width
    const height = imageData.height

    let minX = width, minY = height, maxX = 0, maxY = 0
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const i = (y * width + x) * 4
        const a = imageData.data[i + 3]
        if (a !== 0) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }

    minX = Math.max(0, minX - border)
    minY = Math.max(0, minY - border)
    maxX = Math.min(width - 1, maxX + border)
    maxY = Math.min(height - 1, maxY + border)

    const output = document.createElement('canvas')
    output.width = maxX - minX + 1
    output.height = maxY - minY + 1
    const oContext = output.getContext('2d')
    if (!oContext) throw new Error('Cannot get context of output canvas')
    oContext.putImageData(imageData, -minX, -minY)

    return output
  }

  const exportImage = () => {
    if (!canvas.current) return
    const newCanvas = trimImageFit(canvas.current)

    const dataURL = newCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${character}.png`
    link.href = dataURL
    link.click()

    link.remove()
    newCanvas.remove()
  }

  // render
  return (
    <Page title={`字符转图像`}>

      <Section gap title={`字符设置`}>
        <div className={`flex-none flex gap-4`}>
          <InputText
            readonly
            label={`字体`}
            placeholder={`输入字体`}
            value={fontFamily}
            onChange={setFontFamily}
          />
          <InputNumber
            label={`字体大小`}
            placeholder={`输入字体大小`}
            value={fontSize}
            onChange={setFontSize}
          />
          <Select
            required
            label={`字体粗细`}
            options={[
              {label: '正常', value: 'normal'},
              {label: '粗体', value: 'bold'},
            ]}
            value={fontWeight}
            onChange={setFontWeight}
          />
          <Select
            required
            label={`字体样式`}
            options={[
              {label: '正常', value: 'normal'},
              {label: '斜体', value: 'italic'},
            ]}
            value={fontStyle}
            onChange={setFontStyle}
          />
        </div>
      </Section>

      <Section title={`图像设置`}>
        <div className={`flex-none flex gap-4`}>
          <Select
            required
            label={`剪裁方式`}
            options={[
              // {label: '固定大小', value: 'fixed'},
              {label: '贴合内容', value: 'fit'},
            ]}
            value={imgCrop}
            onChange={setImgCrop}
          />
          {imgCrop === 'fixed' && (
            <Select
              required
              label={`对齐方式`}
              options={[
                {label: '左上', value: 'tl'},
                {label: '正上', value: 'tc'},
                {label: '右上', value: 'tr'},
                {label: '正左', value: 'cl'},
                {label: '居中', value: 'cc'},
                {label: '正右', value: 'cr'},
                {label: '左下', value: 'bl'},
                {label: '正下', value: 'bc'},
                {label: '右下', value: 'br'},
              ]}
              value={imgAlign}
              onChange={setImgAlign}
            />
          )}
          {imgCrop === 'fit' && (
            <InputNumber
              label={`边框`}
              placeholder={`输入边框`}
              value={imgBorder}
              onChange={setImgBorder}
            />
          )}
        </div>
      </Section>

      <Section gap title={`绘制`}>

        <InputText
          label={`字符`}
          placeholder={`输入任意字符`}
          value={character}
          onChange={setCharacter}
        />

        <canvas ref={canvas} className={`w-full h-64`}/>

        <Button onClick={exportImage}>下载</Button>
      </Section>
    </Page>
  )
}
