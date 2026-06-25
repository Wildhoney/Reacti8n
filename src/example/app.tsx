import { useEffect } from "react";
import { Col, ConfigProvider, Layout, Row, theme } from "antd";

import { Card } from "./components/card";
import { dictionary } from "./components/card/index.i18n";
import { ids } from "./components/card/utils";
import { Header } from "./components/header";
import * as styles from "./styles";
import { i18n } from "./utils";

export function App() {
  const { locale } = i18n.useLocale();
  const copy = i18n.useI18n(dictionary);
  const direction = copy.price.direction;

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  return (
    <ConfigProvider
      theme={{ algorithm: theme.defaultAlgorithm }}
      direction={direction}
    >
      <Layout className={styles.shell}>
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
