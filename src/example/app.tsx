import { useEffect } from "react";
import {
  Card,
  Col,
  ConfigProvider,
  Layout,
  Row,
  Select,
  Space,
  Typography,
  theme,
} from "antd";
import { CircleFlag } from "react-circle-flags";

import { Locale, i18n } from "./i18n";
import { dictionary } from "./dictionary";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const menu = [
  { id: "espresso", price: 2.5, emoji: "☕" },
  { id: "cappuccino", price: 3.75, emoji: "🫖" },
  { id: "latte", price: 4.0, emoji: "🥛" },
  { id: "mocha", price: 4.5, emoji: "🍫" },
  { id: "americano", price: 3.0, emoji: "🇺🇸" },
  { id: "flatWhite", price: 3.85, emoji: "🤍" },
] as const;

const FLAG_FOR: Record<Locale, string> = {
  [Locale.En]: "gb",
  [Locale.Fr]: "fr",
  [Locale.De]: "de",
  [Locale.It]: "it",
  [Locale.Es]: "es",
  [Locale.Ar]: "ae",
  [Locale.Ru]: "ru",
  [Locale.Uk]: "ua",
  [Locale.Ka]: "ge",
  [Locale.Zh]: "cn",
};

const NATIVE_LABEL: Record<Locale, string> = {
  [Locale.En]: "English",
  [Locale.Fr]: "Français",
  [Locale.De]: "Deutsch",
  [Locale.It]: "Italiano",
  [Locale.Es]: "Español",
  [Locale.Ar]: "العربية",
  [Locale.Ru]: "Русский",
  [Locale.Uk]: "Українська",
  [Locale.Ka]: "ქართული",
  [Locale.Zh]: "中文",
};

const languageOptions = (Object.keys(NATIVE_LABEL) as Locale[]).map((code) => ({
  value: code,
  label: (
    <Space size={8}>
      <CircleFlag countryCode={FLAG_FOR[code]} height={18} />
      <span>{NATIVE_LABEL[code]}</span>
    </Space>
  ),
}));

type CoffeeId = (typeof menu)[number]["id"];

export function App() {
  const { locale, setLocale } = i18n.useLocale();
  const copy = i18n.useI18n(dictionary);

  const direction = copy.price.direction;

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  const meta: Record<CoffeeId, { name: string; description: string }> = {
    espresso: {
      name: copy.espressoName,
      description: copy.espressoDescription,
    },
    cappuccino: {
      name: copy.cappuccinoName,
      description: copy.cappuccinoDescription,
    },
    latte: { name: copy.latteName, description: copy.latteDescription },
    mocha: { name: copy.mochaName, description: copy.mochaDescription },
    americano: {
      name: copy.americanoName,
      description: copy.americanoDescription,
    },
    flatWhite: {
      name: copy.flatWhiteName,
      description: copy.flatWhiteDescription,
    },
  };

  return (
    <ConfigProvider
      theme={{ algorithm: theme.defaultAlgorithm }}
      direction={direction}
    >
      <Layout style={{ minHeight: "100vh", background: "transparent" }}>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            padding: "16px 32px",
            height: "auto",
            lineHeight: "normal",
          }}
        >
          <Space direction="vertical" size={2} style={{ minWidth: 0, flex: 1 }}>
            <Title level={3} style={{ margin: 0, lineHeight: 1.2 }}>
              {copy.appTitle}
            </Title>
            <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.4 }}>
              {copy.tagline}
            </Text>
          </Space>
          <Space size="middle" align="center" style={{ flexShrink: 0 }}>
            <Text type="secondary">{copy.languageLabel}</Text>
            <Select
              value={locale}
              onChange={setLocale}
              options={languageOptions}
              style={{ width: 200 }}
              data-testid="language-select"
            />
          </Space>
        </Header>

        <Content
          style={{
            padding: "32px 48px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Row gutter={[24, 24]}>
            {menu.map((entry) => {
              const { name, description } = meta[entry.id];
              return (
                <Col key={entry.id} xs={24} sm={12} lg={8}>
                  <Card
                    title={
                      <Space>
                        <span style={{ fontSize: 22 }}>{entry.emoji}</span>
                        <span>{name}</span>
                      </Space>
                    }
                    data-testid={`coffee-${entry.id}`}
                  >
                    <Paragraph
                      type="secondary"
                      style={{ minHeight: 88 }}
                      data-testid={`coffee-${entry.id}-description`}
                    >
                      {description}
                    </Paragraph>
                    <Text
                      strong
                      style={{ fontSize: 20 }}
                      data-testid={`coffee-${entry.id}-price`}
                    >
                      {copy.price({ amount: entry.price })}
                    </Text>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
