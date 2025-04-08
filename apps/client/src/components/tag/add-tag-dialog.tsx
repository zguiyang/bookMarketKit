"use client"

import { useState } from "react"
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
import { tagColors } from "@/config/tag-colors"
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

interface AddTagDialogProps {
  onAddTag: (tag: { name: string; colorIndex: number }) => void
}

export function AddTagDialog({ onAddTag }: AddTagDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      colorIndex: 0
    }
  })

  const onSubmit = (values: FormValues) => {
    onAddTag({ name: values.name, colorIndex: values.colorIndex })
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增标签</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    defaultValue={field.value.toString()}
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