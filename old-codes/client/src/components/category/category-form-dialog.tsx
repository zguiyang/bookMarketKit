"use client"

import { useState, useEffect } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
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
import { Category } from "@/api/bookmark"

const formSchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(100, "分类名称不能超过100个字符"),
  icon: z.string().min(1, "请选择一个图标")
})

type FormValues = z.infer<typeof formSchema>

interface CategoryFormDialogProps {
  mode: 'create' | 'edit'
  category?: Category
  open: boolean
  onUpdateChange(open: boolean): void
  onSubmitForm(values: FormValues): void
}

interface EmojiData {
  native: string
  id: string
  name: string
  unified: string
  keywords: string[]
  shortcodes: string
}

export function CategoryFormDialog({ 
  mode, 
  category, 
  open,
  onUpdateChange,
  onSubmitForm,
}: CategoryFormDialogProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: ""
    }
  })

  useEffect(() => {
    if (category && mode === 'edit') {
      form.reset({
        name: category.name,
        icon: category.icon
      })
    } else {
      form.reset({
        name: "",
        icon: ""
      })
    }
  }, [category, form, open, mode])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({
        name: "",
        icon: ""
      })
      form.clearErrors()
      setShowEmojiPicker(false)
    }
    onUpdateChange(open)
  }

  const handleSubmit = (values: FormValues) => {
    onSubmitForm(values)
    onUpdateChange(false)
    form.reset()
  }

  const handleEmojiSelect = (emoji: EmojiData) => {
    form.setValue("icon", emoji.native)
    setShowEmojiPicker(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增分类' : '编辑分类'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>图标</FormLabel>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 flex items-center justify-between px-3 hover:bg-accent/50 transition-colors"
                      onClick={() => setShowEmojiPicker(true)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{field.value || "😀"}</span>
                        <span className="text-sm text-muted-foreground">
                          {field.value ? "点击更换图标" : "点击选择图标"}
                        </span>
                      </div>
                    </Button>
                  </FormControl>
                  {showEmojiPicker && (
                    <div className="relative">
                      <div 
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowEmojiPicker(false)}
                      />
                      <div className="absolute z-50 top-1 w-full">
                        <Picker
                          data={data}
                          onEmojiSelect={handleEmojiSelect}
                          theme="light"
                          locale="zh"
                          className="!border !shadow-lg !rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入分类名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
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