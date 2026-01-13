// フォームの共通スタイル
// このファイルをコピーして、プロジェクトに合わせてカスタマイズしてください

import React from 'react';

// カードスタイル
export const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
  border: '1px solid #E5E7EB',
  overflow: 'hidden',
};

// 入力フィールドスタイル
export const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #D1D5DB',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#111827',
  background: '#FFFFFF',
  outline: 'none',
  transition: 'all 0.2s ease',
};

// ラベルスタイル
export const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '8px',
};

// セレクトボックススタイル
export const selectStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #D1D5DB',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#111827',
  background: '#FFFFFF',
  outline: 'none',
  cursor: 'pointer',
};

// チェックボックスカードスタイル（選択時）
export const checkboxCardSelectedStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  border: '1px solid #3B82F6',
  borderRadius: '12px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
  transition: 'all 0.2s ease',
};

// チェックボックスカードスタイル（非選択時）
export const checkboxCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  cursor: 'pointer',
  background: '#FFFFFF',
  transition: 'all 0.2s ease',
};

// 色定義
export const colors = {
  // テキスト
  textDark: '#111827',
  textMedium: '#374151',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  
  // 境界線
  border: '#E5E7EB',
  borderInput: '#D1D5DB',
  
  // プライマリ（青）
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#EFF6FF',
  primaryBg: '#DBEAFE',
  
  // 成功（緑）
  success: '#10B981',
  successDark: '#059669',
  successBg: '#D1FAE5',
  
  // 警告（黄）
  warning: '#F59E0B',
  warningDark: '#D97706',
  warningBg: '#FEF3C7',
  
  // エラー（赤）
  error: '#EF4444',
  errorDark: '#DC2626',
  errorBg: '#FEE2E2',
};
