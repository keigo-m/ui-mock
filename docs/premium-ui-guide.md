# プレミアム UI デザインガイド

このドキュメントでは、`/components/complex-form` で実装されているプレミアム UI の作成方法を初心者向けに解説します。

---

## 目次

1. [背景のグラデーション](#1-背景のグラデーション)
2. [ガラスモーフィズム効果](#2-ガラスモーフィズム効果)
3. [カードデザイン](#3-カードデザイン)
4. [入力フィールドのスタイリング](#4-入力フィールドのスタイリング)
   - 4.1 [パスワード入力](#41-パスワード入力表示非表示切り替え)
   - 4.2 [ラジオボタン](#42-ラジオボタン通常スタイル)
   - 4.3 [カード型排他選択](#43-カード型排他選択チェックボックス風だが1つのみ選択可能)
   - 4.4 [トグルスイッチ](#44-トグルスイッチonoff)
   - 4.5 [スライダー](#45-スライダーレンジ入力)
   - 4.6 [検索入力](#46-検索入力サーチボックス)
   - 4.7 [日付選択](#47-日付選択デートピッカー)
   - 4.8 [ファイルアップロード](#48-ファイルアップロード)
   - 4.9 [数値入力](#49-数値入力ステッパー付き)
   - 4.10 [テキストエリア](#410-テキストエリア複数行入力)
5. [アイコンとカラーテーマ](#5-アイコンとカラーテーマ)
6. [ステータスバッジ](#6-ステータスバッジ)
7. [Sticky 要素（固定表示）](#7-sticky要素固定表示)
8. [完了判定ロジック](#8-完了判定ロジック)

---

## 1. 背景のグラデーション

### 基本的な考え方

ページ全体に奥行きと高級感を与えるために、グラデーション背景を使用します。

### 実装コード

```tsx
<div
  style={{
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)",
  }}
>
  {/* コンテンツ */}
</div>
```

### パラメータ解説

| パラメータ     | 説明                                         | 例                                                         |
| -------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `135deg`       | グラデーションの角度。135 度は左上から右下へ | `0deg`（上 → 下）, `90deg`（左 → 右）, `180deg`（下 → 上） |
| `#F0F4FF 0%`   | 開始色と位置（0%=開始点）                    | 薄い青                                                     |
| `#E0E7FF 50%`  | 中間色と位置（50%=中央）                     | やや濃い青紫                                               |
| `#F5F3FF 100%` | 終了色と位置（100%=終点）                    | 薄い紫                                                     |

### カラーバリエーション

```tsx
// 青系（クール・信頼感）
background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)";

// 緑系（自然・安心感）
background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)";

// 暖色系（エネルギー・親しみ）
background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)";

// ダーク系（高級感・プロフェッショナル）
background: "linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)";
```

---

## 2. ガラスモーフィズム効果

### 基本的な考え方

ガラスモーフィズム（Glassmorphism）は、要素を半透明にして背景をぼかすことで、フロストガラスのような見た目を作る手法です。

### 実装コード

```tsx
<header
  style={{
    background: "rgba(255, 255, 255, 0.8)", // 半透明の白
    backdropFilter: "blur(20px)", // 背景のぼかし
    WebkitBackdropFilter: "blur(20px)", // Safari対応
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)", // うっすらとした境界線
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)", // 柔らかいシャドウ
  }}
>
  {/* ヘッダーコンテンツ */}
</header>
```

### パラメータ解説

| パラメータ                 | 説明                                     | 推奨値                     |
| -------------------------- | ---------------------------------------- | -------------------------- |
| `rgba(255, 255, 255, 0.8)` | 背景色の透明度。0 が完全透明、1 が不透明 | 0.7〜0.9                   |
| `blur(20px)`               | ぼかしの強さ。大きいほどぼける           | 10px〜30px                 |
| `border`                   | 境界線。半透明にすると自然               | `rgba(255, 255, 255, 0.3)` |

### 注意点

```tsx
// 必ず position: sticky または fixed と組み合わせる
// そうしないと背景がぼけているかわからない
style={{
  position: 'sticky',
  top: 0,
  zIndex: 50,  // 他の要素より手前に表示
  // ... ガラスモーフィズムのスタイル
}}
```

---

## 3. カードデザイン

### 基本的な考え方

コンテンツをカードとして区切ることで、視認性と整理感が向上します。

### 実装コード

```tsx
const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "20px", // 丸み
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  border: "1px solid #E5E7EB",
  overflow: "hidden", // 子要素がはみ出さないように
};

// 使用例
<div style={cardStyle}>
  <div style={{ padding: "24px" }}>{/* カードの中身 */}</div>
</div>;
```

### シャドウのバリエーション

```tsx
// ソフト（控えめ）
boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)";

// 標準
boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)";

// 強め（浮遊感）
boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)";

// カラーシャドウ（アクセント）
boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)"; // 青い影
```

### 角丸（borderRadius）の目安

| 用途           | 推奨値          |
| -------------- | --------------- |
| ボタン         | 8px〜12px       |
| 入力フィールド | 10px〜14px      |
| カード         | 16px〜24px      |
| アイコン背景   | 10px〜14px      |
| 丸アイコン     | 50%（完全な円） |

---

## 4. 入力フィールドのスタイリング

### 基本的な考え方

入力フィールドは、境界線・角丸・パディングで読みやすく、フォーカス時のスタイルでインタラクティブ感を出します。

### 実装コード

```tsx
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #D1D5DB", // グレーの境界線
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  color: "#111827", // 濃いグレー（テキスト）
  background: "#FFFFFF",
  outline: "none",
  transition: "all 0.2s ease", // スムーズなアニメーション
};

// フォーカス時のスタイル変更
<input
  style={inputStyle}
  onFocus={(e) => {
    e.target.style.borderColor = "#3B82F6"; // 青い境界線
    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; // 青い光彩
  }}
  onBlur={(e) => {
    e.target.style.borderColor = "#D1D5DB";
    e.target.style.boxShadow = "none";
  }}
/>;
```

### ラベルのスタイリング

```tsx
<label
  style={{
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151", // 中間のグレー
    marginBottom: "8px",
  }}
>
  項目名
  {required && <span style={{ color: "#EF4444" }}>*</span>} {/* 必須マーク */}
</label>
```

### セレクトボックス（ドロップダウン）

選択肢が多い場合に使用します。従業員数、業種などに最適です。

```tsx
const SelectField = ({ label, value, options, onChange, required = false }) => (
  <div style={{ marginBottom: "4px" }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "8px",
      }}
    >
      {label}
      {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        border: "1px solid #D1D5DB",
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "14px",
        color: "#111827",
        background: "#FFFFFF",
        outline: "none",
        cursor: "pointer",
        appearance: "none", // ブラウザデフォルトの矢印を削除
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
```

#### 使用例

```tsx
<SelectField
  label="従業員数"
  value={formData.employeeCount}
  onChange={(v) => handleInputChange("employeeCount", v)}
  options={[
    { value: "1-10名", label: "1-10名" },
    { value: "11-50名", label: "11-50名" },
    { value: "51-200名", label: "51-200名" },
    { value: "201-500名", label: "201-500名" },
    { value: "501名以上", label: "501名以上" },
  ]}
/>
```

### チェックボックス（カード型）

ON/OFF の設定項目に使用します。通知設定やセキュリティ設定に最適です。

```tsx
const CheckboxField = ({ label, description, checked, onChange }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      cursor: "pointer",
      background: checked
        ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
        : "#FFFFFF",
      transition: "all 0.2s ease",
    }}
  >
    <div>
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>
        {label}
      </span>
      <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
        {description}
      </p>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{
        width: "20px",
        height: "20px",
        accentColor: "#3B82F6", // チェックの色
        cursor: "pointer",
      }}
    />
  </label>
);
```

#### 使用例

```tsx
<CheckboxField
  label="週次レポート"
  description="毎週月曜日にアクティビティサマリーを送信"
  checked={formData.weeklyReport}
  onChange={(v) => handleInputChange("weeklyReport", v)}
/>
```

---

## 4.1 パスワード入力（表示/非表示切り替え）

### 基本的な考え方

パスワード入力には、ユーザーが入力内容を確認できるよう「表示/非表示」の切り替えボタンを付けます。

### 実装コード

```tsx
import { Eye, EyeOff } from "lucide-react";

const [showPassword, setShowPassword] = useState(false);

const PasswordField = ({
  label,
  field,
  showPasswordState,
  setShowPasswordState,
  required = false,
}) => (
  <div style={{ marginBottom: "4px" }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "8px",
      }}
    >
      {label}
      {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <div style={{ position: "relative" }}>
      <input
        type={showPasswordState ? "text" : "password"} // 表示状態で切り替え
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        style={{ ...inputStyle, paddingRight: "48px" }} // ボタン分の余白
      />
      <button
        type="button"
        onClick={() => setShowPasswordState(!showPasswordState)}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          color: "#6B7280",
        }}
      >
        {
          showPasswordState ? (
            <EyeOff style={{ width: "20px", height: "20px" }} /> // 非表示アイコン
          ) : (
            <Eye style={{ width: "20px", height: "20px" }} />
          ) // 表示アイコン
        }
      </button>
    </div>
    <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>
      {showPasswordState ? "パスワードを表示中" : "クリックでパスワードを表示"}
    </p>
  </div>
);
```

### 使用例

```tsx
<PasswordField
  label="パスワード"
  field="password"
  showPasswordState={showPassword}
  setShowPasswordState={setShowPassword}
  required
/>
```

---

## 4.2 ラジオボタン（通常スタイル）

### 基本的な考え方

複数の選択肢から 1 つだけ選ぶ場合に使用します。選択状態を視覚的にわかりやすくするため、カードスタイルにします。

### 実装コード

```tsx
const RadioGroup = ({ label, field, options, required = false }) => (
  <div style={{ marginBottom: "4px" }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "12px",
      }}
    >
      {label}
      {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {options.map((option) => (
        <label
          key={option.value}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "14px 16px",
            border:
              formData[field] === option.value
                ? "2px solid #3B82F6"
                : "1px solid #E5E7EB",
            borderRadius: "12px",
            cursor: "pointer",
            background:
              formData[field] === option.value
                ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
                : "#FFFFFF",
            transition: "all 0.2s ease",
          }}
        >
          <input
            type="radio"
            name={field}
            value={option.value}
            checked={formData[field] === option.value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            style={{
              width: "20px",
              height: "20px",
              accentColor: "#3B82F6",
              marginTop: "2px",
            }}
          />
          <div>
            <span
              style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}
            >
              {option.label}
            </span>
            {option.description && (
              <p
                style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}
              >
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  </div>
);
```

### 使用例

```tsx
<RadioGroup
  label="アカウントタイプ"
  field="accountType"
  required
  options={[
    { value: "free", label: "無料プラン", description: "基本機能のみ利用可能" },
    { value: "standard", label: "スタンダード", description: "月額 ¥980" },
    { value: "premium", label: "プレミアム", description: "月額 ¥2,980" },
  ]}
/>
```

---

## 4.3 カード型排他選択（チェックボックス風だが 1 つのみ選択可能）

### 基本的な考え方

見た目はチェックボックスのカードですが、実際には 1 つしか選択できない（ラジオボタンの動作）UI パターンです。
「同意する」「一部同意」「同意しない」のような選択肢に最適です。

### 実装コード

```tsx
const CardRadioGroup = ({ label, field, options, required = false }) => (
  <div style={{ marginBottom: "4px" }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "12px",
      }}
    >
      {label}
      {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {options.map((option) => {
        const isSelected = formData[field] === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleInputChange(field, option.value)} // クリックで選択
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              border: isSelected ? "2px solid #3B82F6" : "1px solid #E5E7EB",
              borderRadius: "14px",
              cursor: "pointer",
              background: isSelected
                ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
                : "#FFFFFF",
              textAlign: "left",
              boxShadow: isSelected
                ? "0 4px 12px rgba(59, 130, 246, 0.15)"
                : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* アイコン（オプション） */}
              {option.icon && (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: isSelected ? "#3B82F6" : "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSelected ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  {option.icon}
                </div>
              )}
              <div>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: isSelected ? "#1E40AF" : "#111827",
                  }}
                >
                  {option.label}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: isSelected ? "#3B82F6" : "#6B7280",
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  {option.description}
                </span>
              </div>
            </div>

            {/* チェックボックス風インジケータ（重要！） */}
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px", // 角丸の四角形
                border: isSelected ? "none" : "2px solid #D1D5DB",
                background: isSelected
                  ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
                  : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected
                  ? "0 2px 4px rgba(59, 130, 246, 0.3)"
                  : "none",
              }}
            >
              {isSelected && (
                <Check
                  style={{ width: "16px", height: "16px", color: "#FFFFFF" }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);
```

### 使用例

```tsx
<CardRadioGroup
  label="利用規約への同意"
  field="termsAgreement"
  required
  options={[
    {
      value: "agree",
      label: "同意する",
      description: "利用規約のすべての条項に同意します",
      icon: <Check style={{ width: "20px", height: "20px" }} />,
    },
    {
      value: "partial",
      label: "一部同意",
      description: "一部の条項について確認が必要です",
      icon: <AlertCircle style={{ width: "20px", height: "20px" }} />,
    },
    {
      value: "disagree",
      label: "同意しない",
      description: "利用規約に同意できません",
      icon: <AlertCircle style={{ width: "20px", height: "20px" }} />,
    },
  ]}
/>
```

### ポイント

| 要素                     | 説明                                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| `button` を使用          | `<input type="radio">` ではなく `<button>` で作成し、onClick で値を更新 |
| チェックボックス風の四角 | `borderRadius: '6px'` で角丸の四角形を作成                              |
| 選択時にチェックマーク   | `isSelected` の場合のみ `<Check>` アイコンを表示                        |
| グラデーション背景       | 選択時に青いグラデーションで目立たせる                                  |

---

## 4.4 トグルスイッチ（On/Off）

### 基本的な考え方

設定項目の ON/OFF を切り替えるために使用します。チェックボックスよりも視覚的にわかりやすい UI です。

### 実装コード

```tsx
const [isEnabled, setIsEnabled] = useState(false);

const ToggleSwitch = ({ label, description, enabled, onToggle }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      background: "#FFFFFF",
    }}
  >
    <div>
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>
        {label}
      </span>
      <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
        {description}
      </p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "52px",
        height: "28px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        background: enabled
          ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
          : "#D1D5DB",
        position: "relative",
        transition: "all 0.3s ease",
        boxShadow: enabled ? "0 2px 8px rgba(59, 130, 246, 0.4)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: enabled ? "26px" : "2px", // 切り替え位置
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      />
    </button>
  </div>
);
```

### 使用例

```tsx
<ToggleSwitch
  label="ダークモード"
  description="画面を暗くして目の負担を軽減"
  enabled={darkMode}
  onToggle={() => setDarkMode(!darkMode)}
/>
```

---

## 4.5 スライダー（レンジ入力）

### 基本的な考え方

数値を範囲内で調整するために使用します。音量、不透明度、価格範囲などに最適です。

### 実装コード

```tsx
const [value, setValue] = useState(50);

const RangeSlider = ({ label, value, min = 0, max = 100, onChange }) => (
  <div style={{ marginBottom: "16px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
      }}
    >
      <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
        {label}
      </label>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#3B82F6",
          background: "#EFF6FF",
          padding: "2px 10px",
          borderRadius: "6px",
        }}
      >
        {value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      style={{
        width: "100%",
        height: "8px",
        borderRadius: "4px",
        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
          (value / max) * 100
        }%, #E5E7EB ${(value / max) * 100}%, #E5E7EB 100%)`,
        appearance: "none",
        outline: "none",
        cursor: "pointer",
      }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "4px",
      }}
    >
      <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{min}</span>
      <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{max}</span>
    </div>
  </div>
);
```

### 使用例

```tsx
<RangeSlider
  label="音量"
  value={volume}
  min={0}
  max={100}
  onChange={setVolume}
/>
```

---

## 4.6 検索入力（サーチボックス）

### 基本的な考え方

検索機能を提供するための入力フィールドです。虫眼鏡アイコンとクリアボタンを含みます。

### 実装コード

```tsx
import { Search, X } from "lucide-react";

const [searchQuery, setSearchQuery] = useState("");

const SearchInput = ({ value, onChange, placeholder = "検索..." }) => (
  <div style={{ position: "relative" }}>
    <Search
      style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "18px",
        height: "18px",
        color: "#9CA3AF",
      }}
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px 40px 12px 44px", // 左右にアイコン分の余白
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#111827",
        background: "#F9FAFB",
        outline: "none",
        transition: "all 0.2s ease",
      }}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "#E5E7EB",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X style={{ width: "12px", height: "12px", color: "#6B7280" }} />
      </button>
    )}
  </div>
);
```

### 使用例

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="ユーザーを検索..."
/>
```

---

## 4.7 日付選択（デートピッカー）

### 基本的な考え方

HTML5 の`type="date"`を使用しつつ、スタイルをカスタマイズします。

### 実装コード

```tsx
import { Calendar } from "lucide-react";

const DatePicker = ({ label, value, onChange, required = false }) => (
  <div style={{ marginBottom: "4px" }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "8px",
      }}
    >
      {label}
      {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    <div style={{ position: "relative" }}>
      <Calendar
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "18px",
          height: "18px",
          color: "#6B7280",
          pointerEvents: "none",
        }}
      />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px 12px 44px",
          border: "1px solid #D1D5DB",
          borderRadius: "12px",
          fontSize: "14px",
          color: "#111827",
          background: "#FFFFFF",
          outline: "none",
          cursor: "pointer",
        }}
      />
    </div>
  </div>
);
```

### 使用例

```tsx
<DatePicker
  label="生年月日"
  value={birthDate}
  onChange={setBirthDate}
  required
/>
```

---

## 4.8 ファイルアップロード

### 基本的な考え方

ドラッグ＆ドロップまたはクリックでファイルを選択できる UI です。

### 実装コード

```tsx
import { Upload, File, X } from "lucide-react";

const [file, setFile] = useState(null);
const [isDragOver, setIsDragOver] = useState(false);

const FileUpload = ({ label, accept = "*", onChange }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "8px",
      }}
    >
      {label}
    </label>
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) onChange(droppedFile);
      }}
      style={{
        border: `2px dashed ${isDragOver ? "#3B82F6" : "#D1D5DB"}`,
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
        background: isDragOver ? "#EFF6FF" : "#F9FAFB",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0])}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <Upload
          style={{
            width: "32px",
            height: "32px",
            color: "#6B7280",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
          <span style={{ color: "#3B82F6", fontWeight: 600 }}>
            クリックしてアップロード
          </span>
          またはドラッグ＆ドロップ
        </p>
        <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
          PNG, JPG, PDF (最大10MB)
        </p>
      </label>
    </div>

    {/* 選択済みファイルの表示 */}
    {file && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "#F3F4F6",
          borderRadius: "10px",
          marginTop: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <File style={{ width: "20px", height: "20px", color: "#6B7280" }} />
          <span style={{ fontSize: "14px", color: "#374151" }}>
            {file.name}
          </span>
        </div>
        <button
          onClick={() => setFile(null)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <X style={{ width: "18px", height: "18px", color: "#6B7280" }} />
        </button>
      </div>
    )}
  </div>
);
```

---

## 4.9 数値入力（ステッパー付き）

### 基本的な考え方

数量を増減するために使用します。＋/－ボタンで直感的に操作できます。

### 実装コード

```tsx
import { Plus, Minus } from "lucide-react";

const NumberStepper = ({ label, value, min = 0, max = 100, onChange }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "8px",
      }}
    >
      {label}
    </label>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          background: value <= min ? "#F3F4F6" : "#FFFFFF",
          cursor: value <= min ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: value <= min ? "#D1D5DB" : "#374151",
        }}
      >
        <Minus style={{ width: "18px", height: "18px" }} />
      </button>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        style={{
          width: "80px",
          textAlign: "center",
          padding: "12px",
          border: "1px solid #D1D5DB",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: 600,
          color: "#111827",
        }}
      />

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          border: "none",
          background:
            value >= max
              ? "#F3F4F6"
              : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
          cursor: value >= max ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: value >= max ? "#D1D5DB" : "#FFFFFF",
          boxShadow:
            value >= max ? "none" : "0 2px 8px rgba(59, 130, 246, 0.3)",
        }}
      >
        <Plus style={{ width: "18px", height: "18px" }} />
      </button>
    </div>
  </div>
);
```

### 使用例

```tsx
<NumberStepper
  label="数量"
  value={quantity}
  min={1}
  max={99}
  onChange={setQuantity}
/>
```

---

## 4.10 テキストエリア（複数行入力）

### 基本的な考え方

長文入力に使用します。文字数カウンターを付けることが多いです。

### 実装コード

```tsx
const TextareaField = ({
  label,
  value,
  onChange,
  maxLength = 500,
  rows = 4,
  required = false,
}) => (
  <div style={{ marginBottom: "16px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <label
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#374151",
          display: "flex",
          gap: "4px",
        }}
      >
        {label}
        {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <span
        style={{
          fontSize: "12px",
          color: value.length > maxLength * 0.9 ? "#EF4444" : "#9CA3AF",
        }}
      >
        {value.length}/{maxLength}
      </span>
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      rows={rows}
      style={{
        width: "100%",
        padding: "14px 16px",
        border: "1px solid #D1D5DB",
        borderRadius: "14px",
        fontSize: "14px",
        color: "#111827",
        background: "#FFFFFF",
        resize: "none",
        outline: "none",
        lineHeight: 1.6,
        transition: "all 0.2s ease",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#3B82F6";
        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#D1D5DB";
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
);
```

### 使用例

```tsx
<TextareaField
  label="コメント"
  value={comment}
  onChange={setComment}
  maxLength={1000}
  rows={5}
/>
```

---

## 5. アイコンとカラーテーマ

### 基本的な考え方

各セクションに固有のカラーを割り当てることで、視覚的な区別がしやすくなります。

### カラーパレット定義

```tsx
const SECTIONS = [
  {
    id: "basic",
    label: "基本情報",
    color: "#3B82F6", // メインカラー（アイコン・テキスト）
    bgColor: "#DBEAFE", // 背景カラー（淡い色）
  },
  { id: "company", label: "会社詳細", color: "#8B5CF6", bgColor: "#EDE9FE" },
  {
    id: "billing",
    label: "請求・支払い",
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
  {
    id: "security",
    label: "セキュリティ",
    color: "#EF4444",
    bgColor: "#FEE2E2",
  },
  {
    id: "integrations",
    label: "外部連携",
    color: "#06B6D4",
    bgColor: "#CFFAFE",
  },
  {
    id: "notifications",
    label: "通知設定",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
];
```

### アイコン背景の実装

```tsx
<div
  style={{
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: `linear-gradient(135deg, ${section.bgColor} 0%, ${section.color}20 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 4px 12px ${section.color}30`, // カラーシャドウ
  }}
>
  <section.icon
    style={{ width: "24px", height: "24px", color: section.color }}
  />
</div>
```

### 色の透明度表記

```
#3B82F6    = 100%（不透明）
#3B82F620  = 約12%（ほぼ透明、薄い色味）
#3B82F630  = 約19%（シャドウに使う程度）
#3B82F650  = 約31%（わかりやすい色味）
```

---

## 6. ステータスバッジ

### 完了バッジ

```tsx
<span
  style={{
    padding: "6px 14px",
    background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)", // 緑のグラデーション
    color: "#059669",
    fontSize: "12px",
    fontWeight: 600,
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }}
>
  <Check style={{ width: "14px", height: "14px" }} /> 入力完了
</span>
```

### 警告バッジ

```tsx
<div
  style={{
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", // 黄色のグラデーション
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <AlertCircle style={{ width: "14px", height: "14px", color: "#D97706" }} />
</div>
```

---

## 7. Sticky 要素（固定表示）

### 基本的な考え方

`position: sticky` は親要素内でスクロールについてくる。`position: fixed` はビューポート（画面）に対して固定される。

### ヘッダー（上部固定）

```tsx
<header style={{
  position: 'sticky',
  top: 0,           // 上端に固定
  zIndex: 50,       // 他の要素より手前
  // ... 他のスタイル
}}>
```

### サイドバー（スクロール追従）

```tsx
<nav style={{
  width: '280px',
  flexShrink: 0,       // 縮まないようにする
  position: 'sticky',
  top: '100px',        // ヘッダーの高さ分だけ下げる
}}>
```

### フッター/アクションバー（下部固定）

```tsx
<div style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  // ... 他のスタイル
}}>
```

### 注意点

```tsx
// fixed要素がある場合、メインコンテンツに余白を追加
<div style={{ paddingBottom: "120px" }}>{/* メインコンテンツ */}</div>
```

---

## 8. 完了判定ロジック

### 基本的な考え方

各セクションに「必須フィールド」を定義し、それらがすべて入力されているかをチェックします。

### セクション定義

```tsx
const SECTIONS = [
  {
    id: "basic",
    label: "基本情報",
    requiredFields: ["lastName", "firstName", "email"], // 必須項目
  },
  {
    id: "company",
    label: "会社詳細",
    requiredFields: ["companyName", "department"],
  },
  {
    id: "security",
    label: "セキュリティ",
    requiredFields: [], // 必須なし = 常に完了
  },
];
```

### 完了判定関数

```tsx
const isSectionComplete = (sectionId: string): boolean => {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return false;

  // 必須フィールドがない場合は常に完了
  if (section.requiredFields.length === 0) return true;

  // すべての必須フィールドが入力されているか確認
  return section.requiredFields.every((field) => {
    const value = formData[field as keyof FormData];
    return typeof value === "string" ? value.trim() !== "" : true;
  });
};
```

### 全体の完了率

```tsx
const completionRate =
  (SECTIONS.filter((s) => isSectionComplete(s.id)).length / SECTIONS.length) *
  100;
// 例: 5/6 = 83.33...%
```

---

## まとめ：UI を作る順序

1. **骨組みを作る**：ページ構造（ヘッダー、サイドバー、メイン、フッター）
2. **Sticky/Fixed を設定**：固定表示の要素を先に配置
3. **背景とカードを設定**：グラデーション背景とカードスタイル
4. **フォーム要素を配置**：入力フィールド、セレクト、チェックボックス
5. **色とアイコンを統一**：セクションごとのカラーテーマ
6. **完了判定を追加**：バッジとプログレス表示
7. **ガラスモーフィズムで仕上げ**：ヘッダー・フッターの透過効果

---

## 参考：使用している色コード

| 用途             | 色コード              | 説明             |
| ---------------- | --------------------- | ---------------- |
| テキスト（濃）   | `#111827`             | ほぼ黒           |
| テキスト（中）   | `#374151`             | ダークグレー     |
| テキスト（薄）   | `#6B7280`             | ミディアムグレー |
| テキスト（補助） | `#9CA3AF`             | ライトグレー     |
| 境界線           | `#E5E7EB`             | 薄いグレー       |
| 入力境界線       | `#D1D5DB`             | やや濃いグレー   |
| 青（メイン）     | `#3B82F6`             | ブランドカラー   |
| 緑（成功）       | `#10B981` / `#059669` | 完了・成功       |
| 黄（警告）       | `#F59E0B` / `#D97706` | 注意・未完了     |
| 赤（エラー）     | `#EF4444` / `#DC2626` | エラー・削除     |

---

このガイドを参考に、自分だけのプレミアム UI を作成してみてください！
