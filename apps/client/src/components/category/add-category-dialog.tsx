"use client"

import { useState } from "react"
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
  DialogTrigger,
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
import { Plus } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(20, "分类名称不能超过20个字符"),
  icon: z.string().min(1, "请选择一个图标")
})

type FormValues = z.infer<typeof formSchema>

interface AddCategoryDialogProps {
  onAddCategory: (values: FormValues) => void
}

interface EmojiData {
  native: string
  id: string
  name: string
  unified: string
  keywords: string[]
  shortcodes: string
}

export function AddCategoryDialog({ onAddCategory }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: ""
    }
  })

  const onSubmit = (values: FormValues) => {
    onAddCategory(values)
    setOpen(false)
    form.reset()
  }

  const handleEmojiSelect = (emoji: EmojiData) => {
    form.setValue("icon", emoji.native)
    setShowEmojiPicker(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增分类</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>图标</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-12 h-12 text-2xl"
                        onClick={() => setShowEmojiPicker(true)}
                      >
                        {field.value || "😀"}
                      </Button>
                      {showEmojiPicker && (
                        <div className="absolute z-50 mt-2">
                          <div 
                            className="fixed inset-0" 
                            onClick={() => setShowEmojiPicker(false)}
                          />
                          <div className="relative">
                            <Picker
                              data={data}
                              onEmojiSelect={handleEmojiSelect}
                              theme="light"
                              locale="zh"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
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
                onClick={() => setOpen(false)}
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