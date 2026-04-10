import { Select } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { IWidgetOption } from "@metaflux/core";
import { DRAWER_I18N_NS } from "../../../i18n";
import styles from "../../../styles/items.less";

export interface SelectItemProps {
  value?: string | string[];
  mode?: "multiple" | "tags";
  options: IWidgetOption[];
  onChange?: (val: string[]) => void;
}

const SelectItem: FC<SelectItemProps> = ({
  mode,
  value,
  options,
  onChange,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  return (
    <Select
      placeholder={t("selectPlaceholder")}
      mode={mode}
      value={mode ? value : value?.[0] ? value?.[0] : value}
      className={styles["field-select"]}
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      options={options}
      onChange={(v) =>
        onChange?.(mode ? (v as string[]) : [v as string])
      }
    />
  );
};

export default SelectItem;
