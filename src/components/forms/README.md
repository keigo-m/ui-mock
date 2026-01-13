# 再利用可能フォームコンポーネント

このフォルダには、他のプロジェクトで再利用できるフォームコンポーネントが含まれています。

## ファイル構成

```
src/components/forms/
├── index.tsx    # 全コンポーネント（メイン）
├── types.ts     # 型定義
├── styles.ts    # 共通スタイル・カラー定義
└── README.md    # このファイル
```

---

## クイックスタート

### 1. 依存パッケージをインストール

```bash
npm install react-datepicker date-fns lucide-react
```

### 2. ファイルをコピー

`src/components/forms/` フォルダごと新しいプロジェクトにコピーしてください。

### 3. コンポーネントをインポート

```tsx
import {
  InputField,
  PasswordField,
  SelectField,
  CheckboxField,
  RadioGroup,
  CardRadioGroup,
  ToggleSwitch,
  RangeSlider,
  DatePickerField,
  NumberStepper,
  TextAreaField,
  FileUpload,
} from "@/components/forms";
```

---

## コンポーネント一覧

| コンポーネント    | 説明                       | 主な Props                                                   |
| ----------------- | -------------------------- | ------------------------------------------------------------ |
| `InputField`      | テキスト入力               | `label`, `value`, `onChange`, `type`, `required`             |
| `PasswordField`   | パスワード入力（表示切替） | `label`, `value`, `onChange`, `showPassword`, `onToggleShow` |
| `SelectField`     | セレクトボックス           | `label`, `value`, `onChange`, `options`                      |
| `CheckboxField`   | カード型チェックボックス   | `label`, `description`, `checked`, `onChange`                |
| `RadioGroup`      | ラジオボタン               | `label`, `value`, `onChange`, `options`                      |
| `CardRadioGroup`  | カード型ラジオボタン       | `label`, `value`, `onChange`, `options`, `required`          |
| `ToggleSwitch`    | ON/OFF スイッチ            | `label`, `description`, `enabled`, `onToggle`                |
| `RangeSlider`     | スライダー                 | `label`, `value`, `onChange`, `min`, `max`, `unit`           |
| `DatePickerField` | 日付選択                   | `label`, `value`, `onChange`, `required`                     |
| `NumberStepper`   | 数量ステッパー             | `label`, `value`, `onChange`, `min`, `max`                   |
| `TextAreaField`   | テキストエリア             | `label`, `value`, `onChange`, `rows`, `maxLength`            |
| `FileUpload`      | ファイルアップロード       | `label`, `file`, `onFileSelect`, `accept`                    |

---

## 必要に応じて調整（カスタマイズガイド）

### 1. FormData 型を定義する

プロジェクトに必要なフィールドに合わせて型を定義します。

```tsx
// 例：ユーザー登録フォーム用の型定義
type FormData = {
  // 基本情報
  name: string;
  email: string;
  password: string;

  // 設定
  receiveNewsletter: boolean; // チェックボックス用
  accountType: "free" | "pro"; // ラジオボタン用
  birthDate: Date | null; // 日付選択用

  // 同意設定
  termsAgreement: "" | "agree" | "disagree"; // '' = 未選択
};
```

**ポイント：**

- `string` → テキスト入力、パスワード、セレクト
- `boolean` → チェックボックス、トグルスイッチ
- `'value1' | 'value2'` → ラジオボタン、カード型選択
- `Date | null` → 日付選択（null は未選択）
- `number` → スライダー、数値ステッパー

---

### 2. 初期値を設定する

`useState` でフォームの初期値を設定します。

```tsx
const [formData, setFormData] = useState<FormData>({
  // テキスト系：空文字 or デフォルト値
  name: "",
  email: "",
  password: "",

  // boolean系：false = OFF, true = ON
  receiveNewsletter: false,

  // 選択系：'' = 未選択、または初期選択値
  accountType: "free",

  // 日付系：null = 未選択、または new Date()
  birthDate: null,

  // 同意系：'' = 未選択（必須項目向け）
  termsAgreement: "",
});
```

**初期値の設計パターン：**

