import { useCallback } from "react";
import { Typography, Button, Card, Row, Col, Space, Tag } from "antd";
import {
  FormOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  BuildOutlined,
  DragOutlined,
  CodeOutlined,
  RocketOutlined,
  GithubOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { history } from "@umijs/max";

const { Title, Paragraph, Text } = Typography;

const FEATURES = [
  {
    icon: <DragOutlined style={{ fontSize: 32, color: "#1677ff" }} />,
    title: "拖拽式表单设计",
    desc: "通过直观的拖拽操作快速构建复杂表单，支持多种组件类型，无需编写一行代码。",
  },
  {
    icon: <ApiOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    title: "字段联动规则",
    desc: "灵活的条件规则引擎，支持字段间的显示/隐藏、必填/可选等联动逻辑配置。",
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 32, color: "#fa8c16" }} />,
    title: "公式计算引擎",
    desc: "内置强大的公式解析器，支持跨字段计算、条件表达式和自定义函数。",
  },
  {
    icon: <BuildOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
    title: "模块化架构",
    desc: "Core / Drawer / Renderer 三层解耦设计，灵活组合，支持独立部署和扩展。",
  },
  {
    icon: <CodeOutlined style={{ fontSize: 32, color: "#eb2f96" }} />,
    title: "JSON 驱动",
    desc: "表单配置完全以 JSON 描述，支持导入导出，便于版本管理和跨系统迁移。",
  },
  {
    icon: <FormOutlined style={{ fontSize: 32, color: "#13c2c2" }} />,
    title: "多端渲染",
    desc: "同一套表单配置可在 PC 和移动端渲染，Drawer 设计器 + Renderer 运行时无缝衔接。",
  },
];

const TECH_STACK = [
  "React 18",
  "TypeScript",
  "Ant Design 5",
  "Umi.js 4",
  "Zustand",
  "dnd-kit",
  "CodeMirror 6",
  "Rollup",
  "pnpm Monorepo",
];

const Home = () => {
  const goDemo = useCallback(() => {
    history.push("/demo");
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "100px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <Space align="center" style={{ marginBottom: 24 }}>
            <RocketOutlined style={{ fontSize: 48, color: "#fff" }} />
            <Title
              style={{
                color: "#fff",
                margin: 0,
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              MetaFlux
            </Title>
          </Space>

          <Paragraph
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 22,
              maxWidth: 600,
              margin: "0 auto 16px",
              lineHeight: 1.6,
            }}
          >
            下一代低代码表单构建平台
          </Paragraph>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 16,
              maxWidth: 560,
              margin: "0 auto 40px",
            }}
          >
            拖拽设计 · 公式引擎 · 联动规则 · 多端渲染 —— 用 JSON
            驱动一切表单场景
          </Paragraph>

          <Space size="middle">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={goDemo}
              style={{
                height: 52,
                paddingInline: 36,
                fontSize: 17,
                borderRadius: 26,
                background: "#fff",
                color: "#764ba2",
                border: "none",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              在线体验
            </Button>
            <Button
              size="large"
              ghost
              icon={<GithubOutlined />}
              href="https://github.com"
              target="_blank"
              style={{
                height: 52,
                paddingInline: 36,
                fontSize: 17,
                borderRadius: 26,
                fontWeight: 600,
              }}
            >
              GitHub
            </Button>
          </Space>
        </div>
      </section>

      {/* Features */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
          核心能力
        </Title>
        <Paragraph
          type="secondary"
          style={{
            textAlign: "center",
            fontSize: 16,
            marginBottom: 56,
          }}
        >
          MetaFlux 为复杂表单场景提供完整的设计、配置与渲染解决方案
        </Paragraph>

        <Row gutter={[24, 24]}>
          {FEATURES.map((f) => (
            <Col xs={24} sm={12} md={8} key={f.title}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: 12,
                  border: "1px solid #f0f0f0",
                }}
                styles={{ body: { padding: 28 } }}
              >
                <div style={{ marginBottom: 16 }}>{f.icon}</div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {f.title}
                </Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  {f.desc}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Architecture */}
      <section style={{ background: "#fafafa", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            架构设计
          </Title>
          <Paragraph
            type="secondary"
            style={{ textAlign: "center", fontSize: 16, marginBottom: 56 }}
          >
            三层解耦，灵活组合
          </Paragraph>

          <Row gutter={[24, 24]} justify="center">
            {[
              {
                name: "@metaflux/core",
                color: "#1677ff",
                desc: "核心层 — 类型定义、公式引擎、规则模型，零 UI 依赖",
              },
              {
                name: "@metaflux/drawer",
                color: "#52c41a",
                desc: "设计器层 — 拖拽画布、属性面板、联动规则配置、代码编辑器",
              },
              {
                name: "@metaflux/renderer",
                color: "#fa8c16",
                desc: "渲染层 — 多端表单运行时，将 JSON 配置渲染为可交互表单",
              },
            ].map((pkg) => (
              <Col xs={24} md={8} key={pkg.name}>
                <Card
                  style={{
                    borderRadius: 12,
                    borderTop: `3px solid ${pkg.color}`,
                    height: "100%",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <Text
                    code
                    style={{ fontSize: 15, display: "block", marginBottom: 12 }}
                  >
                    {pkg.name}
                  </Text>
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    {pkg.desc}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Tech Stack */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
          技术栈
        </Title>
        <Paragraph
          type="secondary"
          style={{ textAlign: "center", fontSize: 16, marginBottom: 40 }}
        >
          基于现代前端生态构建
        </Paragraph>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {TECH_STACK.map((tech) => (
            <Tag
              key={tech}
              style={{
                fontSize: 15,
                padding: "6px 20px",
                borderRadius: 20,
                border: "1px solid #d9d9d9",
              }}
            >
              {tech}
            </Tag>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ color: "#fff", marginBottom: 12 }}>
          开始构建你的表单
        </Title>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 16,
            marginBottom: 32,
          }}
        >
          打开在线 Demo，体验拖拽式表单设计的高效与优雅
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={goDemo}
          style={{
            height: 52,
            paddingInline: 40,
            fontSize: 17,
            borderRadius: 26,
            background: "#fff",
            color: "#764ba2",
            border: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          进入 Demo
        </Button>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px 24px",
          textAlign: "center",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Text type="secondary">
          MetaFlux &copy; {new Date().getFullYear()} &middot; MIT License
        </Text>
      </footer>
    </div>
  );
};

export default Home;
