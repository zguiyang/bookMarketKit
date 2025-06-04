'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagResponse, createTagBodySchema, updateTagBodySchema } from '@bookmark/schemas';
import { ColorPicker } from '@/components/color-picker';
import { cn } from '@/lib/utils';

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
        color: tag.color,
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
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange}>
                      <div
                        style={
                          {
                            '--tag-color': field.value,
                          } as React.CSSProperties
                        }
                        className="w-full px-2 py-1 rounded-md border bg-[var(--tag-color)]"
                      >
                        <span className={cn('text-sm', field.value ? 'text-white' : 'text-gray-500')}>
                          {field.value ? field.value : '选择颜色'}
                        </span>
                      </div>
                    </ColorPicker>
                  </FormControl>
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