| 状態           | 初期値         | ユースケース                     |
| -------------- | -------------- | -------------------------------- |
| 未選択を強制   | `''` or `null` | 必須項目でユーザーに選択させたい |
| デフォルト選択 | `'value'`      | おすすめ設定を初期状態にしたい   |
| OFF 状態       | `false`        | オプション機能、デフォルト OFF   |
| ON 状態        | `true`         | 推奨設定、デフォルト ON          |

---

### 3. セクション構成を定義する（complex-form 風にする場合）

複数セクションのフォームを作る場合：

```tsx
import { User, Shield, Bell, FileText } from "lucide-react";

const SECTIONS = [
  {
    id: "basic", // セクションID（スクロール用）
    label: "基本情報", // 表示ラベル
    icon: User, // アイコン（lucide-react）
    color: "#3B82F6", // テーマカラー
    bgColor: "#DBEAFE", // 背景カラー
    requiredFields: ["name", "email"], // 必須フィールド（完了判定用）
  },
  {
    id: "account",
    label: "アカウント設定",
    icon: Shield,
    color: "#EF4444",
    bgColor: "#FEE2E2",
    requiredFields: ["password"],
  },
  // ... 必要なセクションを追加
];
```

---

### 4. 各コンポーネントの使用例

#### InputField（テキスト入力）

```tsx
<InputField
  label="メールアドレス"
  value={formData.email}
  onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))}
  type="email"
  required
/>
```

#### PasswordField（パスワード入力）

```tsx
const [showPassword, setShowPassword] = useState(false);

<PasswordField
  label="パスワード"
  value={formData.password}
  onChange={(v) => setFormData((prev) => ({ ...prev, password: v }))}
  showPassword={showPassword}
  onToggleShow={() => setShowPassword(!showPassword)}
  required
/>;
```

#### SelectField（セレクトボックス）

```tsx
<SelectField
  label="プラン"
  value={formData.plan}
  onChange={(v) => setFormData((prev) => ({ ...prev, plan: v }))}
  options={[
    { value: "free", label: "無料プラン" },
    { value: "pro", label: "Proプラン - ¥980/月" },
    { value: "enterprise", label: "Enterpriseプラン" },
  ]}
/>
```

#### CheckboxField（カード型チェックボックス）

```tsx
<CheckboxField
  label="週次レポート"
  description="毎週月曜日にサマリーを送信"
  checked={formData.weeklyReport}
  onChange={(v) => setFormData((prev) => ({ ...prev, weeklyReport: v }))}
/>
```

#### RadioGroup（ラジオボタン）

```tsx
<RadioGroup
  label="アカウントタイプ"
  value={formData.accountType}
  onChange={(v) => setFormData((prev) => ({ ...prev, accountType: v }))}
  options={[
    { value: "personal", label: "個人" },
    { value: "business", label: "ビジネス" },
  ]}
  required
/>
```

#### CardRadioGroup（カード型排他選択）

```tsx
<CardRadioGroup
  label="利用規約への同意"
  value={formData.termsAgreement}
  onChange={(v) => setFormData((prev) => ({ ...prev, termsAgreement: v }))}
  options={[
    {
      value: "agree",
      label: "同意する",
      description: "利用規約の内容を確認し、同意します",
      icon: <Check style={{ width: 20, height: 20 }} />,
    },
    {
      value: "disagree",
      label: "同意しない",
      description: "同意しない場合、サービスを利用できません",
      icon: <X style={{ width: 20, height: 20 }} />,
    },
  ]}
  required
/>
```

#### ToggleSwitch（ON/OFF スイッチ）

```tsx
<ToggleSwitch
  label="ダークモード"
  description="画面を暗くして目の負担を軽減"
  enabled={formData.darkMode}
  onToggle={(v) => setFormData((prev) => ({ ...prev, darkMode: v }))}
/>
```

#### RangeSlider（スライダー）

```tsx
<RangeSlider
  label="フォントサイズ"
  value={formData.fontSize}
  onChange={(v) => setFormData((prev) => ({ ...prev, fontSize: v }))}
  min={12}
  max={24}
  unit="px"
/>
```

#### DatePickerField（日付選択）

```tsx
<DatePickerField
  label="生年月日"
  value={formData.birthDate}
  onChange={(v) => setFormData((prev) => ({ ...prev, birthDate: v }))}
  required
/>
```

#### NumberStepper（数量ステッパー）

