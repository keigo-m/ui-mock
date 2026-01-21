# キーボードショートカット＆スクロールスパイ実装ガイド

Reactでキーボードショートカット、スクロールスパイ、サイドバーナビゲーションを実装する方法を解説します。

---

## 目次

1. [完成イメージ](#1-完成イメージ)
2. [必要な技術](#2-必要な技術)
3. [実装ステップ](#3-実装ステップ)
4. [コード解説](#4-コード解説)
5. [応用パターン](#5-応用パターン)

---

## 1. 完成イメージ

| 操作方法           | 動作                                            |
| ------------------ | ----------------------------------------------- |
| `Ctrl+1〜3`        | セクションへジャンプ + 最初の入力欄にフォーカス |
| サイドバークリック | セクションへジャンプ + 最初の入力欄にフォーカス |
| スクロール         | 現在位置に応じてアクティブセクションが自動更新  |

**デモページ:** `/components/keyboard-shortcuts-demo`

---

## 2. 必要な技術

| 技術                                | 用途                            |
| ----------------------------------- | ------------------------------- |
| `useRef`                            | セクションDOM要素への参照を保持 |
| `useState`                          | アクティブセクションの状態管理  |
| `useEffect`                         | イベントリスナーの登録・解除    |
| `window.scrollTo`                   | スムーズスクロール              |
| `window.addEventListener('scroll')` | スクロール位置の監視            |
| `element.focus()`                   | 要素へのフォーカス移動          |

---

## 3. 実装ステップ

### ステップ 1: 基本構造

```typescript
const SECTIONS = [
  { id: "section1", label: "セクション 1" },
  { id: "section2", label: "セクション 2" },
  { id: "section3", label: "セクション 3" },
];

const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
const [activeSection, setActiveSection] = useState<string>("section1");
```

### ステップ 2: スクロール＆フォーカス関数

```typescript
const scrollToSection = (sectionId: string, focusFirst: boolean = false) => {
  const element = sectionRefs.current[sectionId];
  if (!element) return;

  // スムーズスクロール
  window.scrollTo({
    top: element.offsetTop - 100,
    behavior: "smooth",
  });

  setActiveSection(sectionId);

  // フォーカス処理
  if (focusFirst) {
    setTimeout(() => {
      const selector = "input, textarea, select, button:not([disabled])";
      const firstFocusable = element.querySelector<HTMLElement>(selector);
      firstFocusable?.focus();
    }, 300);
  }
};
```

### ステップ 3: キーボードショートカット

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= SECTIONS.length) {
        e.preventDefault();
        scrollToSection(SECTIONS[keyNum - 1].id, true);
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

### ステップ 4: スクロールスパイ（位置監視）

```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 200; // オフセット

    for (const section of SECTIONS) {
      const element = sectionRefs.current[section.id];
      if (element) {
        const { offsetTop, offsetHeight } = element;

        // スクロール位置がセクション内にあるかチェック
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          if (activeSection !== section.id) {
            setActiveSection(section.id);
          }
          break;
        }
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [activeSection]);
```

### ステップ 5: サイドバークリック

```tsx
<button
  onClick={() => scrollToSection(section.id, true)}
  style={{
    background: activeSection === section.id ? section.color : "transparent",
    // ...他のスタイル
  }}
>
  {index + 1}
</button>
```

---

## 4. コード解説

### スクロールスパイの仕組み

```
┌────────────────────────────────────────┐
│  ← scrollPosition (window.scrollY + offset)
├────────────────────────────────────────┤
│  セクション1  │ offsetTop      │        │
│              │ offsetHeight    │        │
├──────────────┴────────────────┴────────┤
│  セクション2  ← この範囲内なら active   │
├────────────────────────────────────────┤
│  セクション3                            │
└────────────────────────────────────────┘
```

**判定ロジック:**

```typescript
if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
  // このセクションがアクティブ
}
```

### 3つの操作が連動する理由

```
┌─────────────────┐
│ activeSection   │ ← 共有された状態
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    ↓         ↓            ↓
 キーボード  クリック    スクロール
    │         │            │
    └────┬────┴────────────┘
         ↓
  setActiveSection(id)
         ↓
  サイドバーのハイライトが更新
```

---

## 5. 応用パターン

### パターン A: スクロールスパイ + ハイライトアニメーション

```css
.sidebar-button {
  transition: all 0.2s ease;
}
.sidebar-button.active {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### パターン B: 固定ヘッダーとの併用

```typescript
const HEADER_HEIGHT = 80;

window.scrollTo({
  top: element.offsetTop - HEADER_HEIGHT,
  behavior: "smooth",
});
```

### パターン C: Intersection Observer を使う方法

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    { threshold: 0.5 },
  );

  SECTIONS.forEach((section) => {
    const el = sectionRefs.current[section.id];
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);
```

**Intersection Observer のメリット:**

- スクロールイベントより高パフォーマンス
- ブラウザが最適化してくれる

---

## まとめ

| 機能                         | 実装方法                                           |
| ---------------------------- | -------------------------------------------------- |
| **キーボードショートカット** | `useEffect` + `window.addEventListener('keydown')` |
| **サイドバークリック**       | `onClick` → `scrollToSection(id, true)`            |
| **スクロールスパイ**         | `useEffect` + `window.addEventListener('scroll')`  |
| **状態連動**                 | `activeSection` を3つの操作で共有                  |

**デモで動作確認:** `/components/keyboard-shortcuts-demo`
