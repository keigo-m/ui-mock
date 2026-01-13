# 再利用可能フォームコンポーネント導入マニュアル

初心者向け：ゼロから Next.js プロジェクトを作成し、再利用可能なフォームコンポーネントを使用するまでの手順書です。

---

## 目次

1. [環境準備](#1-環境準備)
2. [Next.js プロジェクト作成](#2-nextjsプロジェクト作成)
3. [依存パッケージのインストール](#3-依存パッケージのインストール)
4. [コンポーネントファイルのコピー](#4-コンポーネントファイルのコピー)
5. [コンポーネントの使用方法](#5-コンポーネントの使用方法)
6. [レイアウトパターンの実装](#6-レイアウトパターンの実装)

---

## 1. 環境準備

### 1.1 必要なソフトウェア

| ソフトウェア | バージョン | ダウンロード URL               |
| ------------ | ---------- | ------------------------------ |
| Node.js      | 18.x 以上  | https://nodejs.org/            |
| VS Code      | 最新版     | https://code.visualstudio.com/ |
| Git          | 最新版     | https://git-scm.com/           |

### 1.2 インストール確認

VS Code のターミナル（`Ctrl + @`）で以下を実行：

```bash
node -v
# 出力例: v20.10.0

npm -v
# 出力例: 10.2.3
```

---

## 2. Next.js プロジェクト作成

### 2.1 プロジェクト作成

VS Code を開き、ターミナルで以下を実行：

```bash
# 任意のフォルダに移動（例：C:\dev）
cd C:\dev

# Next.jsプロジェクトを作成
npx create-next-app@latest my-form-app
```

### 2.2 設定オプション

以下のように回答してください：

```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → No（推奨）
✔ Would you like your code inside a `src/` directory? → Yes
✔ Would you like to use App Router? → Yes
✔ Would you like to use Turbopack? → No
✔ Would you like to customize the import alias? → No
```

### 2.3 プロジェクトを開く

```bash
# プロジェクトフォルダに移動
cd my-form-app

# VS Codeで開く
code .
```

---

## 3. 依存パッケージのインストール

VS Code のターミナルで以下を実行：

```bash
# 必要なパッケージをインストール
npm install lucide-react react-datepicker date-fns

# TypeScript型定義をインストール
npm install -D @types/react-datepicker
```

### 3.1 パッケージ説明

| パッケージ         | 用途                   |
| ------------------ | ---------------------- |
| `lucide-react`     | アイコンライブラリ     |
| `react-datepicker` | 日付選択コンポーネント |
| `date-fns`         | 日付操作ユーティリティ |

---

## 4. コンポーネントファイルのコピー

### 4.1 フォルダ構成

以下のフォルダ構成を作成してください：

```
src/
├── components/
│   └── forms/
│       ├── index.tsx      ← メインファイル（コンポーネント定義）
│       ├── types.ts       ← 型定義
│       └── styles.ts      ← スタイル定数
└── app/
    └── page.tsx           ← サンプルページ
```

### 4.2 コピー元ファイル

以下の 3 ファイルをコピーしてください：

| コピー元                                 | コピー先                         |
| ---------------------------------------- | -------------------------------- |
| `ui-mock/src/components/forms/index.tsx` | `src/components/forms/index.tsx` |
| `ui-mock/src/components/forms/types.ts`  | `src/components/forms/types.ts`  |
| `ui-mock/src/components/forms/styles.ts` | `src/components/forms/styles.ts` |

> [!TIP]
> VS Code でフォルダを作成するには、エクスプローラーで右クリック → 「新しいフォルダー」

---

## 5. コンポーネントの使用方法

### 5.1 基本的なインポート

```tsx
// src/app/page.tsx
"use client";

import { useState } from "react";
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

### 5.2 使用例：基本フォーム

```tsx
"use client";

import { useState } from "react";
import { InputField, SelectField, PasswordField } from "@/components/forms";

export default function MyFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState("");

  const categoryOptions = [
    { value: "a", label: "カテゴリA" },
    { value: "b", label: "カテゴリB" },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>お問い合わせフォーム</h1>

      <InputField label="お名前" value={name} onChange={setName} required />

      <InputField
        label="メールアドレス"
        value={email}
        onChange={setEmail}
        type="email"
        placeholder="example@email.com"
      />

      <PasswordField
        label="パスワード"
        value={password}
        onChange={setPassword}
        showPassword={showPassword}
        onToggleShow={() => setShowPassword(!showPassword)}
        required
      />

      <SelectField
        label="カテゴリ"
        value={category}
        onChange={setCategory}
        options={categoryOptions}
      />

      <button style={{ marginTop: "24px", padding: "12px 24px" }}>送信</button>
    </div>
  );
}
```

### 5.3 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて確認。

---

## 6. レイアウトパターンの実装

### 6.1 Sticky Header（上部固定ヘッダー）

```tsx
<header
  style={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #E5E7EB",
    padding: "12px 32px",
  }}
>
  ヘッダー内容
</header>
```

### 6.2 Sticky Footer（下部固定フッター）

```tsx
<footer
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "rgba(255, 255, 255, 0.95)",
    borderTop: "1px solid #E5E7EB",
    padding: "12px 32px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  }}
>
  <button>キャンセル</button>
  <button>保存</button>
  <button>依頼</button>
</footer>
```

### 6.3 Sticky Sidebar（左部固定サイドバー）

```tsx
<aside
  style={{
    position: "sticky",
    top: "80px", // ヘッダー高さ分下げる
    alignSelf: "flex-start",
    width: "200px",
  }}
>
  ナビゲーション
</aside>
```

### 6.4 Scroll Spy（スクロール連動ナビ）

```tsx
"use client";
import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "section1", label: "セクション1" },
  { id: "section2", label: "セクション2" },
];

export default function ScrollSpyExample() {
  const [activeSection, setActiveSection] = useState("section1");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      for (const section of SECTIONS) {
        const el = sectionRefs.current[section.id];
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* サイドバー */}
      <aside>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            style={{
              background: activeSection === s.id ? "#EFF6FF" : "transparent",
              color: activeSection === s.id ? "#3B82F6" : "#6B7280",
            }}
            onClick={() =>
              sectionRefs.current[s.id]?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {s.label}
          </button>
        ))}
      </aside>

      {/* メインコンテンツ */}
      <main>
        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            ref={(el) => {
              sectionRefs.current[s.id] = el;
            }}
          >
            {s.label}の内容
          </section>
        ))}
      </main>
    </div>
  );
}
```

---

## コンポーネント一覧

| #   | コンポーネント    | 用途                           |
| --- | ----------------- | ------------------------------ |
| 1   | `InputField`      | テキスト入力                   |
| 2   | `PasswordField`   | パスワード入力（表示切替付き） |
| 3   | `SelectField`     | ドロップダウン選択             |
| 4   | `CheckboxField`   | チェックボックス               |
| 5   | `RadioGroup`      | ラジオボタン                   |
| 6   | `CardRadioGroup`  | カード型ラジオ                 |
| 7   | `ToggleSwitch`    | ON/OFF スイッチ                |
| 8   | `RangeSlider`     | スライダー                     |
| 9   | `DatePickerField` | 日付選択                       |
| 10  | `NumberStepper`   | 数値増減                       |
| 11  | `TextAreaField`   | 複数行テキスト                 |
| 12  | `FileUpload`      | ファイルアップロード           |

---

## トラブルシューティング

### エラー：モジュールが見つからない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

### エラー：TypeScript 型エラー

```bash
# 型定義を再インストール
npm install -D @types/react @types/node @types/react-datepicker
```

### 画面が表示されない

1. ターミナルでエラーを確認
2. `npm run dev` を再実行
3. ブラウザのキャッシュをクリア（`Ctrl + Shift + R`）

---

## 参考リンク

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [React 公式ドキュメント](https://react.dev/)
- [Lucide Icons アイコン一覧](https://lucide.dev/icons/)
- [react-datepicker](https://reactdatepicker.com/)
