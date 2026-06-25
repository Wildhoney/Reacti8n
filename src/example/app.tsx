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

const languageOptions = [
  { value: Locale.En, label: "English" },
  { value: Locale.Fr, label: "Français" },
  { value: Locale.De, label: "Deutsch" },
  { value: Locale.It, label: "Italiano" },
  { value: Locale.Es, label: "Español" },
];

type CoffeeId = (typeof menu)[number]["id"];

export function App() {
  const { locale, setLocale } = i18n.useLocale();
  const copy = i18n.useI18n(dictionary);

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
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: "100vh", background: "transparent" }}>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            height: 72,
          }}
        >
          <Space direction="vertical" size={0}>
            <Title level={3} style={{ margin: 0 }}>
              {copy.appTitle}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {copy.tagline}
            </Text>
          </Space>
          <Space size="middle" align="center">
            <Text type="secondary">{copy.languageLabel}</Text>
            <Select
              value={locale}
              onChange={(next) => setLocale(next)}
              options={languageOptions}
              style={{ width: 160 }}
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
                    hoverable
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
