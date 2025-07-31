'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (imageData: string, file: File) => void
  onRemove?: () => void
  isLoading?: boolean
  maxSize?: number // MB
  acceptedTypes?: string[]
  className?: string
}

export function ImageUpload({
  onImageSelect,
  onRemove,
  isLoading = false,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(null)

    // 检查文件类型
    if (!acceptedTypes.includes(file.type)) {
      setError('不支持的文件格式，请上传 JPG、PNG 或 WebP 格式的图片')
      return
    }

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      
      // 转换为base64（去掉data:image/...;base64,前缀）
      const base64Data = result.split(',')[1]
      onImageSelect(base64Data, file)
    }
    reader.readAsDataURL(file)
  }, [acceptedTypes, maxSize, onImageSelect])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }, [onRemove])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          // 预览模式
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
              <img
                src={preview}
                alt="上传的图片"
                className="w-full h-32 object-contain"
              />
              
              {/* 加载遮罩 */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">分析中...</span>
                  </div>
                </div>
              )}

              {/* 删除按钮 */}
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-400 text-center">
              点击右上角 ✕ 可以重新上传图片
            </div>
          </motion.div>
        ) : (
          // 上传区域
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
              relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              transition-all duration-200 hover:border-blue-400
              ${dragActive
                ? 'border-blue-400 bg-blue-50/5'
                : 'border-gray-600 hover:bg-gray-800/30'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="space-y-3">
              {/* 图标 */}
              <div className="flex justify-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Camera className="w-5 h-5 text-green-400" />
                </div>
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <Upload className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* 文字说明 */}
              <div className="space-y-1">
                <h3 className="text-base font-medium text-white">
                  上传题目图片
                </h3>
                <p className="text-sm text-gray-400">
                  拖拽图片到这里，或点击选择文件
                </p>
                <p className="text-xs text-gray-500">
                  支持 JPG、PNG、WebP 格式，最大 {maxSize}MB
                </p>
              </div>

              {/* 功能说明 */}
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>识别文字</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>解析公式</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>智能辅导</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
