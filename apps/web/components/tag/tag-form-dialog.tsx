'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tagColors } from '@/config/tag-colors';
import { TagResponse, createTagBodySchema, updateTagBodySchema } from '@bookmark/schemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = createTagBodySchema.or(updateTagBodySchema);

type FormValues = z.infer<typeof formSchema>;

interface TagFormDialogProps {
  mode: 'create' | 'edit';
  tag?: TagResponse;
  open: boolean;
  onOpenChange(open: boolean): void;
  onSubmitForm(values: FormValues): void;
}

export function TagFormDialog({ mode, tag, open, onOpenChange, onSubmitForm }: TagFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // 监听 tag 变化，更新表单值
  useEffect(() => {
    if (tag && mode === 'edit') {
      form.reset({
        name: tag.name,
      });
    } else {
      form.reset({
        name: '',
      });
    }
  }, [tag, mode, form, open]);

  const handleSubmit = (values: FormValues) => {
    onSubmitForm(values);
    onOpenChange(false);
  };

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
              name="color"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>颜色</FormLabel>
                  <Select
                    onValueChange={(value: string) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择标签颜色">
                          {field.value !== undefined && (
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-2 bg-[${field.value}]`} />
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
                                <div className={`w-6 h-6 rounded-full mr-3 ${color.bg} ${color.text}`} />
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit">确定</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
