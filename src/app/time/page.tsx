'use client'
import {useState, useEffect} from 'react'
import {Page} from '@/components/page/Page'
import {InputText} from '@/components/form/InputText'
import {Button} from '@/components/Button'
import {Select} from '@/components/form/Select'
import {Section} from '@/components/Section'

export type TimePageProps = {}

// 预置的时间格式配置
const presetFormats = {
  input: [
    { label: '自动检测', value: 'auto', example: '自动识别格式' },
    { label: 'Unix 时间戳(秒)', value: 'timestamp', example: '1609459200' },
    { label: 'Unix 时间戳(毫秒)', value: 'timestamp_ms', example: '1609459200000' },
    { label: 'ISO 8601', value: 'iso', example: '2021-01-01T00:00:00.000Z' },
    { label: 'YYYY-MM-DD HH:mm:ss', value: 'preset_1', example: '2021-01-01 00:00:00' },
    { label: 'MM/DD/YYYY HH:mm:ss', value: 'preset_2', example: '01/01/2021 00:00:00' },
    { label: 'DD/MM/YYYY HH:mm:ss', value: 'preset_3', example: '01/01/2021 00:00:00' },
    { label: 'MMM DD, YYYY HH:mm:ss', value: 'preset_4', example: 'Jan 01, 2021 00:00:00' },
    { label: 'DD MMM YYYY HH:mm:ss', value: 'preset_5', example: '01 Jan 2021 00:00:00' },
    { label: 'YYYY年MM月DD日 HH:mm:ss', value: 'preset_6', example: '2021年01月01日 00:00:00' },
    { label: '自定义格式', value: 'custom', example: '使用自定义格式' }
  ],
  output: [
    { label: 'Unix 时间戳(秒)', value: 'timestamp', example: '1609459200' },
    { label: 'Unix 时间戳(毫秒)', value: 'timestamp_ms', example: '1609459200000' },
    { label: 'ISO 8601', value: 'iso', example: '2021-01-01T00:00:00.000Z' },
    { label: '可读格式', value: 'readable', example: '2021-01-01 00:00:00' },
    { label: 'YYYY-MM-DD HH:mm:ss', value: 'preset_1', example: '2021-01-01 00:00:00' },
    { label: 'MM/DD/YYYY HH:mm:ss', value: 'preset_2', example: '01/01/2021 00:00:00' },
    { label: 'DD/MM/YYYY HH:mm:ss', value: 'preset_3', example: '01/01/2021 00:00:00' },
    { label: 'MMM DD, YYYY HH:mm:ss', value: 'preset_4', example: 'Jan 01, 2021 00:00:00' },
    { label: 'DD MMM YYYY HH:mm:ss', value: 'preset_5', example: '01 Jan 2021 00:00:00' },
    { label: 'YYYY年MM月DD日 HH:mm:ss', value: 'preset_6', example: '2021年01月01日 00:00:00' },
    { label: '自定义格式', value: 'custom', example: '使用自定义格式' }
  ]
}

// 英文月份映射
const monthNames = {
  short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
}

const monthMap = new Map<string, number>()
monthNames.short.forEach((month, index) => monthMap.set(month.toLowerCase(), index))
monthNames.long.forEach((month, index) => monthMap.set(month.toLowerCase(), index))

