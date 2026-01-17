"use client";
// ============================================================================
// 階層リスト選択 V4 呼び出しサンプルページ
// ============================================================================
// 
// 【目的】
// 階層リスト選択コンポーネントV4を別のページから呼び出し、
// 選択結果を取得して表示するサンプルです。
// 
// 【機能】
// 1. 「リストから選択」ボタン → V4ページに遷移
// 2. V4で選択確定 → このページに戻る
// 3. 選択結果をURLパラメータから取得して表示
// 
// 【データの流れ】
// 1. このページ → V4ページに遷移（returnUrlを渡す）
// 2. V4で選択 → 確定ボタンクリック
// 3. V4 → このページに戻る（selectedパラメータに選択結果）
// 4. このページでselectedパラメータをパースして表示
// ============================================================================

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ListChecks, ExternalLink, Trash2, Copy, CheckCircle } from 'lucide-react';

// ----------------------------------------------------------------------------
// メインコンテンツ
// ----------------------------------------------------------------------------
function V4SampleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URLパラメータから初期値を計算（useMemoで最適化）
  const initialSelectedItems = useMemo(() => {
    const selectedParam = searchParams.get('selected');
    if (selectedParam) {
      try {
        const parsed = JSON.parse(selectedParam);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      } catch (e) {
        console.error('選択結果のパースに失敗:', e);
      }
    }
    return [];
  }, [searchParams]);

  // 選択結果を保持する状態（初期値はURLパラメータから）
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelectedItems);
  const [copied, setCopied] = useState(false);

  // ------------------------------------------------------------------------
  // V4ページへ遷移（新規選択）
  // ------------------------------------------------------------------------
  const handleOpenSelector = () => {
    // 現在のページのパスをreturnUrlとして渡す
    // V4で「確定」ボタンを押すとこのページに戻ってくる
    const returnUrl = '/components/hierarchical-list-v4-sample';
    router.push(`/components/hierarchical-list-v4?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  // ------------------------------------------------------------------------
  // V4ページへ遷移（編集：既存の選択を初期値として渡す）
  // ------------------------------------------------------------------------
  const handleEditSelector = () => {
    const returnUrl = '/components/hierarchical-list-v4-sample';
    // initialSelectedパラメータで現在の選択状態を渡す
    const initialSelected = encodeURIComponent(JSON.stringify(selectedItems));
    router.push(`/components/hierarchical-list-v4?returnUrl=${encodeURIComponent(returnUrl)}&initialSelected=${initialSelected}`);
  };

  // ------------------------------------------------------------------------
  // 選択結果をクリア
  // ------------------------------------------------------------------------
  const handleClear = () => {
    setSelectedItems([]);
    // URLからパラメータも削除
    router.push('/components/hierarchical-list-v4-sample');
  };

  // ------------------------------------------------------------------------
  // 選択結果をクリップボードにコピー
  // ------------------------------------------------------------------------
  const handleCopy = async () => {
    const text = selectedItems.join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ------------------------------------------------------------------------
  // レンダリング
  // ------------------------------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            color: '#0F172A',
            margin: 0,
            marginBottom: '8px',
          }}>
            V4 呼び出しサンプル
          </h1>
          <p style={{ color: '#64748B', margin: 0 }}>
            階層リスト選択コンポーネントを別のページから呼び出すサンプルです
          </p>
        </div>

        {/* 選択ボタンカード */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <h2 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#1E293B',
            margin: 0,
            marginBottom: '16px',
          }}>
            1. 選択画面を開く
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenSelector}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
              }}
            >
              <ListChecks size={20} />
              新規選択
              <ExternalLink size={16} />
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleEditSelector}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  border: '2px solid #3B82F6',
                  background: '#FFFFFF',
                  color: '#3B82F6',
                  cursor: 'pointer',
                }}
              >
                <ListChecks size={20} />
                選択を編集
                <ExternalLink size={16} />
              </button>
            )}
          </div>
          <p style={{ 
            color: '#94A3B8', 
            fontSize: '13px', 
            margin: 0, 
            marginTop: '12px' 
          }}>
            {selectedItems.length > 0 
              ? '「選択を編集」で現在の選択状態を維持したまま編集できます'
              : '「新規選択」で選択画面に遷移します'}
          </p>
        </div>

        {/* 選択結果カード */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#1E293B',
              margin: 0,
            }}>
              2. 選択結果
              {selectedItems.length > 0 && (
                <span style={{
                  marginLeft: '10px',
                  padding: '2px 10px',
                  background: '#3B82F6',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '20px',
                }}>
                  {selectedItems.length}件
                </span>
              )}
            </h2>
            {selectedItems.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: copied ? '#DCFCE7' : '#FFFFFF',
                    color: copied ? '#166534' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'コピー済み' : 'コピー'}
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#EF4444',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                  クリア
                </button>
              </div>
            )}
          </div>

          {selectedItems.length > 0 ? (
            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '16px',
              maxHeight: '400px',
              overflow: 'auto',
            }}>
              {selectedItems.map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    marginBottom: index < selectedItems.length - 1 ? '8px' : 0,
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#1F2937',
                    fontFamily: 'monospace',
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '2px dashed #E2E8F0',
              padding: '40px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#94A3B8', margin: 0 }}>
                まだ選択されていません
              </p>
              <p style={{ color: '#CBD5E1', fontSize: '13px', margin: '8px 0 0 0' }}>
                上の「リストから選択」ボタンをクリックしてください
              </p>
            </div>
          )}
        </div>

        {/* コードサンプル */}
        <div style={{
          background: '#1E293B',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          overflow: 'auto',
        }}>
          <h3 style={{ 
            color: '#94A3B8', 
            fontSize: '12px', 
            fontWeight: 600,
            margin: 0,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            コード例：選択結果の取得
          </h3>
          <pre style={{
            color: '#E2E8F0',
            fontSize: '13px',
            fontFamily: 'Consolas, Monaco, monospace',
            margin: 0,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}>
{`// URLパラメータから選択結果を取得
const searchParams = useSearchParams();
const selectedParam = searchParams.get('selected');

if (selectedParam) {
  const selectedItems = JSON.parse(selectedParam);
  // selectedItems: ["A11", "A11/B11", "A11/B11/C11", ...]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// エクスポート（Suspenseでラップ）
// ----------------------------------------------------------------------------
export default function V4SamplePage() {
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
      <V4SampleContent />
    </Suspense>
  );
}
