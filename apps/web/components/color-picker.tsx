import * as React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  children?: React.ReactNode;
}

/**
 * ColorPicker 组件，仅支持弹出选择颜色，展示为色块背景。
 * @param value 当前颜色值（十六进制）
 * @param onChange 颜色变更回调
 * @param disabled 是否禁用
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 flex justify-center">
        <HexColorPicker color={value} onChange={onChange} style={{ width: '100%' }} />
      </PopoverContent>
    </Popover>
  );
};