export default function TimePage(props: TimePageProps) {
  const [currentTime, setCurrentTime] = useState('')
  const [inputTime, setInputTime] = useState('')
  const [inputFormat, setInputFormat] = useState<string>('auto')
  const [customInputFormat, setCustomInputFormat] = useState('')
  const [outputFormat, setOutputFormat] = useState<string>('timestamp')
  const [customOutputFormat, setCustomOutputFormat] = useState('YYYY-MM-DD HH:mm:ss')
  const [convertedTime, setConvertedTime] = useState('')
  const [error, setError] = useState('')
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [batchResults, setBatchResults] = useState<string[]>([])
  const [selectedPresetInput, setSelectedPresetInput] = useState('')
  const [selectedPresetOutput, setSelectedPresetOutput] = useState('')

  // 更新当前时间
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }))
    }
    
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // 检测批量模式
  useEffect(() => {
    const lines = inputTime.split('\n').filter(line => line.trim())
    setIsBatchMode(lines.length > 1)
  }, [inputTime])

  // 获取当前时间戳
  const getCurrentTimestamp = () => {
    setInputTime(Date.now().toString())
    setInputFormat('timestamp')
  }

  // 获取当前ISO时间
  const getCurrentISO = () => {
    setInputTime(new Date().toISOString())
    setInputFormat('iso')
  }

  // 应用预置格式
  const applyPresetFormat = (type: 'input' | 'output', preset: string) => {
    const format = presetFormats[type].find(f => f.value === preset)
    if (!format) return

    if (type === 'input') {
      setInputFormat(preset)
      setSelectedPresetInput(preset)
    } else {
      setOutputFormat(preset)
      setSelectedPresetOutput(preset)
    }
  }

  // 解析英文月份
  const parseEnglishMonth = (monthStr: string): number => {
    const month = monthMap.get(monthStr.toLowerCase())
    return month !== undefined ? month : -1
  }

  // 格式化英文月份
  const formatEnglishMonth = (monthIndex: number, format: 'short' | 'long' = 'short'): string => {
    return monthNames[format][monthIndex] || ''
  }

  // 解析预置格式的时间
  const parsePresetTime = (timeStr: string, format: string): Date | null => {
    if (!timeStr) return null
    
    try {
      switch (format) {
        case 'preset_1': // YYYY-MM-DD HH:mm:ss
          return new Date(timeStr)
        
        case 'preset_2': // MM/DD/YYYY HH:mm:ss
          const [datePart2, timePart2] = timeStr.split(' ')
          const [month2, day2, year2] = datePart2.split('/')
          return new Date(`${year2}-${month2}-${day2} ${timePart2}`)
        
        case 'preset_3': // DD/MM/YYYY HH:mm:ss
          const [datePart3, timePart3] = timeStr.split(' ')
          const [day3, month3, year3] = datePart3.split('/')
          return new Date(`${year3}-${month3}-${day3} ${timePart3}`)
        
        case 'preset_4': // MMM DD, YYYY HH:mm:ss
          const regex4 = /(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(.+)/
          const match4 = timeStr.match(regex4)
          if (match4) {
            const monthIndex = parseEnglishMonth(match4[1])
            if (monthIndex >= 0) {
              return new Date(`${match4[3]}-${(monthIndex + 1).toString().padStart(2, '0')}-${match4[2].padStart(2, '0')} ${match4[4]}`)
            }
          }
          return null
        
        case 'preset_5': // DD MMM YYYY HH:mm:ss
          const regex5 = /(\d{1,2})\s+(\w+)\s+(\d{4})\s+(.+)/
          const match5 = timeStr.match(regex5)
          if (match5) {
            const monthIndex = parseEnglishMonth(match5[2])
            if (monthIndex >= 0) {
              return new Date(`${match5[3]}-${(monthIndex + 1).toString().padStart(2, '0')}-${match5[1].padStart(2, '0')} ${match5[4]}`)
            }
          }
          return null
        
        case 'preset_6': // YYYY年MM月DD日 HH:mm:ss
          const regex6 = /(\d{4})年(\d{1,2})月(\d{1,2})日\s+(.+)/
          const match6 = timeStr.match(regex6)
          if (match6) {
            return new Date(`${match6[1]}-${match6[2].padStart(2, '0')}-${match6[3].padStart(2, '0')} ${match6[4]}`)
          }
          return null
        
        default:
          return new Date(timeStr)
      }
    } catch (e) {
      return null
    }
  }

  // 解析时间字符串
  const parseTime = (timeStr: string, format: string): Date | null => {
    if (!timeStr) return null
    
    try {
      switch (format) {
        case 'timestamp':
          const timestamp = parseInt(timeStr)
          if (isNaN(timestamp)) return null
          // 判断是秒还是毫秒时间戳
          return new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
        
        case 'timestamp_ms':
          const timestampMs = parseInt(timeStr)
          if (isNaN(timestampMs)) return null
          return new Date(timestampMs)
        
        case 'iso':
          return new Date(timeStr)
        
        case 'auto':
          // 自动检测格式
          if (/^\d{10}$/.test(timeStr)) {
            return new Date(parseInt(timeStr) * 1000)
          } else if (/^\d{13}$/.test(timeStr)) {
            return new Date(parseInt(timeStr))
          } else {
            // 尝试解析各种预置格式
            for (const preset of presetFormats.input) {
              if (preset.value.startsWith('preset_')) {
                const result = parsePresetTime(timeStr, preset.value)
                if (result && !isNaN(result.getTime())) {
                  return result
                }
              }
            }
            return new Date(timeStr)
          }
        
        case 'custom':
          return parseCustomTime(timeStr, customInputFormat)
        
        default:
          if (format.startsWith('preset_')) {
            return parsePresetTime(timeStr, format)
          }
          return new Date(timeStr)
      }
    } catch (e) {
      return null
    }
  }

  // 解析自定义格式
  const parseCustomTime = (timeStr: string, format: string): Date | null => {
    // 简化的自定义格式解析，支持基本的 YYYY-MM-DD HH:mm:ss 格式
    try {
      return new Date(timeStr)
    } catch (e) {
      return null
    }
  }

  // 格式化预置格式的时间
  const formatPresetTime = (date: Date, format: string): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    
    const paddedMonth = month.toString().padStart(2, '0')
    const paddedDay = day.toString().padStart(2, '0')
    const paddedHours = hours.toString().padStart(2, '0')
    const paddedMinutes = minutes.toString().padStart(2, '0')
    const paddedSeconds = seconds.toString().padStart(2, '0')
    
    switch (format) {
      case 'preset_1': // YYYY-MM-DD HH:mm:ss
        return `${year}-${paddedMonth}-${paddedDay} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      
      case 'preset_2': // MM/DD/YYYY HH:mm:ss
        return `${paddedMonth}/${paddedDay}/${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      
      case 'preset_3': // DD/MM/YYYY HH:mm:ss
        return `${paddedDay}/${paddedMonth}/${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      
      case 'preset_4': // MMM DD, YYYY HH:mm:ss
        const shortMonth = formatEnglishMonth(date.getMonth(), 'short')
        return `${shortMonth} ${paddedDay}, ${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      
      case 'preset_5': // DD MMM YYYY HH:mm:ss
        const shortMonth5 = formatEnglishMonth(date.getMonth(), 'short')
        return `${paddedDay} ${shortMonth5} ${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      
      case 'preset_6': // YYYY年MM月DD日 HH:mm:ss
        return `${year}年${paddedMonth}月${paddedDay}日 ${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      
      default:
        return date.toString()
    }
  }

  // 格式化时间
  const formatTime = (date: Date, format: string, customFormat?: string): string => {
    switch (format) {
      case 'timestamp':
        return Math.floor(date.getTime() / 1000).toString()
      
      case 'timestamp_ms':
        return date.getTime().toString()
      
      case 'iso':
        return date.toISOString()
      
      case 'readable':
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      
      case 'custom':
        if (!customFormat) return date.toString()
        return formatCustomTime(date, customFormat)
      
      default:
        if (format.startsWith('preset_')) {
          return formatPresetTime(date, format)
        }
        return date.toString()
    }
  }

  // 自定义格式化
  const formatCustomTime = (date: Date, format: string): string => {
    const map: { [key: string]: string } = {
      'YYYY': date.getFullYear().toString(),
      'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
      'DD': date.getDate().toString().padStart(2, '0'),
      'HH': date.getHours().toString().padStart(2, '0'),
      'mm': date.getMinutes().toString().padStart(2, '0'),
      'ss': date.getSeconds().toString().padStart(2, '0'),
      'SSS': date.getMilliseconds().toString().padStart(3, '0')
    }
    
    let result = format
    Object.keys(map).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), map[key])
    })
    
    return result
  }

  // 执行转换
  const convertTime = () => {
    setError('')
    setBatchResults([])
    
    if (!inputTime.trim()) {
      setError('请输入时间')
      return
    }

    const lines = inputTime.split('\n').filter(line => line.trim())
    
    if (lines.length === 1) {
      // 单行转换
      const parsedDate = parseTime(lines[0], inputFormat)
      if (!parsedDate || isNaN(parsedDate.getTime())) {
        setError('无法解析输入的时间格式')
        return
      }

      try {
        const result = formatTime(parsedDate, outputFormat, customOutputFormat)
        setConvertedTime(result)
      } catch (e) {
        setError('转换失败，请检查输出格式')
      }
    } else {
      // 批量转换
      const results: string[] = []
      const errors: string[] = []
      
      lines.forEach((line, index) => {
        try {
          const parsedDate = parseTime(line.trim(), inputFormat)
          if (!parsedDate || isNaN(parsedDate.getTime())) {
            errors.push(`第 ${index + 1} 行: 无法解析时间格式`)
            results.push(`错误: 无法解析`)
          } else {
            const result = formatTime(parsedDate, outputFormat, customOutputFormat)
            results.push(result)
          }
        } catch (e) {
          errors.push(`第 ${index + 1} 行: 转换失败`)
          results.push(`错误: 转换失败`)
        }
      })
      
      setBatchResults(results)
      setConvertedTime(results.join('\n'))
      
      if (errors.length > 0) {
        setError(`部分转换失败:\n${errors.join('\n')}`)
      }
    }
  }

  // 复制结果到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(convertedTime)
      // 这里可以添加成功提示
    } catch (e) {
      setError('复制失败')
    }
  }

  // 清空所有内容
  const clearAll = () => {
    setInputTime('')
    setConvertedTime('')
    setBatchResults([])
    setError('')
  }

  return (
    <Page title={`时间格式转换`}>
      <div className={`flex flex-col gap-6 py-6`}>
        
        {/* 当前时间显示 */}
        <Section title="当前时间" description="显示当前系统时间，快速获取当前时间的各种格式">
          <div className={`p-4 flex flex-col gap-4`}>
            <div className={`text-lg font-mono bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200`}>
              <div className={`text-gray-600 text-sm mb-1`}>当前时间</div>
              <div className={`text-blue-900 font-semibold`}>{currentTime}</div>
            </div>
            <div className={`flex gap-4 flex-wrap`}>
              <Button onClick={getCurrentTimestamp} size="small">获取时间戳</Button>
              <Button onClick={getCurrentISO} size="small">获取ISO格式</Button>
              <Button onClick={() => setInputTime(new Date().toLocaleString('zh-CN'))} size="small">获取本地格式</Button>
            </div>
          </div>
        </Section>

        {/* 预置格式快速选择 */}
        <Section title="常用格式" description="点击快速应用常见的时间格式">
          <div className={`p-4 space-y-4`}>
            
            {/* 输入格式预置 */}
            <div>
              <h4 className={`text-sm font-medium text-gray-700 mb-2`}>输入格式预置</h4>
              <div className={`flex flex-wrap gap-2`}>
                {presetFormats.input.slice(0, -1).map((format) => (
                  <Button
                    key={format.value}
                    size="small"
                    type={selectedPresetInput === format.value ? "primary" : "default"}
                    highlight={selectedPresetInput === format.value}
                    onClick={() => applyPresetFormat('input', format.value)}
                  >
                    {format.label}
                  </Button>
                ))}
              </div>
              {selectedPresetInput && (
                <div className={`text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded`}>
                  示例: {presetFormats.input.find(f => f.value === selectedPresetInput)?.example}
                </div>
              )}
            </div>
            
            {/* 输出格式预置 */}
            <div>
              <h4 className={`text-sm font-medium text-gray-700 mb-2`}>输出格式预置</h4>
              <div className={`flex flex-wrap gap-2`}>
                {presetFormats.output.slice(0, -1).map((format) => (
                  <Button
                    key={format.value}
                    size="small"
                    type={selectedPresetOutput === format.value ? "primary" : "default"}
                    highlight={selectedPresetOutput === format.value}
                    onClick={() => applyPresetFormat('output', format.value)}
                  >
                    {format.label}
                  </Button>
                ))}
              </div>
              {selectedPresetOutput && (
                <div className={`text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded`}>
                  示例: {presetFormats.output.find(f => f.value === selectedPresetOutput)?.example}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* 时间转换 */}
        <Section 
          title={`时间转换${isBatchMode ? ' (批量模式)' : ''}`} 
          description={isBatchMode ? "检测到多行输入，将按行批量转换" : "输入时间进行格式转换，支持多行批量转换"}
        >
          <div className={`p-4 flex flex-col gap-4`}>
            
            {/* 批量模式提示 */}
            {isBatchMode && (
              <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3`}>
                <div className={`text-blue-800 text-sm flex items-center gap-2`}>
                  <span className={`w-2 h-2 bg-blue-500 rounded-full`}></span>
                  <strong>批量模式已激活</strong>
                </div>
                <div className={`text-blue-600 text-xs mt-1`}>
                  检测到 {inputTime.split('\n').filter(line => line.trim()).length} 行时间数据，将逐行转换
                </div>
              </div>
            )}
            
            {/* 输入时间 */}
            <InputText
              name="inputTime"
              label="输入时间"
              hint="单行：2021-01-01 00:00:00 | 多行：粘贴多个时间，每行一个"
              multiline={isBatchMode ? 8 : 4}
              value={inputTime}
              onChange={v => setInputTime(v || '')}
            />
            
            {/* 格式选择 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              {/* 输入格式 */}
              <div className={`space-y-2`}>
                <Select
                  name="inputFormat"
                  label="输入格式"
                  options={presetFormats.input}
                  value={inputFormat}
                  onChange={v => {
                    setInputFormat(v || 'auto')
                    setSelectedPresetInput(v || 'auto')
                  }}
                />
                {inputFormat === 'custom' && (
                  <InputText
                    name="customInputFormat"
                    label="自定义输入格式"
                    hint="例如：YYYY-MM-DD HH:mm:ss"
                    value={customInputFormat}
                    onChange={v => setCustomInputFormat(v || '')}
                  />
                )}
              </div>
              
              {/* 输出格式 */}
              <div className={`space-y-2`}>
                <Select
                  name="outputFormat"
                  label="输出格式"
                  options={presetFormats.output}
                  value={outputFormat}
                  onChange={v => {
                    setOutputFormat(v || 'timestamp')
                    setSelectedPresetOutput(v || 'timestamp')
                  }}
                />
                {outputFormat === 'custom' && (
                  <InputText
                    name="customOutputFormat"
                    label="自定义输出格式"
                    hint="YYYY-MM-DD HH:mm:ss"
                    value={customOutputFormat}
                    onChange={v => setCustomOutputFormat(v || '')}
                  />
                )}
              </div>
            </div>
            
            {/* 转换按钮 */}
            <div className={`flex gap-4`}>
              <Button type="primary" onClick={convertTime}>
                {isBatchMode ? '批量转换' : '转换'}
              </Button>
              <Button onClick={copyToClipboard} wait={!convertedTime}>
                复制结果
              </Button>
              <Button onClick={clearAll}>清空</Button>
            </div>
            
            {/* 错误信息 */}
            {error && (
              <div className={`text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg whitespace-pre-line`}>
                ❌ {error}
              </div>
            )}
            
            {/* 转换结果 */}
            <div className={`space-y-2`}>
              <InputText
                name="convertedTime"
                label={`转换结果${isBatchMode ? ` (${batchResults.length} 行)` : ''}`}
                multiline={isBatchMode ? Math.max(8, batchResults.length) : 4}
                value={convertedTime}
                readonly
                hint="转换结果将显示在这里"
              />
              
              {/* 批量结果统计 */}
              {isBatchMode && batchResults.length > 0 && (
                <div className={`text-xs text-gray-500 bg-gray-50 p-2 rounded`}>
                  <div className={`flex justify-between`}>
                    <span>总计: {batchResults.length} 行</span>
                    <span>成功: {batchResults.filter(r => !r.startsWith('错误')).length} 行</span>
                    <span>失败: {batchResults.filter(r => r.startsWith('错误')).length} 行</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* 格式说明与示例 */}
        <Section title="格式说明" description="各种时间格式的详细说明和示例">
          <div className={`p-4`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-sm`}>
              
              {/* 基础格式 */}
              <div className={`space-y-3`}>
                <h4 className={`font-semibold text-gray-800 border-b pb-1`}>基础格式</h4>
                <div className={`space-y-2`}>
                  <div>
                    <strong className={`text-blue-600`}>Unix 时间戳(秒):</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>1609459200</div>
                  </div>
                  <div>
                    <strong className={`text-blue-600`}>Unix 时间戳(毫秒):</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>1609459200000</div>
                  </div>
                  <div>
                    <strong className={`text-blue-600`}>ISO 8601:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>2021-01-01T00:00:00.000Z</div>
                  </div>
                </div>
              </div>
              
              {/* 常用格式 */}
              <div className={`space-y-3`}>
                <h4 className={`font-semibold text-gray-800 border-b pb-1`}>常用格式</h4>
                <div className={`space-y-2`}>
                  <div>
                    <strong className={`text-green-600`}>标准格式:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>2021-01-01 00:00:00</div>
                  </div>
                  <div>
                    <strong className={`text-green-600`}>美式格式:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>01/01/2021 00:00:00</div>
                  </div>
                  <div>
                    <strong className={`text-green-600`}>欧式格式:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>01/01/2021 00:00:00</div>
                  </div>
                </div>
              </div>
              
              {/* 英文格式 */}
              <div className={`space-y-3`}>
                <h4 className={`font-semibold text-gray-800 border-b pb-1`}>英文格式</h4>
                <div className={`space-y-2`}>
                  <div>
                    <strong className={`text-purple-600`}>英文缩写:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>Jan 01, 2021 00:00:00</div>
                  </div>
                  <div>
                    <strong className={`text-purple-600`}>英文格式:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>01 Jan 2021 00:00:00</div>
                  </div>
                </div>
              </div>
              
              {/* 中文格式 */}
              <div className={`space-y-3`}>
                <h4 className={`font-semibold text-gray-800 border-b pb-1`}>中文格式</h4>
                <div className={`space-y-2`}>
                  <div>
                    <strong className={`text-red-600`}>中文格式:</strong>
                    <div className={`text-gray-600 ml-2 font-mono text-xs`}>2021年01月01日 00:00:00</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 自定义格式说明 */}
            <div className={`mt-6 p-4 bg-gray-50 rounded-lg`}>
              <h4 className={`font-semibold text-gray-800 mb-3`}>自定义格式占位符</h4>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-xs`}>
                <div><code className={`bg-white px-2 py-1 rounded`}>YYYY</code> - 四位年份</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>MM</code> - 两位月份</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>DD</code> - 两位日期</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>HH</code> - 两位小时</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>mm</code> - 两位分钟</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>ss</code> - 两位秒</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>SSS</code> - 三位毫秒</div>
                <div><code className={`bg-white px-2 py-1 rounded`}>MMM</code> - 英文月份缩写</div>
              </div>
            </div>
            
            {/* 批量转换说明 */}
            <div className={`mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200`}>
              <h4 className={`font-semibold text-blue-800 mb-2`}>💡 批量转换技巧</h4>
              <ul className={`text-sm text-blue-700 space-y-1`}>
                <li>• 粘贴多行时间数据，每行一个时间</li>
                <li>• 系统会自动检测并启用批量模式</li>
                <li>• 支持混合格式的自动识别（当输入格式为&#34;自动检测&#34;时）</li>
                <li>• 转换结果按行对应，便于对照检查</li>
                <li>• 失败的行会显示错误信息，成功的行正常转换</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </Page>
  )
}
