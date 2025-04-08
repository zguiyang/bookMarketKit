"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import * as z from "zod"
import { 
  Bookmark, 
  Star, 
  StarOff, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Loader2 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bookmark as BookmarkType } from "@/types/bookmark"

// 定义表单模式
const bookmarkFormSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  url: z.string().url("请输入有效的URL地址"),
  description: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  tags: z.string().optional(),
  starred: z.boolean().optional(),
})

// 使用zod推断的类型
type FormValues = z.infer<typeof bookmarkFormSchema>

// 创建一个转换后的类型，用于提交给父组件
export interface BookmarkFormValues {
  title: string
  url: string
  description?: string
  category?: string
  subcategory?: string
  tags: string[]
  starred: boolean
}

// 默认值需要匹配FormValues类型
const defaultValues: FormValues = {
  title: "",
  url: "",
  description: "",
  category: "",
  subcategory: "",
  tags: "",
  starred: false,
}

interface BookmarkFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: BookmarkFormValues) => void
  initialData?: BookmarkType
}

export function BookmarkForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: BookmarkFormProps) {
  const [isStarred, setIsStarred] = useState(initialData?.starred || false)
  const [activeTab, setActiveTab] = useState<string>("quick")
  const [isAILoading, setIsAILoading] = useState(false)
  const [expandedForm, setExpandedForm] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(bookmarkFormSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      url: initialData.url,
      description: initialData.description || "",
      category: initialData.category || "",
      subcategory: initialData.subcategory || "",
      tags: initialData.tags ? initialData.tags.join(", ") : "",
      starred: initialData.starred ?? false,
    } : defaultValues,
  })

  // 使用AI抓取网页信息
  const handleFetchWithAI = async () => {
    const url = form.getValues("url")
    if (!url) {
      form.setError("url", { 
        type: "manual", 
        message: "请先输入URL地址" 
      })
      return
    }

    setIsAILoading(true)
    // TODO: 实现AI抓取网页信息的逻辑
    // 这里模拟AI抓取过程
    setTimeout(() => {
      // 模拟AI抓取的结果
      const aiResult = {
        title: url.includes("github") ? "GitHub - 开发者协作平台" : 
               url.includes("stackoverflow") ? "Stack Overflow - 开发者问答社区" :
               "网页标题",
        description: "这是AI自动抓取的网页描述，包含了网页的主要内容和关键信息。",
        category: "技术",
        subcategory: "开发工具",
        tags: "开发, 工具, 在线服务",
      }
      
      form.setValue("title", aiResult.title)
      form.setValue("description", aiResult.description)
      form.setValue("category", aiResult.category)
      form.setValue("subcategory", aiResult.subcategory)
      form.setValue("tags", aiResult.tags)
      
      setIsAILoading(false)
      setExpandedForm(true)
    }, 1500)
  }

  // 处理表单提交
  const onFormSubmit:SubmitHandler<FormValues> = (values: FormValues) => {
    // 将表单值转换为提交格式
    const submissionValues: BookmarkFormValues = {
      title: values.title,
      url: values.url,
      description: values.description,
      category: values.category,
      subcategory: values.subcategory,
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      starred: isStarred,
    }
    
    onSubmit(submissionValues)
    form.reset(defaultValues)
    setExpandedForm(false)
    setActiveTab("quick")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            {initialData ? "编辑书签" : "新增书签"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "修改书签信息，点击保存更新书签。" 
              : "添加一个新的书签，填写必要的信息后点击保存。"}
          </DialogDescription>
        </DialogHeader>
        
        {!initialData && (
          <Tabs 
            defaultValue="quick" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">快速添加</TabsTrigger>
              <TabsTrigger value="advanced">完整表单</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            {/* 快速添加表单 */}
            {(activeTab === "quick" && !initialData) && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={handleFetchWithAI}
                          disabled={isAILoading}
                          className="flex-shrink-0"
                          title="使用AI抓取信息"
                        >
                          {isAILoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setIsStarred(!isStarred);
                      form.setValue("starred", !isStarred);
                    }}
                  >
                    {isStarred ? (
                      <>
                        <StarOff className="h-4 w-4" />
                        <span>取消收藏</span>
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" />
                        <span>收藏</span>
                      </>
                    )}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {isStarred ? "已添加到收藏" : "添加到收藏以便快速访问"}
                  </span>
                </div>
                
                {expandedForm && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">AI抓取的附加信息</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedForm(!expandedForm)}
                        className="h-8 px-2"
                      >
                        {expandedForm ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>描述</FormLabel>
                          <FormControl>
                            <Textarea placeholder="书签描述（可选）" {...field} className="resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>分类</FormLabel>
                            <FormControl>
                              <Input placeholder="分类（可选）" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>子分类</FormLabel>
                            <FormControl>
                              <Input placeholder="子分类（可选）" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                      
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>标签</FormLabel>
                          <FormControl>
                            <Input placeholder="标签，用逗号分隔（可选）" {...field} />
                          </FormControl>
                          <FormDescription>多个标签请用逗号分隔</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* 完整表单 */}
            {(activeTab === "advanced" || initialData) && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        {!initialData && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={handleFetchWithAI}
                            disabled={isAILoading}
                            className="flex-shrink-0"
                            title="使用AI抓取信息"
                          >
                            {isAILoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="书签描述（可选）" 
                          {...field} 
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription>简要描述这个书签的内容</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>分类</FormLabel>
                        <FormControl>
                          <Input placeholder="分类（可选）" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>子分类</FormLabel>
                        <FormControl>
                          <Input placeholder="子分类（可选）" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                  
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标签</FormLabel>
                      <FormControl>
                        <Input placeholder="标签，用逗号分隔（可选）" {...field} />
                      </FormControl>
                      <FormDescription>多个标签请用逗号分隔</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setIsStarred(!isStarred);
                      form.setValue("starred", !isStarred);
                    }}
                  >
                    {isStarred ? (
                      <>
                        <StarOff className="h-4 w-4" />
                        <span>取消收藏</span>
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" />
                        <span>收藏</span>
                      </>
                    )}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {isStarred ? "已添加到收藏" : "添加到收藏以便快速访问"}
                  </span>
                </div>
              </div>
            )}
            
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 