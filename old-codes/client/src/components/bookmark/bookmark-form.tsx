"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Bookmark as BookmarkIcon } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Bookmark } from '@/api/bookmark';
import { useBookmarkData } from '@/hooks/bookmark-data';

const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  url: z.string().url("请输入有效的URL地址"),
  icon: z.string().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional()
})

export type FormValues = z.infer<typeof formSchema>

interface BookmarkFormProps {
  mode: 'create' | 'edit'
  bookmark?: Bookmark;
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
}

export function BookmarkForm({ 
  mode,
  bookmark,
  open, 
  onOpenChange, 
  onSubmit,
}: BookmarkFormProps) {
  const { categories, tags } = useBookmarkData();

  const defaultValues: Partial<FormValues> = {
    title: "",
    url: "",
    icon: "",
    categoryId: "",
    tagId: ""
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues
  })

  useEffect(() => {
    if (bookmark && mode === 'edit') {
      // TODO: 需要支持多分类、多标签
      const categoryIds = bookmark.categories?.map(c => c.id);
      const tagIds = bookmark.tags?.map(t => t.id);
      form.reset({
        title: bookmark.title,
        url: bookmark.url,
        icon: bookmark.icon || "",
        categoryId: categoryIds[0] ? categoryIds[0] : '',
        tagId: tagIds[0] ? tagIds[0] : '',
      })
    } else {
      form.reset(defaultValues as FormValues)
    }
  }, [bookmark, mode, form, open])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues as FormValues)
      form.clearErrors()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            {mode === 'create' ? '新增书签' : '编辑书签'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data)
              if (mode === 'create') {
                form.reset(defaultValues as FormValues)
              }
              onOpenChange(false)
            })} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="书签标题" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>分类</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>标签</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择标签" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                取消
              </Button>
              <Button type="submit">确定</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 