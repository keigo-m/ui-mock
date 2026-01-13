# システム UI 実装研修: 高機能データテーブルの作成

このドキュメントでは、Web アプリケーションにおける「テーブル UI」の実装について、初歩的な HTML からプロフェッショナルなシステム UI（ソート・フィルタ・固定ヘッダー付き）に至るまでの進化を解説します。

各ステップのコード (`src/app/stepX/page.tsx`) と合わせて読み進めてください。

---

## 全体技術スタック

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Logic**: TanStack Table (旧 React Table)

---

## Step 1: 基本的な HTML テーブル (Anti-Pattern)

**パス**: `/step1`

- `<table>` タグ直書き。
- 冗長で機能強化が困難。

---

## Step 2: React コンポーネント化

**パス**: `/step2`

- `TableHeader`, `TableRow` への分割。
- 可読性は上がるが、ロジックは自前実装のまま。

---

## Step 3: Headless UI (TanStack Table) の導入

**パス**: `/step3`

- **View と Logic の分離**。
- `useReactTable` フックがデータ処理を管理。

---

## Step 4: インタラクティブ機能

**パス**: `/step4`

- `useState` と連動し、ソート・フィルタ・ページネーションを実現。

---

## Step 5: Advanced UI (基本完成形)

**パス**: `/step5`

- `sticky` position を駆使したヘッダー固定・列固定。
- プロフェッショナルな見た目を実現。

---

## Step 6: 列ごとのフィルター

**パス**: `/step6`

- ヘッダー内に `input` を配置。
- `e.stopPropagation()` によるソートクリックの暴発防止。

---

## Step 7: CSV エクスポート

**パス**: `/step7`

### 技術要素

- **Blob**: クライアントサイドでのファイル生成。
- **Filtered Rows**: `table.getFilteredRowModel().rows`

### 解説

サーバーへのリクエストを発生させず、**現在ブラウザで見えている（フィルタ済みの）データ**を即座にダウンロードする機能を実装しました。
アンカータグ (`<a>`) を動的に生成して `click()` する手法は、React におけるファイルダウンロードの定石です。

---

## Step 8: 行アクション（編集・削除）

**パス**: `/step8`

### 技術要素

- **Mutable State**: `useState`
- **Display Column**: データに紐づかないアクション専用列。

### 解説

これまでのステップではデータは定数（Read-only）でしたが、削除機能を実現するために **State (状態)** として管理するように変更しました。
`setData(prev => prev.filter(...))` のように状態を更新することで、削除ボタンを押した瞬間に UI が反応します。
アクション列は `columnHelper.display()` を使って定義しており、特定のデータフィールドには依存していません。

---

### まとめ

以下の要素を組み合わせることで、現代的で高機能なデータグリッドが完成しました。

1.  **コンポーネント設計**
2.  **堅牢なロジック (TanStack Table)**
3.  **高度な CSS レイアウト**
4.  **詳細なインタラクション (CSV, Actions)**

このプロジェクトを参考に、実際の業務アプリケーション開発に活かしてください。
