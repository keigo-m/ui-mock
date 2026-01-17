
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, List, ChevronRight } from 'lucide-react';

/*
  階層リスト選択デモページ
  ======================
  
  階層リスト選択ページの呼び出し元となるモックページ。
  選択ボタンを押すと階層リスト選択に遷移し、
  戻ってきたときに選択結果を表示する。
*/

function DemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 選択結果（順序付き配列）
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // クエリパラメータから選択結果を取得
  useEffect(() => {
    const selected = searchParams.get('selected');
    if (selected) {
      try {
        const parsed = JSON.parse(selected);
        if (Array.isArray(parsed)) {
          setSelectedItems(parsed);
        }
      } catch (e) {
        console.error('選択結果のパースに失敗:', e);
      }
    }
  }, [searchParams]);

  // 階層リスト選択ページへ遷移
  const handleOpenSelector = () => {
    const returnUrl = encodeURIComponent('/components/hierarchical-list-demo');
    router.push(`/components/hierarchical-list?returnUrl=${returnUrl}`);
  };

  // 選択結果をクリア
  const handleClear = () => {
    setSelectedItems([]);
    // URLからクエリパラメータも削除
    router.replace('/components/hierarchical-list-demo');
  };

  // 共通スタイル
  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
      paddingBottom: '60px',
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
          <Link href="/" style={{
            padding: '10px',
            borderRadius: '12px',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #E5E7EB',
            textDecoration: 'none',
          }}>
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </Link>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
              階層リスト選択デモ
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
              呼び出し元ページのサンプル
            </p>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        
        {/* 説明カード */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F3F4F6',
            background: 'linear-gradient(135deg, #DBEAFE40 0%, #FFFFFF 100%)',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
              使い方
            </h2>
          </div>
          <div style={{ padding: '24px' }}>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#374151', lineHeight: 1.8 }}>
              <li>「リストから選択」ボタンをクリック</li>
              <li>階層リストから項目を選択（選択順序が保持されます）</li>
              <li>「確定」ボタンで戻る</li>
              <li>下の「選択結果」に順序付きで表示されます</li>
            </ol>
          </div>
        </div>

        {/* 選択ボタン */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleOpenSelector}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              <List size={20} />
              リストから選択
              <ChevronRight size={20} />
            </button>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              クリックして階層リスト選択ページへ移動
            </p>
          </div>
        </div>

        {/* 選択結果 */}
        <div style={cardStyle}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F3F4F6',
            background: 'linear-gradient(135deg, #D1FAE540 0%, #FFFFFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
                選択結果
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                {selectedItems.length} 件選択中（選択順）
              </p>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  color: '#EF4444',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                クリア
              </button>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            {selectedItems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedItems.map((item, index) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      flexShrink: 0,
                    }}>
                      {index + 1}
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#1E293B',
                      flex: 1,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '2px dashed #E2E8F0',
              }}>
                <List size={40} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
                  まだ何も選択されていません
                </p>
                <p style={{ color: '#CBD5E1', fontSize: '13px', margin: '4px 0 0 0' }}>
                  上のボタンからリストを選択してください
                </p>
              </div>
            )}
          </div>
        </div>

        {/* データ形式表示（開発者向け） */}
        {selectedItems.length > 0 && (
          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #F3F4F6',
              background: 'linear-gradient(135deg, #F5F3FF40 0%, #FFFFFF 100%)',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                データ形式（開発者向け）
              </h2>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <pre style={{
                background: '#1E293B',
                color: '#E2E8F0',
                padding: '16px',
                borderRadius: '10px',
                fontSize: '13px',
                overflow: 'auto',
                margin: 0,
              }}>
                {JSON.stringify(selectedItems, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Suspenseでラップ
export default function HierarchicalListDemoPage() {
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
      <DemoContent />
    </Suspense>
  );
}
