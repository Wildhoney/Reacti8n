import { Col, Layout, Row, Select, Space, Typography } from "antd";

import logoUrl from "../../assets/logo.png";
import { config, i18n } from "../../utils";
import { dictionary } from "./index.i18n";
import * as styles from "./styles";

export function Header() {
  const { locale, setLocale } = i18n.useLocale();
  const copy = i18n.useI18n(dictionary);

  return (
    <Layout.Header className={styles.header}>
      <Row gutter={[24, 16]} align="middle">
        <Col xs={24} md={16}>
          <div className={styles.titleBlock}>
            <img
              className={styles.logo}
              src={logoUrl}
              alt="Artisan Coffee Co."
              width={44}
              height={44}
            />
            <div className={styles.titleColumn}>
              <Typography.Title level={3} className={styles.appTitle}>
                {copy.appTitle({})}
              </Typography.Title>
              <Typography.Text type="secondary" className={styles.tagline}>
                {copy.tagline({})}
              </Typography.Text>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8} className={styles.languageCol}>
          <Space size="middle" align="center" wrap>
            <Typography.Text type="secondary">
              {copy.languageLabel({})}
            </Typography.Text>
            <Select
              value={locale}
              onChange={setLocale}
              options={config.languageOptions}
              style={{ width: 220 }}
              listHeight={config.languageOptions.length * 36}
              popupMatchSelectWidth={false}
              data-testid="language-select"
            />
          </Space>
        </Col>
      </Row>
    </Layout.Header>
  );
}
