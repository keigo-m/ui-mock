"use client";
// ============================================================================
// 階層的リスト選択コンポーネント V4 (Hierarchical List Selector V4)
// ============================================================================
// 
// 【概要】
// 「/」区切りのテキストデータから階層構造（ツリー）を構築し、
// チェックボックスで複数選択できるUIを提供するReactコンポーネントです。
// 
// 【主な機能】
// - テキストファイルからデータを読み込み（fetch API使用）
// - 階層構造の表示（展開/折りたたみ可能）
// - 複数選択（選択順序を保持）
// - 検索フィルター
// - 第一階層ごとの背景色ハイライト
// 
// 【使用技術】
// - React（関数コンポーネント、Hooks）
// - Next.js（App Router、Client Component）
// - TypeScript（型安全性）
// - lucide-react（アイコン）
// 
// 【ファイル構成】
// - page.tsx（このファイル）: コンポーネント本体
// - public/data/hierarchy-data.txt: データファイル
// ============================================================================

// ----------------------------------------------------------------------------
// インポート
// ----------------------------------------------------------------------------
// React: UIライブラリ
// - useState: 状態管理（選択状態、展開状態など）
// - useCallback: 関数をメモ化（パフォーマンス最適化）
// - useMemo: 計算結果をメモ化（再計算の抑制）
// - useRef: DOM要素への参照
// - useEffect: 副作用（データ読み込みなど）
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Next.js: ルーティング
// - useRouter: プログラムによるページ遷移
// - useSearchParams: URLクエリパラメータの取得
import { useRouter, useSearchParams } from 'next/navigation';

// lucide-react: アイコンライブラリ（SVGベース）
// 使用するアイコンを個別にインポート
import { 
  ArrowLeft,     // 戻るボタン
  ChevronRight,  // 折りたたみ（右向き矢印）
  ChevronDown,   // 展開（下向き矢印）
  Check,         // チェックマーク
  Search,        // 検索アイコン
  X,             // 閉じる/削除
  CheckSquare,   // 全選択
  Square,        // 全解除
  FolderOpen,    // 展開
  FolderClosed,  // 折りたたみ
  ChevronUp,     // アコーディオン閉じる
  RefreshCw      // 読み込み中スピナー
} from "lucide-react";

// ----------------------------------------------------------------------------
// 型定義（TypeScript）
// ----------------------------------------------------------------------------
// TreeNode: ツリー構造の1ノードを表す型
// 再帰的な構造（childrenが同じ型の配列）
type TreeNode = {
  id: string;       // 一意の識別子（パス全体）
  name: string;     // 表示名（最後のセグメント）
  path: string;     // フルパス
  children: TreeNode[];  // 子ノードの配列（再帰構造）
};

// ----------------------------------------------------------------------------
// ユーティリティ関数
// ----------------------------------------------------------------------------

/**
 * テキストデータを階層構造（ツリー）に変換する関数
 * 
 * 【アルゴリズム】
 * 1. テキストを行ごとに分割
 * 2. 各行を「/」で分割してパスの階層を取得
 * 3. 階層ごとにノードを作成し、親子関係を構築
 * 
 * 【Map の役割】
 * - 既存ノードの重複作成を防止
 * - パスをキーにして高速にノードを検索
 * 
 * @param text - 「/」区切りの階層データ（複数行）
 * @returns TreeNode[] - ルートノードの配列
 * 
 * 【入力例】
 * A11
 * A11/B11
 * A11/B11/C11
 * 
 * 【出力例】
 * [{
 *   id: "A11",
 *   name: "A11",
 *   children: [{
 *     id: "A11/B11",
 *     name: "B11",
 *     children: [{
 *       id: "A11/B11/C11",
 *       name: "C11",
 *       children: []
 *     }]
 *   }]
 * }]
 */
