"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, ChevronDown, Check } from "lucide-react";

/*
  階層的リスト選択 V2 (Hierarchical List Selector V2)
  ==================================================
  
  バリエーション2: コントロールボタンを上部に固定表示
  
  機能:
  - 展開/折りたたみ可能なツリー表示
  - チェックボックスによる複数選択（親子連動なし）
  - 選択順序を保持
  - 全選択・展開ボタンを上部に固定
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
function HierarchicalListV2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/components/hierarchical-list-demo';
  
  const treeData = useMemo(() => parseHierarchyData(SAMPLE_DATA), []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const allIds = getAllNodeIds(treeData);
    return new Set(allIds);
  });

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

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const index = prev.indexOf(id);
      if (index >= 0) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = getAllNodeIds(treeData);
    setSelectedIds(allIds);
  }, [treeData]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleExpandAll = useCallback(() => {
    const allIds = getAllNodeIds(treeData);
    setExpandedIds(new Set(allIds));
  }, [treeData]);

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const handleConfirm = useCallback(() => {
    const params = new URLSearchParams();
    params.set('selected', JSON.stringify(selectedIds));
    router.push(`${returnUrl}?${params.toString()}`);
  }, [selectedIds, returnUrl, router]);

  const handleCancel = useCallback(() => {
    router.push(returnUrl);
  }, [returnUrl, router]);

  // ボタンスタイル
  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    background: '#FFFFFF',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      
      {/* 固定ヘッダー（タイトル + コントロールボタン統合） */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}>
        {/* 上段：タイトル行 */}
        <div style={{
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F3F4F6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={handleCancel}
              style={{
                padding: '8px',
                borderRadius: '10px',
                color: '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                階層リスト選択 V2
              </h1>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                コントロール固定パターン
              </p>
            </div>
          </div>
          <div style={{ 
            padding: '6px 14px', 
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1E40AF',
          }}>
            {selectedIds.length} 件選択中
          </div>
        </div>

        {/* 下段：コントロールボタン（固定） */}
        <div style={{
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FAFBFC',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, marginRight: '4px' }}>
            選択:
          </span>
          <button onClick={handleSelectAll} style={buttonStyle}>
            全て選択
          </button>
          <button onClick={handleDeselectAll} style={buttonStyle}>
            全て解除
          </button>
          <div style={{ width: '1px', height: '20px', background: '#E5E7EB', margin: '0 8px' }} />
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, marginRight: '4px' }}>
            表示:
          </span>
          <button onClick={handleExpandAll} style={buttonStyle}>
            全て展開
          </button>
          <button onClick={handleCollapseAll} style={buttonStyle}>
            全て折りたたみ
          </button>
        </div>
      </header>

      {/* スクロール可能なコンテンツエリア */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '24px',
        paddingBottom: '100px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* ツリービュー */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F3F4F6',
              background: '#FAFBFC',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                階層リスト
              </h2>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0 0' }}>
                クリックで選択/解除
              </p>
            </div>
            <div style={{ padding: '12px' }} role="tree">
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
            <div style={{
              marginTop: '16px',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #F3F4F6',
                background: '#FAFBFC',
              }}>
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>
                  選択順序
                </h2>
              </div>
              <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedIds.map((id, index) => (
                  <span
                    key={id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      background: '#F0F4FF',
                      color: '#1E40AF',
                      fontSize: '12px',
                      fontWeight: 500,
                      borderRadius: '6px',
                      border: '1px solid #BFDBFE',
                    }}
                  >
                    <span style={{
                      background: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '1px 4px',
                      borderRadius: '4px',
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
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 28px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
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
            padding: '10px 28px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
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

export default function HierarchicalListV2Page() {
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
      <HierarchicalListV2Content />
    </Suspense>
  );
}
