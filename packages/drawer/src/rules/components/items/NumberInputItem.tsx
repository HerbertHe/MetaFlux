import { InputNumber } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { DRAWER_I18N_NS } from "../../../i18n";
import styles from "../../../styles/items.less";

export interface NumberInputItemProps {
  onChange?: (val: string[]) => void;
  value?: number[] | string[];
}

const NumberInputItem: FC<NumberInputItemProps> = ({ onChange, value }) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  return (
    <InputNumber
      className={styles["conditional-input"]}
      placeholder={t("setValue")}
      value={value?.[0]}
      min={0}
      precision={2}
      onChange={(e) => onChange?.(String(e) ? [String(e)] : [])}
    />
  );
};

export default NumberInputItem;
