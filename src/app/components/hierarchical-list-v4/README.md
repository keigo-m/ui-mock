# 階層リスト選択コンポーネント V4 技術解説

## 📌 概要

このドキュメントは、プログラミング初心者でも理解できるように、階層リスト選択コンポーネントV4の技術と設計思想を解説します。

---

## 🛠️ 使用技術一覧

| 技術             | バージョン | 用途                                     |
| ---------------- | ---------- | ---------------------------------------- |
| **React**        | 18.x       | UIライブラリ（コンポーネントベース開発） |
| **Next.js**      | 14.x+      | Reactフレームワーク（App Router使用）    |
| **TypeScript**   | 5.x        | 型安全なJavaScript                       |
| **lucide-react** | 最新       | SVGアイコンライブラリ                    |

---

## 📁 ファイル構成

```
プロジェクト/
├── public/
│   └── data/
│       └── hierarchy-data.txt   # 階層データ（テキストファイル）
├── src/
│   └── app/
│       └── components/
│           └── hierarchical-list-v4/
│               ├── page.tsx     # このコンポーネント
│               └── README.md    # 技術解説ドキュメント（このファイル）
└── package.json                 # パッケージ依存関係
```

---

## 🔑 React Hooks 解説

### 1️⃣ useState（状態管理）

コンポーネント内で変化する値を管理します。

```typescript
// 選択されたノードのID配列（順序付き）
const [selectedIds, setSelectedIds] = useState<string[]>([]);

// 展開中のノードのID（高速検索のためSetを使用）
const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
```

**ポイント**：

- 配列 `[]` は順序が重要な場合に使用
- `Set` は存在確認が高速（O(1)）な場合に使用

---

### 2️⃣ useCallback（関数のメモ化）

関数を再生成しないようにメモ化します。

```typescript
const handleToggleSelect = useCallback((id: string) => {
  setSelectedIds((prev) => {
    const index = prev.indexOf(id);
    if (index >= 0) {
      return prev.filter((item) => item !== id); // 選択解除
    } else {
      return [...prev, id]; // 新規選択
    }
  });
}, []); // 依存配列が空 = 関数は一度だけ作成
```

**なぜ必要？**

- 子コンポーネントに渡す関数を安定させる
- 不要な再レンダリングを防止

---

### 3️⃣ useMemo（計算結果のメモ化）

重い計算を再実行させないようにメモ化します。

```typescript
// rawDataが変わった時だけ再計算
const treeData = useMemo(() => parseHierarchyData(rawData), [rawData]);

// treeDataが変わった時だけ再計算
const topLevelIds = useMemo(() => treeData.map((node) => node.id), [treeData]);
```

**なぜ必要？**

- `parseHierarchyData` は重い処理
- 毎回計算すると画面がカクつく

---

### 4️⃣ useEffect（副作用）

コンポーネントが表示された時にデータを読み込みます。

```typescript
useEffect(() => {
  loadData(); // データ読み込み実行
}, [loadData]); // loadDataが変わった時に再実行
```

**用途例**：

- APIからデータ取得
- イベントリスナー登録

---

### 5️⃣ useRef（DOM参照）

DOM要素を直接操作するための参照です。

```typescript
const searchInputRef = useRef<HTMLInputElement>(null);

// 使用例：フォーカスを当てる
searchInputRef.current?.focus();
```

---

## 🏗️ コンポーネント構造

```
HierarchicalListV4Page（エクスポート）
  └── Suspense（読み込み中のフォールバック）
        └── HierarchicalListV4Content（メイン）
              ├── ヘッダー（タイトル、コントロール）
              ├── 選択結果アコーディオン
              ├── ツリービュー
              │     └── TreeNodeItem（再帰コンポーネント）
              │           └── TreeNodeItem（子ノード）
              │                 └── ...
              └── フッター（確定/キャンセル）
```

---

## 🔄 データフロー

```
1. テキストファイル読み込み
   fetch('/data/hierarchy-data.txt')
        ↓
2. 生テキストを状態に保存
   setRawData(text)
        ↓
3. パース処理（useMemoで最適化）
   parseHierarchyData(rawData) → treeData
        ↓
4. TreeNodeItemで表示
   treeData.map(node => <TreeNodeItem ... />)
```

---

## 🎨 スタイリング

このコンポーネントは**インラインスタイル**を使用しています。

```typescript
style={{
  padding: '3px 8px',
  background: isSelected
    ? 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
    : 'transparent',
  // ...
}}
```

**メリット**：

- 外部CSSファイル不要
- 動的なスタイル変更が簡単
- コンポーネント単体で完結

**デメリット**：

- コードが長くなる
- 再利用性が低い

---

## 🔗 別のページからの呼び出し方法

### 基本的な流れ

```
呼び出し元ページ ─────→ V4選択画面 ─────→ 呼び出し元ページ
              （returnUrl指定）    （selected付き）
```

### Step 1: V4ページへ遷移する（新規選択）

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();

