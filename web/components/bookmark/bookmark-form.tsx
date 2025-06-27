'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { BookmarkResponse } from '~shared/schemas/bookmark';
import { createBookmarkBodySchema, updateBookmarkBodySchema } from '~shared/schemas/bookmark';
import { useBookmarkData } from '@/hooks/bookmark-data';

const formSchema = createBookmarkBodySchema.or(updateBookmarkBodySchema);

export type FormValues = z.infer<typeof formSchema>;

interface BookmarkFormProps {
  mode: 'create' | 'edit';
  bookmark?: BookmarkResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
}

export function BookmarkForm({ mode, bookmark, open, onOpenChange, onSubmit }: BookmarkFormProps) {
  const { categories, tags } = useBookmarkData();

  const defaultValues: Partial<FormValues> = {
    title: '',
    url: '',
    icon: '',
    categoryIds: [],
    tagIds: [],
  };

  const defaultValuesRef = useRef(defaultValues);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues,
  });

  useEffect(() => {
    if (bookmark && mode === 'edit') {
      // TODO: 未来考虑支持多分类、多标签
      const categoryIds = bookmark.categories?.map((c) => c._id);
      const tagIds = bookmark.tags?.map((t) => t._id);
      form.reset({
        title: bookmark.title || '',
        url: bookmark.url,
        icon: bookmark.icon || '',
        categoryIds,
        tagIds,
      });
    } else {
      form.reset(defaultValuesRef.current as FormValues);
    }
  }, [bookmark, mode, form, open, defaultValuesRef]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues as FormValues);
      form.clearErrors();
    }
    onOpenChange(open);
  };

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
              onSubmit(data);
              if (mode === 'create') {
                form.reset(defaultValues as FormValues);
              }
              onOpenChange(false);
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
              name="categoryIds"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>分类</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange([v])}
                    value={field.value && field.value[0] ? field.value[0] : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
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
              name="tagIds"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>标签</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange([v])}
                    value={field.value && field.value[0] ? field.value[0] : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择标签" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag._id} value={tag._id}>
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
  );
}