```tsx
<NumberStepper
  label="数量"
  value={formData.quantity}
  onChange={(v) => setFormData((prev) => ({ ...prev, quantity: v }))}
  min={1}
  max={99}
/>
```

#### TextAreaField（テキストエリア）

```tsx
<TextAreaField
  label="自己紹介"
  value={formData.bio}
  onChange={(v) => setFormData((prev) => ({ ...prev, bio: v }))}
  rows={4}
  maxLength={500}
  placeholder="あなたについて教えてください..."
/>
```

#### FileUpload（ファイルアップロード）

```tsx
const [file, setFile] = useState<File | null>(null);

<FileUpload
  label="プロフィール画像"
  file={file}
  onFileSelect={setFile}
  accept="image/*"
  maxSizeText="PNG, JPG (最大5MB)"
/>;
```

---

## スタイルのカスタマイズ

### カラーを変更

`styles.ts` の `colors` オブジェクトを編集：

```ts
export const colors = {
  // プライマリカラーを変更（例：緑に変更）
  primary: "#10B981", // 緑
  primaryDark: "#059669",
  primaryLight: "#ECFDF5",
  primaryBg: "#D1FAE5",

  // エラーカラーを変更
  error: "#DC2626",
  // ...
};
```

### 入力フィールドのスタイルを変更

`styles.ts` の `inputStyle` を編集：

```ts
export const inputStyle: React.CSSProperties = {
  borderRadius: "8px", // 丸みを変更（12px → 8px）
  padding: "14px 18px", // パディングを変更
  fontSize: "15px", // フォントサイズを変更
  // ...
};
```

---

## トラブルシューティング

### Q: DatePicker のカレンダーが表示されない

CSS がインポートされているか確認：

```tsx
import "react-datepicker/dist/react-datepicker.css";
```

### Q: アイコンが表示されない

lucide-react がインストールされているか確認：

```bash
npm install lucide-react
```

### Q: 他の CSS と競合する

スタイルの優先度を上げるか、CSS モジュールを使用してください。

---

## 参考：complex-form の構成

元となった `complex-form/page.tsx` の構成：

| 行番号     | 内容                       |
| ---------- | -------------------------- |
| 23〜78     | `FormData` 型定義          |
| 83〜92     | `SECTIONS` 配列定義        |
| 94〜142    | 初期値 `useState`          |
| 148〜200   | 完了判定・スクロールスパイ |
| 200〜520   | コンポーネント定義         |
| 640〜900   | 各セクションの UI          |
| 1200〜1250 | アクションバー             |

---

## UI 機能の実装パターン

complex-form で使用されている UX 向上機能の実装方法を説明します。

### ✅ Sticky Sidebar（目次固定）

スクロールしても左側に目次が常に表示される機能です。

```tsx
// サイドバーのスタイル
<nav
  style={{
    position: "sticky", // スクロールに追従
    top: "100px", // トップからの距離
    maxHeight: "calc(100vh - 140px)", // 画面高さに合わせる
    overflowY: "auto", // 内容が多い場合はスクロール
    width: "280px",
    flexShrink: 0,
  }}
>
  {/* サイドバーの中身 */}
</nav>
```

**ポイント：**

- `position: 'sticky'` でスクロール追従
- `top` で固定位置を指定
- `maxHeight: 'calc(100vh - XXpx)'` で画面内に収める

---

### ✅ Sticky Action Bar（下部固定ボタン）

「変更を保存」ボタンが常に画面下部に表示される機能です。

```tsx
// アクションバーのスタイル
<div
  style={{
    position: "fixed", // 画面に固定
    bottom: 0, // 画面下部に配置
    left: 0,
    right: 0,
    zIndex: 50, // 他の要素より手前に
    background: "rgba(255, 255, 255, 0.85)", // 半透明背景
    backdropFilter: "blur(20px)", // ぼかし効果
    WebkitBackdropFilter: "blur(20px)", // Safari対応
    borderTop: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "16px 32px",
  }}
>
  <button>変更を保存</button>
</div>
```

**ポイント：**

- `position: 'fixed'` + `bottom: 0` で画面下部に固定
- `backdropFilter: 'blur()'` でおしゃれなぼかし効果
- `zIndex` を高くして他の要素より手前に表示

