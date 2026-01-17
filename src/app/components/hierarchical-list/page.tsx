"use client";

import Link from "next/link";
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, ChevronDown, Check } from "lucide-react";

/*
  階層的リスト選択 (Hierarchical List Selector)
  =============================================
  
  「/」区切りのテキストデータから階層構造を構築し、
  複数選択可能なツリービューを表示するコンポーネント。
  
  機能:
  - 展開/折りたたみ可能なツリー表示
  - チェックボックスによる複数選択（親子連動なし）
  - 選択順序を保持
  - 呼び出し元に選択結果を返す
*/

// サンプルデータ（起動時に読み込むテキストを想定）
const SAMPLE_DATA = `A11
A11/B11/
A11/B11/C11
A11/B11/C22
A11/B22
A11/B22/C33
A11/B22/C44
A22
A22/B11/
A22/B11/C11
A22/B11/C22
A22/B22
A22/B22/C33
A22/B22/C44
A33
A33/B11/
A33/B11/C11
A33/B11/C22
A33/B22
A33/B22/C33
A33/B22/C44`;

// ツリーノードの型定義
type TreeNode = {
  id: string;
  name: string;
  path: string;
  children: TreeNode[];
};

// テキストデータをパースして階層構造を構築
function parseHierarchyData(text: string): TreeNode[] {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const root: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  lines.forEach(line => {
    // 末尾の「/」を除去
    const cleanPath = line.trim().replace(/\/+$/, '');
    if (!cleanPath) return;

    const parts = cleanPath.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!nodeMap.has(currentPath)) {
        const node: TreeNode = {
          id: currentPath,
          name: part,
          path: currentPath,
          children: [],
        };
        nodeMap.set(currentPath, node);

        if (index === 0) {
          root.push(node);
        } else {
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

// 全ノードのIDを取得
function getAllNodeIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  nodes.forEach(node => {
    ids.push(node.id);
    ids.push(...getAllNodeIds(node.children));
  });
  return ids;
}

// ツリーノードコンポーネント
function TreeNodeItem({
  node,
  selectedIds,
  expandedIds,
  onToggleSelect,
  onToggleExpand,
  level = 0,
}: {
  node: TreeNode;
  selectedIds: string[];
  expandedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  level?: number;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedIds.includes(node.id);
  
  // 選択順序を表示
  const selectionOrder = selectedIds.indexOf(node.id);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          paddingLeft: `${8 + level * 18}px`,
          borderRadius: '4px',
          margin: '1px 0',
          background: isSelected 
            ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' 
            : 'transparent',
          transition: 'all 0.15s ease',
          cursor: 'pointer',
        }}
        onClick={() => onToggleSelect(node.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleSelect(node.id);
          }
        }}
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
      >
        {/* 展開/折りたたみボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(node.id);
          }}
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: hasChildren ? 'pointer' : 'default',
            color: hasChildren ? '#4B5563' : 'transparent',
            borderRadius: '4px',
            marginRight: '4px',
            transition: 'all 0.15s ease',
          }}
          aria-label={hasChildren ? (isExpanded ? '折りたたむ' : '展開する') : ''}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown size={22} /> : <ChevronRight size={22} />
          )}
        </button>

        {/* チェックボックス */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '3px',
            border: isSelected ? 'none' : '1.5px solid #D1D5DB',
            background: isSelected 
              ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' 
              : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            transition: 'all 0.15s ease',
            boxShadow: isSelected ? '0 1px 2px rgba(59, 130, 246, 0.3)' : 'none',
            flexShrink: 0,
          }}
        >
          {isSelected && <Check size={11} color="#FFFFFF" />}
        </div>

        {/* ノード名 */}
        <span style={{ 
          fontSize: '13px', 
          fontWeight: isSelected ? 600 : 400, 
          color: isSelected ? '#1E40AF' : '#374151',
          flex: 1,
        }}>
          {node.name}
        </span>

        {/* 選択順序バッジ */}
        {isSelected && (
          <span style={{
            marginLeft: '6px',
            padding: '1px 5px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: '8px',
            minWidth: '16px',
            textAlign: 'center',
          }}>
            {selectionOrder + 1}
          </span>
        )}

        {/* 子ノード数バッジ */}
        {hasChildren && (
          <span style={{
            marginLeft: '6px',
            padding: '1px 5px',
            background: '#F3F4F6',
            color: '#6B7280',
            fontSize: '10px',
            fontWeight: 500,
            borderRadius: '8px',
          }}>
            {node.children.length}
          </span>
        )}
      </div>

      {/* 子ノード（展開時） */}
      {hasChildren && isExpanded && (
        <div style={{ borderLeft: '1px solid #E5E7EB', marginLeft: `${18 + level * 18}px` }}>
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggleSelect={onToggleSelect}
              onToggleExpand={onToggleExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// メインコンポーネント（Suspense対応）
function HierarchicalListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/components/hierarchical-list-demo';
  
  // データをパースして階層構造を構築
  const treeData = useMemo(() => parseHierarchyData(SAMPLE_DATA), []);
  
  // 選択状態の管理（順序付き配列）
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // 展開状態の管理（デフォルトで全て展開）
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const allIds = getAllNodeIds(treeData);
    return new Set(allIds);
  });

  // 展開/折りたたみの切り替え
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

  // 選択の切り替え（親子連動なし、順序保持）
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const index = prev.indexOf(id);
      if (index >= 0) {
        // 選択解除
        return prev.filter(item => item !== id);
      } else {
        // 選択追加（末尾に追加して順序を保持）
        return [...prev, id];
      }
    });
  }, []);

  // 全選択/全解除
  const handleSelectAll = useCallback(() => {
    const allIds = getAllNodeIds(treeData);
    setSelectedIds(allIds);
  }, [treeData]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // 全展開/全折りたたみ
  const handleExpandAll = useCallback(() => {
    const allIds = getAllNodeIds(treeData);
    setExpandedIds(new Set(allIds));
  }, [treeData]);

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // 確定して戻る
  const handleConfirm = useCallback(() => {
    // 選択結果をクエリパラメータで渡す
    const params = new URLSearchParams();
    params.set('selected', JSON.stringify(selectedIds));
    router.push(`${returnUrl}?${params.toString()}`);
  }, [selectedIds, returnUrl, router]);

  // キャンセルして戻る
  const handleCancel = useCallback(() => {
    router.push(returnUrl);
  }, [returnUrl, router]);

  // 共通スタイル
  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    background: '#FFFFFF',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
      paddingBottom: '100px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      
      {/* ヘッダー */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={handleCancel}
            style={{
              padding: '10px',
              borderRadius: '12px',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
              階層リスト選択
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
              項目を選択してください（選択順序が保持されます）
            </p>
          </div>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#1E40AF',
        }}>
          選択中: {selectedIds.length} 項目
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>
        
        {/* コントロールボタン */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <button onClick={handleSelectAll} style={buttonStyle}>
            全て選択
          </button>
          <button onClick={handleDeselectAll} style={buttonStyle}>
            全て解除
          </button>
          <div style={{ width: '1px', background: '#E5E7EB', margin: '0 8px' }} />
          <button onClick={handleExpandAll} style={buttonStyle}>
            全て展開
          </button>
          <button onClick={handleCollapseAll} style={buttonStyle}>
            全て折りたたみ
          </button>
        </div>

        {/* ツリービュー */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F3F4F6',
            background: 'linear-gradient(135deg, #DBEAFE40 0%, #FFFFFF 100%)',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
              階層リスト
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
              クリックで選択/解除、番号は選択順序を示します
            </p>
          </div>
          <div style={{ padding: '16px' }} role="tree">
            {treeData.map(node => (
              <TreeNodeItem
                key={node.id}
                node={node}
                selectedIds={selectedIds}
                expandedIds={expandedIds}
                onToggleSelect={handleToggleSelect}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        </div>

        {/* 選択結果プレビュー */}
        {selectedIds.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: '24px' }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #F3F4F6',
              background: 'linear-gradient(135deg, #D1FAE540 0%, #FFFFFF 100%)',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                選択順序
              </h2>
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedIds.map((id, index) => (
                <span
                  key={id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    color: '#1E40AF',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  <span style={{
                    background: '#3B82F6',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}>
                    {index + 1}
                  </span>
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* フッター（確定/キャンセルボタン） */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #E5E7EB',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '12px 32px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          キャンセル
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: '12px 32px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          確定 ({selectedIds.length}件)
        </button>
      </div>
    </div>
  );
}

// Suspenseでラップ
import { Suspense } from 'react';

export default function HierarchicalListPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
      }}>
        <p style={{ color: '#6B7280' }}>読み込み中...</p>
      </div>
    }>
      <HierarchicalListContent />
    </Suspense>
  );
}