const handleOpenSelector = () => {
  // 戻り先URLを指定してV4ページへ遷移
  const returnUrl = "/your-page"; // ← 自分のページのパス
  router.push(
    `/components/hierarchical-list-v4?returnUrl=${encodeURIComponent(returnUrl)}`,
  );
};
```

### Step 1.5: 編集モード（初期選択を渡す場合）

既存の選択状態を維持したまま編集画面を開く場合は、`initialSelected`パラメータを使用します。

```typescript
const handleEditSelector = () => {
  const returnUrl = "/your-page";
  const currentSelection = ["A11", "A11/B11"]; // 現在の選択状態

  // initialSelectedパラメータで既存の選択を渡す
  const initialSelected = encodeURIComponent(JSON.stringify(currentSelection));
  router.push(
    `/components/hierarchical-list-v4?returnUrl=${encodeURIComponent(returnUrl)}&initialSelected=${initialSelected}`,
  );
};
```

**パラメータ一覧**:

| パラメータ        | 必須 | 説明                     |
| ----------------- | ---- | ------------------------ |
| `returnUrl`       | ○    | 確定後の戻り先URL        |
| `initialSelected` | ×    | 初期選択状態（JSON配列） |

### Step 2: 選択結果を取得する

```typescript
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const searchParams = useSearchParams();
const [selectedItems, setSelectedItems] = useState<string[]>([]);

useEffect(() => {
  const selectedParam = searchParams.get("selected");
  if (selectedParam) {
    try {
      const parsed = JSON.parse(selectedParam);
      if (Array.isArray(parsed)) {
        setSelectedItems(parsed);
      }
    } catch (e) {
      console.error("パースエラー:", e);
    }
  }
}, [searchParams]);
```

### 選択結果のフォーマット

V4から返される `selected` パラメータは、**JSON配列の文字列**です。

```
?selected=["A11","A11/B11","A11/B11/C11"]
```

パース後の形式:

```typescript
["A11", "A11/B11", "A11/B11/C11"];
```

### サンプルページ

実際の使用例は以下のページを参照してください：

```
/components/hierarchical-list-v4-sample
```

ファイル: `src/app/components/hierarchical-list-v4-sample/page.tsx`

### 完全なコード例

```typescript
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // 選択結果を取得
  useEffect(() => {
    const param = searchParams.get('selected');
    if (param) {
      setSelectedItems(JSON.parse(param));
    }
  }, [searchParams]);

  // V4ページを開く
  const openSelector = () => {
    router.push('/components/hierarchical-list-v4?returnUrl=/my-page');
  };

  return (
    <div>
      <button onClick={openSelector}>選択画面を開く</button>
      <ul>
        {selectedItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

// Suspenseでラップ必須（useSearchParamsを使用するため）
export default function MyPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
```

---

## 📦 他のプロジェクトで使う場合

### 必要なパッケージ

```json
// package.json に追加
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### インストールコマンド

```bash
npm install next react react-dom lucide-react
npm install -D typescript @types/react @types/node
```

### 必要なファイル

| ファイル             | 説明               | 必須 |
| -------------------- | ------------------ | ---- |
| `page.tsx`           | コンポーネント本体 | ✅   |
| `hierarchy-data.txt` | データファイル     | ✅   |

### 設置手順

1. **コンポーネントをコピー**

   ```
   src/app/components/hierarchical-list-v4/page.tsx
   ```

2. **データファイルを配置**

   ```
   public/data/hierarchy-data.txt
   ```

3. **データファイルのパスを変更（必要に応じて）**
   ```typescript
   // page.tsx 内
   const dataSource = "/data/hierarchy-data.txt";
   ```

---

## ⚙️ カスタマイズポイント

### 1. データファイルのパスを変更

```typescript
const dataSource = "/data/your-data-file.txt";
```

### 2. 色パレットを変更

第一階層ごとの背景色：

```typescript
const colorPalette = [
  { bg: "rgba(254, 202, 202, 0.3)", border: "#FCA5A5" }, // 赤
  { bg: "rgba(134, 239, 172, 0.2)", border: "#86EFAC" }, // 緑
  // ... 追加・変更
];
```

ボタンの色：

```typescript
const buttonColorPalette = [
  { bgActive: "linear-gradient(...)", border: "...", text: "..." },
  // ... 追加・変更
];
```

### 3. 行の高さを変更

```typescript
style={{
  padding: '3px 8px',  // ← ここを変更（例: '6px 10px'）
  margin: '1px 0',     // ← ここを変更
}}
```

### 4. インデント幅を変更

```typescript
paddingLeft: `${8 + level * 18}px`,  // 18 を変更
```

---

## ❓ よくある質問

### Q: 第一階層が9個以上になるとどうなる？

A: デフォルトのグレー色になります。色を増やすには `colorPalette` と `buttonColorPalette` に追加してください。

### Q: 選択順序は保持される？

A: はい。`selectedIds` は配列なので、選択した順序を保持します。

### Q: 検索で子孫がマッチした場合、親は表示される？

A: はい。`matchesSearch` 関数が再帰的に検索し、子孫にマッチがあれば親も表示されます。

### Q: TypeScriptなしで使える？

A: 型注釈を削除すれば可能ですが、推奨しません。

---

## 📚 参考リンク

- [React公式ドキュメント](https://react.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [lucide-react アイコン一覧](https://lucide.dev/icons/)

---

## 🔧 トラブルシューティング

### データが読み込まれない

1. ファイルパスを確認（`/data/hierarchy-data.txt`）
2. ファイルが `public/` フォルダ内にあるか確認
3. サーバーを再起動（`npm run build && npm run start`）

### アイコンが表示されない

1. `lucide-react` がインストールされているか確認
2. インポート文を確認

### 型エラーが出る

1. TypeScriptがインストールされているか確認
2. `@types/react` がインストールされているか確認