---

### ✅ Scroll Spy（自動ハイライト）

スクロールに応じて、現在のセクションが目次でハイライトされる機能です。

```tsx
// 状態管理
const [activeSection, setActiveSection] = useState("basic");
const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

// スクロール監視
useEffect(() => {
  const handleScroll = () => {
    // 各セクションの位置を確認
    for (const section of SECTIONS) {
      const element = sectionRefs.current[section.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        // 画面上部から200px以内に入ったらアクティブに
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// 各セクションにrefを設定
<section
  id="basic"
  ref={(el) => {
    sectionRefs.current["basic"] = el;
  }}
>
  {/* セクションの中身 */}
</section>;
```

**サイドバーでのハイライト表示：**

```tsx
<button
  onClick={() => scrollToSection(section.id)}
  style={{
    background:
      activeSection === section.id
        ? `linear-gradient(135deg, ${section.bgColor} 0%, ${section.color}15 100%)`
        : "transparent",
    borderLeft:
      activeSection === section.id
        ? `3px solid ${section.color}`
        : "3px solid transparent",
    // ... その他のスタイル
  }}
>
  {section.label}
</button>
```

**ポイント：**

- `useRef` で各セクションの DOM 要素を保持
- `getBoundingClientRect()` で画面上の位置を取得
- 条件に合うセクションを `activeSection` にセット
- サイドバーのボタンで `activeSection` に応じてスタイル変更

---

### ✅ 各セクションの入力完了判定

セクションごとに必須項目が入力されているかを判定し、チェックマークを表示する機能です。

**セクション定義に必須フィールドを設定：**

```tsx
const SECTIONS = [
  {
    id: "basic",
    label: "基本情報",
    requiredFields: ["lastName", "firstName", "email"], // 必須フィールド
  },
  {
    id: "account",
    label: "アカウント設定",
    requiredFields: ["password"],
  },
  // ... 他のセクション
];
```

**完了判定関数：**

```tsx
// セクションが完了しているかを判定
const isSectionComplete = (sectionId: string): boolean => {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return false;

  // 必須フィールドがない場合は完了とみなす
  if (section.requiredFields.length === 0) return true;

  // すべての必須フィールドが入力されているか確認
  return section.requiredFields.every((field) => {
    const value = formData[field as keyof FormData];

    // 型に応じたチェック
    if (typeof value === "string") {
      return value.trim() !== ""; // 空文字でないこと
    }
    if (typeof value === "boolean") {
      return true; // booleanは常にOK
    }
    if (value instanceof Date) {
      return true; // Date型は常にOK
    }
    if (value === null) {
      return false; // nullは未入力
    }
    return Boolean(value);
  });
};
```

**サイドバーでの完了表示：**

```tsx
<button>
  <section.icon />
  <span>{section.label}</span>

  {/* 完了チェックマーク */}
  {isSectionComplete(section.id) && (
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "#10B981", // 緑色
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check style={{ width: "12px", height: "12px", color: "#FFFFFF" }} />
    </div>
  )}
</button>
```

**全体の進捗率を計算：**

```tsx
// 完了したセクション数をカウント
const completedSections = SECTIONS.filter((s) =>
  isSectionComplete(s.id)
).length;
const totalSections = SECTIONS.length;
const completionRate = Math.round((completedSections / totalSections) * 100);

// 進捗バーに表示
<div
  style={{
    width: `${completionRate}%`,
    height: "100%",
    background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
    transition: "width 0.3s ease",
  }}
/>;
```

---

## まとめ：UI 機能一覧

| 機能              | 実装方法                 | 主な CSS/React                          |
| ----------------- | ------------------------ | --------------------------------------- |
| Sticky Sidebar    | スクロール追従目次       | `position: sticky`                      |
| Sticky Action Bar | 下部固定ボタン           | `position: fixed`, `bottom: 0`          |
| Scroll Spy        | スクロール連動ハイライト | `useEffect`, `getBoundingClientRect()`  |
| 完了判定          | 必須項目チェック         | `requiredFields`, `isSectionComplete()` |
| 進捗バー          | 完了セクション率表示     | 完了数 / 全体数 × 100                   |
| ぼかし背景        | グラスモーフィズム       | `backdropFilter: blur()`                |
