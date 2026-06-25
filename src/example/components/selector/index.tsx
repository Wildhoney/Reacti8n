import { Select } from "antd";

import { config, i18n } from "../../utils";
import * as styles from "./styles";

export function Selector() {
  const { locale, setLocale } = i18n.useLocale();

  return (
    <Select
      value={locale}
      onChange={setLocale}
      options={config.languages}
      className={styles.selector}
      listHeight={config.languages.length * 36}
      popupMatchSelectWidth={false}
      data-testid="language-select"
    />
  );
}
