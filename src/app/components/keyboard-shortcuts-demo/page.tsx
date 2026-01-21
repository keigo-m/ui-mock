"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Keyboard, Eye, MousePointer } from 'lucide-react';

/**
 * キーボードショートカット＆スクロールスパイ学習デモ
 * =====================================================
 * 
 * このページでは以下を学べます：
 * 1. グローバルキーボードショートカットの設定方法
 * 2. セクションへのスクロールと自動フォーカス
 * 3. スクロールスパイ（スクロール位置に応じたアクティブセクションの更新）
 * 4. サイドバークリックでのセクション移動
 * 
 * ショートカット:
 * - Ctrl+1: セクション1にジャンプ
 * - Ctrl+2: セクション2にジャンプ
 * - Ctrl+3: セクション3にジャンプ
 */

// セクション定義
const SECTIONS = [
  { id: 'section1', label: 'セクション 1', color: '#3B82F6' },
  { id: 'section2', label: 'セクション 2', color: '#10B981' },
  { id: 'section3', label: 'セクション 3', color: '#F59E0B' },
];

export default function KeyboardShortcutsDemo() {
  // セクション要素への参照を保持
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // 現在アクティブなセクション
  const [activeSection, setActiveSection] = useState<string>('section1');
  
  // 最後のアクション（デモ表示用）
  const [lastAction, setLastAction] = useState<{ type: string; detail: string } | null>(null);

  /**
   * ポイント1: セクションへスクロールし、最初の入力欄にフォーカス
   */
  const scrollToSection = (sectionId: string, focusFirst: boolean = false) => {
    const element = sectionRefs.current[sectionId];
    if (!element) return;

    // スムーズスクロール
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: 'smooth',
    });

    setActiveSection(sectionId);

    // フォーカス処理（スクロール完了後に実行）
    if (focusFirst) {
      setTimeout(() => {
        const focusableSelector = 'input, textarea, select, button:not([disabled])';
        const firstFocusable = element.querySelector<HTMLElement>(focusableSelector);
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 300);
    }
  };

  /**
   * ポイント2: グローバルキーボードショートカットの設定
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        const keyNum = parseInt(e.key);
        
        if (keyNum >= 1 && keyNum <= SECTIONS.length) {
          e.preventDefault();
          
          const section = SECTIONS[keyNum - 1];
          scrollToSection(section.id, true);
          setLastAction({ type: 'keyboard', detail: `Ctrl+${keyNum}` });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * ポイント3: スクロールスパイ（スクロール位置に応じたアクティブセクション更新）
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // オフセット値

      // 各セクションの位置をチェック
      for (const section of SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          // スクロール位置がセクション内にある場合
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
              setLastAction({ type: 'scroll', detail: section.label });
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  /**
   * ポイント4: サイドバークリックでのセクション移動
   */
  const handleSidebarClick = (sectionId: string) => {
    scrollToSection(sectionId, true);
    const section = SECTIONS.find(s => s.id === sectionId);
    setLastAction({ type: 'click', detail: section?.label || '' });
  };

  return (
    <div style={{
      minHeight: '200vh', // スクロール可能にするため高さを増やす
      background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
      padding: '32px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* 固定サイドバー */}
      <nav style={{
        position: 'fixed',
        left: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 100,
      }}>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
          ナビゲーション
        </p>
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            onClick={() => handleSidebarClick(section.id)}
            title={`${section.label} (Ctrl+${index + 1})`}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: activeSection === section.id
                ? section.color
                : 'rgba(255, 255, 255, 0.1)',
              color: activeSection === section.id ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '16px',
              transition: 'all 0.2s ease',
              boxShadow: activeSection === section.id
                ? `0 4px 12px ${section.color}50`
                : 'none',
            }}
          >
            {index + 1}
          </button>
        ))}
      </nav>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginLeft: '120px' }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94A3B8',
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            戻る
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Keyboard style={{ width: '28px', height: '28px', color: '#FFFFFF' }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#F8FAFC' }}>
                キーボード＆スクロール学習
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94A3B8' }}>
                Ctrl+1〜3 / サイドバークリック / スクロールで連動
              </p>
            </div>
          </div>

          {/* 操作ガイド */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Keyboard style={{ width: '16px', height: '16px', color: '#60A5FA' }} />
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>Ctrl+1〜3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MousePointer style={{ width: '16px', height: '16px', color: '#34D399' }} />
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>サイドバークリック</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye style={{ width: '16px', height: '16px', color: '#FBBF24' }} />
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>スクロール監視</span>
            </div>
            
            {lastAction && (
              <div style={{
                marginLeft: 'auto',
                padding: '6px 14px',
                background: lastAction.type === 'keyboard' ? '#3B82F6'
                  : lastAction.type === 'click' ? '#10B981'
                  : '#F59E0B',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                {lastAction.type === 'keyboard' && <Keyboard style={{ width: '14px', height: '14px' }} />}
                {lastAction.type === 'click' && <MousePointer style={{ width: '14px', height: '14px' }} />}
                {lastAction.type === 'scroll' && <Eye style={{ width: '14px', height: '14px' }} />}
                {lastAction.detail}
              </div>
            )}
          </div>
        </div>

        {/* セクション */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {SECTIONS.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              ref={el => { sectionRefs.current[section.id] = el; }}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: activeSection === section.id
                  ? `0 0 0 3px ${section.color}40, 0 10px 40px rgba(0, 0, 0, 0.2)`
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
                minHeight: '400px', // スクロールスパイが分かりやすいように高さを増やす
              }}
            >
              {/* セクションヘッダー */}
              <div style={{
                padding: '16px 24px',
                background: `linear-gradient(135deg, ${section.color}15 0%, ${section.color}05 100%)`,
                borderBottom: `2px solid ${section.color}30`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: section.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                }}>
                  {index + 1}
                </div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                  {section.label}
                </h2>
                <kbd style={{
                  marginLeft: 'auto',
                  padding: '4px 10px',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                }}>
                  Ctrl+{index + 1}
                </kbd>
              </div>

              {/* セクション内容 */}
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    フィールド A
                  </label>
                  <input
                    type="text"
                    placeholder={`${section.label} の入力欄 A`}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    フィールド B
                  </label>
                  <input
                    type="text"
                    placeholder={`${section.label} の入力欄 B`}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    テキストエリア
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`${section.label} のテキストエリア（スクロールして他のセクションへ移動してみてください）`}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* コード解説 */}
        <div style={{
          marginTop: '48px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: '#F8FAFC' }}>
            💡 実装のポイント
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '3px solid #3B82F6' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#CBD5E1' }}>
                <strong style={{ color: '#60A5FA' }}>1. キーボードショートカット:</strong> useEffect + window.addEventListener('keydown')
              </p>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#CBD5E1' }}>
                <strong style={{ color: '#34D399' }}>2. サイドバークリック:</strong> onClick → scrollToSection(id, true) で移動＆フォーカス
              </p>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', borderLeft: '3px solid #F59E0B' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#CBD5E1' }}>
                <strong style={{ color: '#FBBF24' }}>3. スクロールスパイ:</strong> useEffect + window.addEventListener('scroll') で現在位置を監視
              </p>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', borderLeft: '3px solid #8B5CF6' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#CBD5E1' }}>
                <strong style={{ color: '#A78BFA' }}>4. 状態連動:</strong> activeSection を共有し、サイドバー・スクロール・キーボードが連動
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
