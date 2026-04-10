import { DatePicker } from "antd";
import type { FC } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export interface DatePickerItemProps {
  type?: string;
  value?: string[];
  onChange?: (val: string[]) => void;
}

const DatePickerItem: FC<DatePickerItemProps> = ({
  type = "",
  value,
  onChange,
}) => {
  return (
    <>
      {type ? (
        <RangePicker
          value={
            value ? [dayjs(value[0]), dayjs(value[1])] : undefined
          }
          getPopupContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
          onChange={(date) =>
            onChange?.([
              dayjs(date?.[0]).format("YYYY-MM-DD"),
              dayjs(date?.[1]).format("YYYY-MM-DD"),
            ])
          }
        />
      ) : (
        <DatePicker
          value={value ? dayjs(value[0]) : undefined}
          getPopupContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
          onChange={(date) =>
            onChange?.([dayjs(date).format("YYYY-MM-DD")])
          }
        />
      )}
    </>
  );
};

export default DatePickerItem;
