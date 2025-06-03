import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormat(date: string | null, format?: string) {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format ?? 'YYYY-MM-DD HH:mm:ss');
}

/**
 * 通用文件下载方法
 * @param {Blob} blob - 要下载的文件Blob对象
 * @param {string} fileName - 下载文件的文件名
 * @returns {void}
 */
export const downloadFile = (blob: Blob, fileName: string): void => {
  // 创建Blob URL
  const url = window.URL.createObjectURL(blob);

  // 创建下载链接
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);

  // 添加到文档中并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理
  link.remove();

  // 释放Blob URL
  window.URL.revokeObjectURL(url);
};
