import { Card as AntCard, Space, Typography } from "antd";

import { i18n } from "../../utils";
import { dictionary } from "./index.i18n";
import * as styles from "./styles";
import type { Id } from "./types";
import { menu } from "./utils";

type Props = { id: Id };

export function Card({ id }: Props) {
  const copy = i18n.useI18n(dictionary);
  const entry = menu[id];
  const name = copy[`${id}Name`];
  const description = copy[`${id}Description`];

  return (
    <AntCard
      title={
        <Space>
          <span className={styles.emoji}>{entry.emoji}</span>
          <span>{name}</span>
        </Space>
      }
      data-testid={`coffee-${id}`}
    >
      <Typography.Paragraph
        type="secondary"
        className={styles.description}
        data-testid={`coffee-${id}-description`}
      >
        {description}
      </Typography.Paragraph>

      <Typography.Text
        strong
        className={styles.price}
        data-testid={`coffee-${id}-price`}
      >
        {copy.price({ amount: entry.price })}
      </Typography.Text>
    </AntCard>
  );
}
