import { CircleFlag } from "react-circle-flags";

import * as styles from "./styles";
import type { Props } from "./types";

export function Option({ flag, label }: Props) {
  return (
    <div className={styles.option}>
      <CircleFlag countryCode={flag} width={18} height={18} />
      <span>{label}</span>
    </div>
  );
}
