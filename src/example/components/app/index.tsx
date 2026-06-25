import { useEffect } from "react";
import { Col, ConfigProvider, Layout, Row, theme } from "antd";

import { i18n } from "../../utils";
import { Card } from "../card";
import { dictionary } from "../card/index.i18n";
import { ids } from "../card/utils";
import { Header } from "../header";
import * as styles from "./styles";

export function App() {
  const { locale } = i18n.useLocale();
  const copy = i18n.useI18n(dictionary);

  useEffect(() => {
    document.documentElement.dir = copy.price.direction;
    document.documentElement.lang = locale;
  }, [copy.price.direction, locale]);

  return (
    <ConfigProvider
      theme={{ algorithm: theme.defaultAlgorithm }}
      direction={copy.price.direction}
    >
      <Layout className={styles.container}>
        <Header />
        <Layout.Content className={styles.page}>
          <Row gutter={[24, 24]}>
            {ids.map((id) => (
              <Col key={id} xs={24} sm={12} lg={8}>
                <Card id={id} />
              </Col>
            ))}
          </Row>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