function parseHierarchyData(text: string): TreeNode[] {
  // 空行を除去して行の配列に変換
  const lines = text.trim().split('\n').filter(line => line.trim());
  
  // ルートノード（第一階層）を格納する配列
  const root: TreeNode[] = [];
  
  // パス → ノード のマッピング（重複防止用）
  const nodeMap = new Map<string, TreeNode>();

  // 各行を処理
  lines.forEach(line => {
    // 末尾の「/」を除去してパスを正規化
    const cleanPath = line.trim().replace(/\/+$/, '');
    if (!cleanPath) return;

    // パスを「/」で分割して階層を取得
    const parts = cleanPath.split('/');
    let currentPath = '';

    // 階層ごとにノードを作成
    parts.forEach((part, index) => {
      const parentPath = currentPath;
      // 現在のフルパスを構築
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // まだノードが作成されていない場合のみ作成
      if (!nodeMap.has(currentPath)) {
        const node: TreeNode = {
          id: currentPath,
          name: part,
          path: currentPath,
          children: [],
        };
        nodeMap.set(currentPath, node);

        // 第一階層（index === 0）はルートに追加
        if (index === 0) {
          root.push(node);
        } else {
          // 親ノードを探して子として追加
          const parent = nodeMap.get(parentPath);
          if (parent) {
            parent.children.push(node);
          }
        }
      }
    });
  });

  return root;
}

/**
 * ツリー構造から全ノードのIDを取得する関数（再帰）
 * 
 * 【用途】
 * - 全選択機能
 * - 初期状態で全展開
 * - ノード数のカウント
 * 
 * @param nodes - TreeNode配列
 * @returns string[] - 全ノードのIDの配列
 */
function getAllNodeIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  nodes.forEach(node => {
    ids.push(node.id);
    // 子ノードを再帰的に処理
    ids.push(...getAllNodeIds(node.children));
  });
  return ids;
}

/**
 * 検索語に一致するかどうかを判定する関数（再帰）
 * 
 * 【動作】
 * - ノード名が検索語を含むか確認
 * - 子孫ノードが検索語を含む場合も true を返す
 *   （親ノードを表示して子ノードにアクセスできるようにするため）
 * 
 * @param node - 検索対象のノード
 * @param searchTerm - 検索語
 * @returns boolean - 一致する場合true
 */
function matchesSearch(node: TreeNode, searchTerm: string): boolean {
  if (!searchTerm) return true;  // 検索語が空なら全て表示
  
  const term = searchTerm.toLowerCase();
  
  // ノード名に検索語が含まれるか
  if (node.name.toLowerCase().includes(term)) return true;
  
  // 子孫ノードに検索語を含むものがあるか（再帰）
  return node.children.some(child => matchesSearch(child, searchTerm));
}

// ----------------------------------------------------------------------------
// TreeNodeItem コンポーネント
// ----------------------------------------------------------------------------
// ツリーの各ノード（行）を描画する再帰コンポーネント
// 子ノードがある場合、自分自身を再帰的に呼び出す

/**
 * TreeNodeItem - 各ノードを表示するコンポーネント
 * 
 * 【Props の説明】
 * - node: 表示するノードのデータ
 * - selectedIds: 選択中のノードID配列（順序付き）
 * - expandedIds: 展開中のノードIDのSet
 * - selectedTopLevelIds: ハイライト表示する第一階層のSet
 * - onToggleSelect: 選択切り替えコールバック
 * - onToggleExpand: 展開切り替えコールバック
 * - level: 階層の深さ（インデント計算用）
 * - searchTerm: 検索語（ハイライト表示用）
 * - hoveredId: ホバー中のノードID
 * - onHover: ホバー状態変更コールバック
 * - topLevelIds: 第一階層のID配列（色計算用）
 */
