'use client';
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useRequest } from 'alova/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Check, AlertCircle, BookmarkIcon, RefreshCw, ExternalLink, Info } from 'lucide-react';
import { UploadBizTypeEnums, BookmarkImportResponse } from '@bookmark/schemas';
import { cn } from '@/lib/utils';
import { FileApi, BookmarkApi } from '@/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface BookmarkImportDialogProps {
  /**
   * 控制弹窗的开关状态
   */
  open: boolean;
  /**
   * 关闭弹窗的回调函数
   */
  onOpenChange: (open: boolean) => void;
  /**
   * 书签导入成功后的回调函数
   * @param importedCount 成功导入的书签数量
   */
  onImportSuccess?: (res: BookmarkImportResponse) => void;
  /**
   * 书签导入失败后的回调函数
   * @param error 错误信息
   */
  onImportError?: (error: any) => void;
  /**
   * 文件上传API端点
   */
  uploadUrl?: string;
  /**
   * 书签处理API端点
   */
  processUrl?: string;
}

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

const BookmarkImportDialog: React.FC<BookmarkImportDialogProps> = ({
  open,
  onOpenChange,
  onImportSuccess,
  onImportError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [importResult, setImportResult] = useState<BookmarkImportResponse>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { send: startUpload } = useRequest(FileApi.upload, {
    immediate: false,
  });
  const { send: startImport } = useRequest(BookmarkApi.import, {
    immediate: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 验证文件类型
    if (!selectedFile.name.toLowerCase().endsWith('.html')) {
      setErrorMessage('请上传HTML格式的书签文件');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // 验证文件类型
    if (!droppedFile.name.toLowerCase().endsWith('.html')) {
      setErrorMessage('请上传HTML格式的书签文件');
      setStatus('error');
      return;
    }

    setFile(droppedFile);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const importBookmarks = async () => {
    if (!file) return;

    try {
      setStatus('uploading');
      setProgress(0);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 45) {
            clearInterval(progressInterval);
            return 45;
          }
          return prev + 5;
        });
      }, 200);

      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', file);

      // 发送上传请求
      const uploadResponse = await startUpload(UploadBizTypeEnums.BOOKMARK, formData);
      if (!uploadResponse.success) {
        throw new Error('书签文件上传失败');
      }

      clearInterval(progressInterval);
      const uploadData = uploadResponse.data;
      setProgress(50);

      // 第二步：处理书签导入
      setStatus('processing');

      // 模拟处理进度
      const processInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(processInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // 发送处理请求
      const processResponse = await startImport({
        filePath: uploadData.path,
      });

      clearInterval(processInterval);

      if (!processResponse.success) {
        throw new Error('书签处理失败');
      }

      const processData = processResponse.data;
      setProgress(100);
      setStatus('success');
      setImportResult(processData);

      // 调用成功回调
      if (onImportSuccess) {
        onImportSuccess(processData);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '导入失败，请重试');

      // 调用错误回调
      if (onImportError) {
        onImportError(error);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setImportResult(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return '正在上传书签文件...';
      case 'processing':
        return '正在解析并导入书签...';
      case 'success':
        return `成功导入 ${importResult?.importedBookmarks || 0} 个书签, ${importResult?.importedCategories ?? 0} 个分类！`;
      case 'error':
        return errorMessage || '导入失败，请重试';
      default:
        return file ? '点击"导入书签"按钮开始导入' : '请选择书签文件';
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{status === 'success' ? '导入成功' : '导入书签'}</DialogTitle>
          <DialogDescription>
            {status === 'success'
              ? '您的书签已成功导入，请查看以下导入结果和后续操作'
              : '请选择从浏览器导出的书签HTML文件，系统将自动解析并导入您的书签'}
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="space-y-4 py-2">
            {/* 导入结果卡片 */}
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-base">导入完成</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{file?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white dark:bg-gray-800 rounded p-3 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {importResult?.importedBookmarks || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">成功导入书签</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {importResult?.importedCategories || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">成功导入分类</p>
                </div>
              </div>

              {importResult?.errors && importResult.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 rounded p-3 text-center mb-3">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">{importResult.errors.length}</p>
                  <p className="text-xs text-red-500 dark:text-red-400">导入失败的书签</p>
                </div>
              )}
            </div>

            {/* 提示信息 */}
            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-700 dark:text-blue-300">后续处理中</AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm">
                书签数据已成功导入，但详细信息（如网站图标、描述等）正在后台抓取中，请稍等片刻后再查看完整信息。
              </AlertDescription>
            </Alert>

            {/* 操作指引 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">后续操作</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-2"
                  onClick={refreshPage}
                >
                  <RefreshCw className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <p className="font-medium text-sm">刷新页面</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">立即查看已导入的书签</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-2"
                  onClick={() => onOpenChange(false)}
                >
                  <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <p className="font-medium text-sm">继续使用</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">关闭此窗口继续使用其他功能</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* 额外说明 */}
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
              <p className="mb-1">
                📝 <strong>提示说明</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>导入操作不会影响您当前的使用体验</li>
                <li>网站图标和描述信息将在后台逐步完成</li>
                <li>
                  您可以在<font>”设置“</font>中查看导入历史记录
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'mt-4 border-2 border-dashed rounded-lg p-6 text-center flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer',
              status === 'error'
                ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30'
                : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/70'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={status === 'idle' && !file ? triggerFileInput : undefined}
          >
            {status === 'idle' && !file && (
              <>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <BookmarkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">拖拽书签文件到此处或点击此区域</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html" className="hidden" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>支持的文件类型: HTML格式的书签文件</p>
                  <p className="flex items-center justify-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Chrome: 书签管理器 → 导出书签</span>
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Firefox: 书签 → 管理书签 → 导出书签到HTML</span>
                  </p>
                </div>
              </>
            )}

            {file && status === 'idle' && (
              <div className="w-full">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700 mb-4">
                  <div className="flex items-center gap-2 truncate">
                    <div className="min-w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded flex items-center justify-center">
                      <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    importBookmarks();
                  }}
                >
                  导入书签
                </Button>
              </div>
            )}

            {(status === 'uploading' || status === 'processing') && (
              <div className="w-full">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700 mb-4">
                  <div className="flex items-center gap-2 truncate flex-1">
                    <div className="min-w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded flex items-center justify-center">
                      <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="truncate flex-1">
                      <p className="font-medium text-sm truncate">{file?.name}</p>
                      <Progress value={progress} className="h-2 mt-1" />
                    </div>
                  </div>
                  <span className="text-sm font-medium ml-2">{progress}%</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {status === 'uploading' ? '正在上传书签文件...' : '正在解析并导入书签...'}
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="w-full">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file?.name || '导入错误'}</p>
                      <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                >
                  重新选择文件
                </Button>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between items-center mt-4">
          {status !== 'success' && <p className="text-xs text-gray-500 dark:text-gray-400">{getStatusMessage()}</p>}
          {status !== 'success' && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={status === 'uploading' || status === 'processing'}
            >
              取消
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BookmarkImportDialog };
