"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { tagColors } from "@/config/tag-colors"
import { Tag } from "@/api/bookmark"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(1, "标签名称不能为空").max(20, "标签名称不能超过20个字符"),
  colorIndex: z.number().min(0).max(tagColors.length - 1)
})

type FormValues = z.infer<typeof formSchema>

interface TagFormDialogProps {
  mode: 'create' | 'edit'
  tag?: Tag
  open: boolean
  onOpenChange(open: boolean): void
  onSubmitForm(values: FormValues): void
}

export function TagFormDialog({ 
  mode,
  tag,
  open,
  onOpenChange,
  onSubmitForm
}: TagFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      colorIndex: 0
    }
  })

  // 监听 tag 变化，更新表单值
  useEffect(() => {
    if (tag && mode === 'edit') {
      // 找到当前颜色对应的索引
      const colorIndex = tagColors.findIndex(color => color.bg === tag.color);
      form.reset({
        name: tag.name,
        colorIndex: colorIndex >= 0 ? colorIndex : 0
      })
    } else {
      form.reset({
        name: "",
        colorIndex: 0
      })
    }
  }, [tag, mode, form])

  const handleSubmit = (values: FormValues) => {
    onSubmitForm(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增标签' : '编辑标签'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入标签名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorIndex"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>颜色</FormLabel>
                  <Select
                    onValueChange={(value: string) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择标签颜色">
                          {field.value !== undefined && (
                            <div className="flex items-center">
                              <div 
                                className={`w-4 h-4 rounded-full mr-2 ${tagColors[field.value].bg} ${tagColors[field.value].text}`}
                              />
                              <span>颜色 {field.value + 1}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      <div className="grid grid-cols-2 gap-2 p-2">
                        {tagColors.map((color, index) => (
                          <SelectItem 
                            key={index} 
                            value={index.toString()}
                            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className={`w-6 h-6 rounded-full mr-3 ${color.bg} ${color.text}`}
                                />
                                <span className="text-sm">颜色 {index + 1}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {color.bg.split(' ')[0].replace('bg-', '')}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit">确定</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 