function TreeNodeItem({
  node,
  selectedIds,
  expandedIds,
  selectedTopLevelIds,
  onToggleSelect,
  onToggleExpand,
  level = 0,
  searchTerm,
  hoveredId,
  onHover,
  topLevelIds,
}: {
  node: TreeNode;
  selectedIds: string[];
  expandedIds: Set<string>;
  selectedTopLevelIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  level?: number;
  searchTerm: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  topLevelIds: string[];
}) {
  // ノードの状態を計算
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedIds.includes(node.id);
  const selectionOrder = selectedIds.indexOf(node.id);  // 選択順序（0始まり）
  const isHovered = hoveredId === node.id;
  
  // 第一階層のIDを取得（パスの最初のセグメント）
  const topLevelId = node.id.split('/')[0];
  const isInSelectedTopLevel = selectedTopLevelIds.has(topLevelId);

  // ------------------------------------------------------------------------
  // 動的カラーパレット
  // ------------------------------------------------------------------------
  // 第一階層ごとに異なる背景色を割り当て
  // インデックスベースで色を決定（名前に依存しない）
  const colorPalette = [
    { bg: 'rgba(254, 202, 202, 0.3)', border: '#FCA5A5' },   // 赤
    { bg: 'rgba(134, 239, 172, 0.2)', border: '#86EFAC' },   // 緑
    { bg: 'rgba(147, 197, 253, 0.3)', border: '#93C5FD' },   // 青
    { bg: 'rgba(253, 224, 71, 0.2)', border: '#FCD34D' },    // 黄
    { bg: 'rgba(196, 181, 253, 0.2)', border: '#C4B5FD' },   // 紫
    { bg: 'rgba(251, 191, 36, 0.2)', border: '#FBBF24' },    // オレンジ
    { bg: 'rgba(244, 114, 182, 0.2)', border: '#F472B6' },   // ピンク
    { bg: 'rgba(45, 212, 191, 0.2)', border: '#2DD4BF' },    // ティール
  ];
  const defaultColor = { bg: 'rgba(203, 213, 225, 0.2)', border: '#CBD5E1' };
  
  // 第一階層のインデックスから色を決定
  const topLevelIndex = topLevelIds.indexOf(topLevelId);
  const topLevelColor = topLevelIndex >= 0 && topLevelIndex < colorPalette.length 
    ? colorPalette[topLevelIndex] 
    : defaultColor;

  // 検索フィルタ: マッチしない場合は非表示
  if (searchTerm && !matchesSearch(node, searchTerm)) {
    return null;
  }

  /**
   * 検索語をハイライト表示する関数
   * マッチした部分を黄色背景で強調
   */
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <span style={{ background: '#FEF08A', borderRadius: '2px', padding: '0 2px' }}>
          {text.slice(index, index + searchTerm.length)}
        </span>
        {text.slice(index + searchTerm.length)}
      </>
    );
  };

  /**
   * 背景色の決定ロジック
   * 優先順位: 選択 > ハイライト > ホバー > 透明
   */
  const getBackgroundStyle = () => {
    if (isSelected) {
      return 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)';
    }
    if (isInSelectedTopLevel) {
      return topLevelColor.bg;
    }
    if (isHovered) {
      return '#F3F4F6';
    }
    return 'transparent';
  };

  // ------------------------------------------------------------------------
  // レンダリング
  // ------------------------------------------------------------------------
  return (
    <div>
      {/* ノード行 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '3px 8px',
          // 階層に応じたインデント（level * 18px）
          paddingLeft: `${8 + level * 18}px`,
          borderRadius: '4px',
          margin: '1px 0',
          background: getBackgroundStyle(),
          transition: 'all 0.12s ease',  // スムーズなアニメーション
          cursor: 'pointer',
          border: isSelected 
            ? '1px solid #93C5FD' 
            : isInSelectedTopLevel 
              ? `1px solid ${topLevelColor.border}` 
              : '1px solid transparent',
        }}
        onClick={() => onToggleSelect(node.id)}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
      >
        {/* 展開/折りたたみボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();  // 親のonClickを発火させない
            onToggleExpand(node.id);
          }}
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: hasChildren && isHovered ? '#E5E7EB' : 'transparent',
            cursor: hasChildren ? 'pointer' : 'default',
            color: hasChildren ? '#374151' : 'transparent',
            borderRadius: '4px',
            marginRight: '4px',
            transition: 'all 0.12s ease',
          }}
        >
          {hasChildren && (
            isExpanded 
              ? <ChevronDown size={18} strokeWidth={2.5} /> 
              : <ChevronRight size={18} strokeWidth={2.5} />
          )}
        </button>

        {/* チェックボックス風UI */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '3px',
            border: isSelected ? 'none' : '2px solid #CBD5E1',
            background: isSelected 
              ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' 
              : isHovered ? '#F1F5F9' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            transition: 'all 0.12s ease',
            boxShadow: isSelected ? '0 2px 4px rgba(59, 130, 246, 0.4)' : 'none',
            flexShrink: 0,
          }}
        >
          {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
        </div>

        {/* ノード名（検索語ハイライト付き） */}
        <span style={{ 
          fontSize: '13px', 
          fontWeight: isSelected ? 600 : 400, 
          color: isSelected ? '#1E40AF' : '#1F2937',
          flex: 1,
        }}>
          {highlightText(node.name)}
        </span>

        {/* 選択順序バッジ（選択時のみ表示） */}
        {isSelected && (
          <span style={{
            marginLeft: '6px',
            padding: '1px 6px',
            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 700,
            borderRadius: '8px',
            minWidth: '18px',
            textAlign: 'center',
          }}>
            {selectionOrder + 1}
          </span>
        )}
      </div>

      {/* 子ノード（再帰的にレンダリング） */}
      {hasChildren && isExpanded && (
        <div style={{ 
          borderLeft: '2px solid #E5E7EB',  // 階層を示す線
          marginLeft: `${18 + level * 18}px`,
        }}>
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              selectedTopLevelIds={selectedTopLevelIds}
              onToggleSelect={onToggleSelect}
              onToggleExpand={onToggleExpand}
              level={level + 1}
              searchTerm={searchTerm}
              hoveredId={hoveredId}
              onHover={onHover}
              topLevelIds={topLevelIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// HierarchicalListV4Content - メインコンポーネント
// ----------------------------------------------------------------------------
// 全体の状態管理とレイアウトを担当

function HierarchicalListV4Content() {
  // Next.js ルーティング
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/components/hierarchical-list-demo';
  
  // 初期選択を取得（編集時に既存の選択状態を渡す場合に使用）
  const initialSelected = useMemo(() => {
    const param = searchParams.get('initialSelected');
    if (param) {
      try {
        const parsed = JSON.parse(param);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      } catch (e) {
        console.error('initialSelectedのパースに失敗:', e);
      }
    }
    return [];
  }, [searchParams]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // ------------------------------------------------------------------------
  // 状態管理（useState）
  // ------------------------------------------------------------------------
  
  // データ読み込み関連
  const [rawData, setRawData] = useState<string>('');     // 読み込んだ生データ
  const [isLoading, setIsLoading] = useState(true);       // 読み込み中フラグ
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const dataSource = '/data/hierarchy-data.txt';           // データファイルのパス
  
  // 選択・展開状態（initialSelectedがあれば初期値に設定）
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);  // 選択中のID（順序付き配列）
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());  // 展開中のID（Set）
  
  // UI状態
  const [searchTerm, setSearchTerm] = useState('');          // 検索語
  const [hoveredId, setHoveredId] = useState<string | null>(null);  // ホバー中のID
  const [selectedTopLevelIds, setSelectedTopLevelIds] = useState<Set<string>>(new Set());  // ハイライト第一階層
  const [isSelectionExpanded, setIsSelectionExpanded] = useState(true);  // 選択結果アコーディオンの状態

  // ------------------------------------------------------------------------
  // データ読み込み（useCallback + useEffect）
  // ------------------------------------------------------------------------
  
  /**
   * テキストファイルを非同期で読み込む関数
   * fetch APIを使用してpublicディレクトリのファイルを取得
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // fetch API でテキストファイルを取得
      const response = await fetch(dataSource);
      if (!response.ok) {
        throw new Error(`ファイルの読み込みに失敗しました: ${response.status}`);
      }
      const text = await response.text();
      setRawData(text);
      
      // 読み込み完了後、全ノードを展開状態にする
      const parsedData = parseHierarchyData(text);
      const allIds = getAllNodeIds(parsedData);
      setExpandedIds(new Set(allIds));
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  // コンポーネントマウント時にデータを読み込む
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ------------------------------------------------------------------------
  // メモ化された計算（useMemo）
  // ------------------------------------------------------------------------
  
  // 生データをパースしてツリー構造に変換（rawDataが変わった時のみ再計算）
  const treeData = useMemo(() => parseHierarchyData(rawData), [rawData]);
  
  // 第一階層のID配列（色の割り当てに使用）
  const topLevelIds = useMemo(() => treeData.map(node => node.id), [treeData]);
  
  // 全ノード数（表示用）
  const totalNodes = useMemo(() => getAllNodeIds(treeData).length, [treeData]);

  // ------------------------------------------------------------------------
  // イベントハンドラ（useCallback）
  // ------------------------------------------------------------------------

  /** 展開/折りたたみの切り替え */
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  /** 選択の切り替え（配列で順序を保持） */
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const index = prev.indexOf(id);
      if (index >= 0) {
        // 既に選択されている場合は削除
        return prev.filter(item => item !== id);
      } else {
        // 新規選択は末尾に追加
        return [...prev, id];
      }
    });
  }, []);

  /** 第一階層ハイライトの切り替え */
  const handleToggleTopLevel = useCallback((topLevelId: string) => {
    setSelectedTopLevelIds(prev => {
      const next = new Set(prev);
      if (next.has(topLevelId)) {
        next.delete(topLevelId);
      } else {
        next.add(topLevelId);
      }
      return next;
    });
  }, []);

  /** 全選択 */
  const handleSelectAll = useCallback(() => {
    const allIds = getAllNodeIds(treeData);
    setSelectedIds(allIds);
  }, [treeData]);

  /** 全解除 */
  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  /** 全展開 */
  const handleExpandAll = useCallback(() => {
    const allIds = getAllNodeIds(treeData);
    setExpandedIds(new Set(allIds));
  }, [treeData]);

  /** 全折りたたみ */
  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  /** 確定して呼び出し元に戻る */
  const handleConfirm = useCallback(() => {
    // 選択結果をJSONでエンコードしてURLパラメータに渡す
    const params = new URLSearchParams();
    params.set('selected', JSON.stringify(selectedIds));
    router.push(`${returnUrl}?${params.toString()}`);
  }, [selectedIds, returnUrl, router]);

  /** キャンセルして戻る */
  const handleCancel = useCallback(() => {
    router.push(returnUrl);
  }, [returnUrl, router]);

  /** 個別の選択解除 */
  const handleRemoveSelected = useCallback((id: string) => {
    setSelectedIds(prev => prev.filter(item => item !== id));
  }, []);

  // ------------------------------------------------------------------------
  // ボタンスタイル（動的生成）
  // ------------------------------------------------------------------------
  
  // ボタン用カラーパレット（第一階層ごとに異なる色）
  const buttonColorPalette = [
    { bgActive: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', border: '#FCA5A5', text: '#991B1B' },
    { bgActive: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)', border: '#86EFAC', text: '#166534' },
    { bgActive: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', border: '#93C5FD', text: '#1E40AF' },
    { bgActive: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '#FCD34D', text: '#92400E' },
    { bgActive: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', border: '#C4B5FD', text: '#5B21B6' },
    { bgActive: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)', border: '#FDBA74', text: '#9A3412' },
    { bgActive: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)', border: '#F9A8D4', text: '#9D174D' },
    { bgActive: 'linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)', border: '#5EEAD4', text: '#0F766E' },
  ];
  const defaultButtonColor = { bgActive: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', border: '#CBD5E1', text: '#475569' };

  /** 範囲表示ボタンのスタイルを生成 */
  const topLevelCheckboxStyle = (isChecked: boolean, nodeId?: string): React.CSSProperties => {
    const nodeIndex = nodeId ? topLevelIds.indexOf(nodeId) : -1;
    const colors = nodeIndex >= 0 && nodeIndex < buttonColorPalette.length 
      ? buttonColorPalette[nodeIndex] 
      : defaultButtonColor;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: 500,
      borderRadius: '8px',
      border: isChecked ? `1px solid ${colors.border}` : '1px solid #E2E8F0',
      background: isChecked ? colors.bgActive : '#FFFFFF',
      color: isChecked ? colors.text : '#475569',
      cursor: 'pointer',
      transition: 'all 0.12s ease',
    };
  };

  // ------------------------------------------------------------------------
  // 読み込み中表示
  // ------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        gap: '16px',
      }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: '#3B82F6' }} />
        <p style={{ color: '#64748B', fontSize: '14px' }}>データを読み込んでいます...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // エラー表示
  // ------------------------------------------------------------------------
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        gap: '16px',
      }}>
        <div style={{ color: '#EF4444', fontSize: '48px' }}>⚠️</div>
        <p style={{ color: '#EF4444', fontSize: '16px', fontWeight: 600 }}>読み込みエラー</p>
        <p style={{ color: '#64748B', fontSize: '14px' }}>{error}</p>
        <button
          onClick={loadData}
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            background: '#3B82F6',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <RefreshCw size={16} /> 再読み込み
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // メインUI
  // ------------------------------------------------------------------------
  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      
      {/* ==== 固定ヘッダー（sticky） ==== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}>
        {/* タイトル行 */}
        <div style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* 戻るボタン */}
            <button 
              onClick={handleCancel}
              style={{
                padding: '8px',
                borderRadius: '10px',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F1F5F9',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                階層リスト選択 V4
              </h1>
            </div>
          </div>
          
          {/* 選択数表示 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>選択中</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3B82F6' }}>
                {selectedIds.length} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>/ {totalNodes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* コントロール行 */}
        <div style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#F8FAFC',
          flexWrap: 'wrap',
          borderTop: '1px solid #F1F5F9',
        }}>
          {/* 全選択/解除ボタン */}
          <button onClick={handleSelectAll} style={topLevelCheckboxStyle(false)}>
            <CheckSquare size={14} /> 全選択
          </button>
          <button onClick={handleDeselectAll} style={topLevelCheckboxStyle(false)}>
            <Square size={14} /> 解除
          </button>

          <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

          {/* 範囲表示ボタン（第一階層ごと） */}
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>範囲表示:</span>
          {treeData.map(node => (
            <button
              key={node.id}
              onClick={() => handleToggleTopLevel(node.id)}
              style={topLevelCheckboxStyle(selectedTopLevelIds.has(node.id), node.id)}
            >
              {node.name}
            </button>
          ))}

          <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

          {/* 展開/折りたたみボタン */}
          <button onClick={handleExpandAll} style={topLevelCheckboxStyle(false)}>
            <FolderOpen size={14} /> 展開
          </button>
          <button onClick={handleCollapseAll} style={topLevelCheckboxStyle(false)}>
            <FolderClosed size={14} /> 折畳
          </button>

          {/* スペーサー（検索を右端に配置） */}
          <div style={{ flex: 1 }} />

          {/* 検索ボックス */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 30px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#E2E8F0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={10} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==== コンテンツエリア ==== */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        paddingBottom: '100px',  // フッターの高さ分の余白
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        
        {/* 選択結果アコーディオン */}
        {selectedIds.length > 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}>
            <button
              onClick={() => setIsSelectionExpanded(!isSelectionExpanded)}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  padding: '4px 10px',
                  background: '#3B82F6',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '6px',
                }}>
                  {selectedIds.length}件
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E40AF' }}>
                  選択中のアイテム
                </span>
              </div>
              {isSelectionExpanded ? <ChevronUp size={18} color="#3B82F6" /> : <ChevronDown size={18} color="#3B82F6" />}
            </button>
            
            {isSelectionExpanded && (
              <div style={{ padding: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '150px', overflow: 'auto' }}>
                {selectedIds.map((id, index) => (
                  <div
                    key={id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      background: '#F8FAFC',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      background: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      borderRadius: '4px',
                    }}>
                      {index + 1}
                    </span>
                    <span style={{ fontSize: '12px', color: '#334155' }}>{id}</span>
                    <button
                      onClick={() => handleRemoveSelected(id)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#E2E8F0',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginLeft: '2px',
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ツリービュー */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid #F1F5F9',
            background: '#FAFBFC',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', margin: 0 }}>
              階層リスト
            </h2>
          </div>
          <div style={{ padding: '12px' }} role="tree">
            {treeData.length > 0 ? (
              treeData.map(node => (
                <TreeNodeItem
                  key={node.id}
                  node={node}
                  selectedIds={selectedIds}
                  expandedIds={expandedIds}
                  selectedTopLevelIds={selectedTopLevelIds}
                  onToggleSelect={handleToggleSelect}
                  onToggleExpand={handleToggleExpand}
                  searchTerm={searchTerm}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  topLevelIds={topLevelIds}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                データがありません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==== 固定フッター ==== */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E2E8F0',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '12px 32px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          キャンセル
        </button>
        <button
          onClick={handleConfirm}
          disabled={selectedIds.length === 0}
          style={{
            padding: '12px 32px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            background: selectedIds.length > 0 
              ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' 
              : '#E2E8F0',
            color: selectedIds.length > 0 ? '#FFFFFF' : '#94A3B8',
            cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(59, 130, 246, 0.35)' : 'none',
          }}
        >
          確定 ({selectedIds.length}件)
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// ページコンポーネント（Suspense + export default）
// ----------------------------------------------------------------------------
// Next.js App Router では、useSearchParams を使うコンポーネントは
// Suspense でラップする必要がある

import { Suspense } from 'react';

export default function HierarchicalListV4Page() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
      }}>
        <p style={{ color: '#64748B' }}>読み込み中...</p>
      </div>
    }>
      <HierarchicalListV4Content />
    </Suspense>
  );
}
