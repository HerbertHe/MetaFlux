import { Input } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { DRAWER_I18N_NS } from "../../../i18n";
import styles from "../../../styles/items.less";

export interface InputItemProps {
  onChange?: (val: string[]) => void;
  value?: string[];
}

const InputItem: FC<InputItemProps> = ({ onChange, value }) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  return (
    <Input
      className={styles["conditional-input"]}
      placeholder={t("setValue")}
      value={value?.[0]}
      onChange={(e) => onChange?.([e.target.value])}
    />
  );
};

export default InputItem;
