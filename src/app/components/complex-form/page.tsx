"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Building, CreditCard, Bell, Save, Shield, Globe, Check, AlertCircle, Eye, EyeOff, FileText, Settings, Plus, Minus, Upload, File, X, Clock } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ja } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { 
  saveForm, 
  loadFormById, 
  generateFormId, 
  getNextFormNumber,
  calculateCompletionRate,
  type SavedForm 
} from '@/lib/formStorage';

// 日本語ロケールを登録
registerLocale('ja', ja);

/*
  複合フォーム (Complex Form) - 入力パターン集
  ============================================
  
  このページでは以下の入力パターンを実装しています：
  
  1. テキスト入力（通常・必須）
  2. パスワード入力（表示/非表示切り替え）
  3. セレクトボックス
  4. チェックボックス
  5. ラジオボタン（通常・カード型）
  6. カード型排他選択（チェックボックス風だが1つのみ選択可能）
  7. テキストエリア
*/

// フォームデータの型定義
type FormData = {
  // 基本情報
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  // アカウント設定
  password: string;
  confirmPassword: string;
  accountType: string;  // ラジオボタン
  // 会社詳細
  companyName: string;
  department: string;
  position: string;
  employeeCount: string;
  companyAddress: string;
  industry: string;
  website: string;
  // 請求・支払い
  cardNumber: string;
  cardExpiry: string;
  cardName: string;
  billingEmail: string;
  billingCycle: string;
  // セキュリティ
  twoFactor: boolean;
  loginNotify: boolean;
  sessionTimeout: boolean;
  // 外部連携
  googleConnected: boolean;
  slackConnected: boolean;
  githubConnected: boolean;
  teamsConnected: boolean;
  // 通知設定
  weeklyReport: boolean;
  newComments: boolean;
  mentions: boolean;
  teamJoins: boolean;
  systemUpdates: boolean;
  securityAlerts: boolean;
  // 同意設定（'' = 未選択, 'agree' = 同意, 'disagree' = 同意しない, 'partial' = 一部同意）
  termsAgreement: '' | 'agree' | 'disagree' | 'partial';
  privacyAgreement: '' | 'agree' | 'disagree' | 'partial';
  marketingAgreement: '' | 'agree' | 'disagree' | 'partial';
  // その他の入力パターン
  darkMode: boolean;
  fontSize: number;
  birthDate: Date | null;  // Date型に変更
  quantity: number;
};

// セクションの定義
const SECTIONS = [
    { id: 'basic', label: '基本情報', icon: User, color: '#3B82F6', bgColor: '#DBEAFE', requiredFields: ['lastName', 'firstName', 'email'] },
    { id: 'account', label: 'アカウント設定', icon: Shield, color: '#EF4444', bgColor: '#FEE2E2', requiredFields: ['password'] },
    { id: 'company', label: '会社詳細', icon: Building, color: '#8B5CF6', bgColor: '#EDE9FE', requiredFields: ['companyName', 'department'] },
    { id: 'billing', label: '請求・支払い', icon: CreditCard, color: '#10B981', bgColor: '#D1FAE5', requiredFields: ['cardNumber', 'cardExpiry', 'cardName'] },
    { id: 'integrations', label: '外部連携', icon: Globe, color: '#06B6D4', bgColor: '#CFFAFE', requiredFields: [] },
    { id: 'notifications', label: '通知設定', icon: Bell, color: '#F59E0B', bgColor: '#FEF3C7', requiredFields: [] },
    { id: 'agreements', label: '同意事項', icon: FileText, color: '#EC4899', bgColor: '#FCE7F3', requiredFields: ['termsAgreement'] },
    { id: 'extras', label: 'その他の入力', icon: Settings, color: '#64748B', bgColor: '#F1F5F9', requiredFields: [] },
];

// 内部コンポーネント（useSearchParamsを使用）
function ComplexFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formIdFromUrl = searchParams.get('id');
  
  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // フォームIDとトースト通知
  const [formId, setFormId] = useState<string | null>(formIdFromUrl);
  const [formName, setFormName] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    lastName: '山田',
    firstName: '太郎',
    email: 'taro@example.com',
    phone: '090-1234-5678',
    address: '東京都渋谷区...',
    bio: 'シニア管理者として活動しています。',
    password: 'password123',
    confirmPassword: 'password123',
    accountType: 'standard',
    companyName: '株式会社サンプル',
    department: 'システム開発部',
    position: 'エンジニア',
    employeeCount: '51-200名',
    companyAddress: '東京都千代田区...',
    industry: 'IT・通信',
    website: 'https://example.com',
    cardNumber: '**** **** **** 1234',
    cardExpiry: '12/25',
    cardName: 'TARO YAMADA',
    billingEmail: 'billing@example.com',
    billingCycle: '月次',
    twoFactor: true,
    loginNotify: true,
    sessionTimeout: false,
    googleConnected: true,
    slackConnected: false,
    githubConnected: false,
    teamsConnected: false,
    weeklyReport: true,
    newComments: true,
    mentions: true,
    teamJoins: false,
    systemUpdates: false,
    securityAlerts: true,
    // 同意設定の初期値：'' = 未選択, 'agree' = 同意, etc.
    termsAgreement: 'agree',       // 利用規約：同意済み
    privacyAgreement: '',           // プライバシー：未選択（デモ用）
    marketingAgreement: 'partial',  // マーケティング：一部同意
    darkMode: false,
    fontSize: 16,
    birthDate: null,  // 初期値なし
    quantity: 1,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // URLパラメータからフォームを読み込む
  useEffect(() => {
    if (formIdFromUrl) {
      const savedForm = loadFormById(formIdFromUrl);
      if (savedForm) {
        // 保存されたデータを復元
        const data = savedForm.data as FormData;
        // birthDateがstring形式の場合はDateに変換
        if (data.birthDate && typeof data.birthDate === 'string') {
          data.birthDate = new Date(data.birthDate);
        }
        setFormData(data);
        setFormId(savedForm.id);
        setFormName(savedForm.name);
      }
    }
  }, [formIdFromUrl]);

  // トースト自動非表示
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 一時保存処理
  const handleSaveForm = () => {
    try {
      // セクションの完了状態を計算
      const sectionStatus: { [key: string]: boolean } = {};
      SECTIONS.forEach(section => {
        sectionStatus[section.id] = isSectionComplete(section.id);
      });
      
      const rate = calculateCompletionRate(sectionStatus);
      const id = formId || generateFormId();
      const name = formName || `アカウント設定 #${getNextFormNumber()}`;
      
      const formToSave: SavedForm = {
        id,
        name,
        data: { ...formData, birthDate: formData.birthDate?.toISOString() || null } as unknown as Record<string, unknown>,
        sectionStatus,
        completionRate: rate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // ワークフローステータス（新規作成時はデフォルト値）
        workflowStatus: rate === 100 ? 'input_complete' : 'inputting',
        analysisStatus: 'none',
        downloadStatus: 'unavailable',
      };
      
      saveForm(formToSave);
      
      // 新規の場合はIDをセット
      if (!formId) {
        setFormId(id);
        setFormName(name);
      }
      
      setToast({ message: '一時保存しました', type: 'success' });
    } catch (error) {
      console.error('保存エラー:', error);
      setToast({ message: '保存に失敗しました', type: 'error' });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isSectionComplete = (sectionId: string): boolean => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return false;
    if (section.requiredFields.length === 0) return true;
    return section.requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return typeof value === 'string' ? value.trim() !== '' : true;
    });
  };

  const completionRate = SECTIONS.filter(s => isSectionComplete(s.id)).length / SECTIONS.length * 100;
  
  useEffect(() => {
    const handleScroll = () => {
        const scrollPosition = window.scrollY + 200;
        for (const section of SECTIONS) {
            const element = sectionRefs.current[section.id];
            if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                setActiveSection(section.id);
                break;
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
      const element = sectionRefs.current[id];
      if (element) {
          window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
          setActiveSection(id);
      }
  };

  // 共通スタイル
  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
  };

  const inputStyle: React.CSSProperties = {
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

  // テキスト入力コンポーネント
  const InputField = ({ label, field, type = 'text', required = false, placeholder = '' }: {
    label: string;
    field: keyof FormData;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div style={{ marginBottom: '4px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input 
        type={type}
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = '#3B82F6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#D1D5DB';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  // パスワード入力コンポーネント（表示/非表示切り替え付き）
  const PasswordField = ({ label, field, showPasswordState, setShowPasswordState, required = false }: {
    label: string;
    field: keyof FormData;
    showPasswordState: boolean;
    setShowPasswordState: (v: boolean) => void;
    required?: boolean;
  }) => (
    <div style={{ marginBottom: '4px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input 
          type={showPasswordState ? 'text' : 'password'}
          value={formData[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          style={{ ...inputStyle, paddingRight: '48px' }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3B82F6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#D1D5DB';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={() => setShowPasswordState(!showPasswordState)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showPasswordState ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
        {showPasswordState ? 'パスワードを表示中' : 'クリックでパスワードを表示'}
      </p>
    </div>
  );

  // チェックボックスコンポーネント
  const CheckboxField = ({ label, description, field }: {
    label: string;
    description: string;
    field: keyof FormData;
  }) => (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      cursor: 'pointer',
      background: formData[field] ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' : '#FFFFFF',
      transition: 'all 0.2s ease',
    }}>
      <div>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{label}</span>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{description}</p>
      </div>
      <input 
        type="checkbox" 
        checked={formData[field] as boolean}
        onChange={(e) => handleInputChange(field, e.target.checked)}
        style={{ width: '20px', height: '20px', accentColor: '#3B82F6' }} 
      />
    </label>
  );

  // ラジオボタンコンポーネント（通常）
  const RadioGroup = ({ label, field, options, required = false }: {
    label: string;
    field: keyof FormData;
    options: { value: string; label: string; description?: string }[];
    required?: boolean;
  }) => (
    <div style={{ marginBottom: '4px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((option) => (
          <label 
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              border: formData[field] === option.value ? '2px solid #3B82F6' : '1px solid #E5E7EB',
              borderRadius: '12px',
              cursor: 'pointer',
              background: formData[field] === option.value ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' : '#FFFFFF',
              transition: 'all 0.2s ease',
            }}
          >
            <input 
              type="radio"
              name={field}
              value={option.value}
              checked={formData[field] === option.value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              style={{ 
                width: '20px', 
                height: '20px', 
                accentColor: '#3B82F6',
                marginTop: '2px',
              }} 
            />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{option.label}</span>
              {option.description && (
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  // カード型排他選択（チェックボックス風だが1つのみ選択可能）
  const CardRadioGroup = ({ label, field, options, required = false }: {
    label: string;
    field: keyof FormData;
    options: { value: string; label: string; description: string; icon?: React.ReactNode }[];
    required?: boolean;
  }) => (
    <div style={{ marginBottom: '4px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((option) => {
          const isSelected = formData[field] === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange(field, option.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                border: isSelected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
                borderRadius: '14px',
                cursor: 'pointer',
                background: isSelected 
                  ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' 
                  : '#FFFFFF',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {option.icon && (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isSelected ? '#3B82F6' : '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#FFFFFF' : '#6B7280',
                    transition: 'all 0.2s ease',
                  }}>
                    {option.icon}
                  </div>
                )}
                <div>
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    color: isSelected ? '#1E40AF' : '#111827',
                    display: 'block',
                  }}>
                    {option.label}
                  </span>
                  <span style={{ 
                    fontSize: '13px', 
                    color: isSelected ? '#3B82F6' : '#6B7280',
                    marginTop: '2px',
                    display: 'block',
                  }}>
                    {option.description}
                  </span>
                </div>
              </div>
              {/* チェックボックス風のインジケータ */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: isSelected ? 'none' : '2px solid #D1D5DB',
                background: isSelected ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none',
              }}>
                {isSelected && <Check style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const SectionHeader = ({ section, isComplete }: { section: typeof SECTIONS[0], isComplete: boolean }) => (
    <div style={{
      padding: '20px 24px',
      borderBottom: '1px solid #F3F4F6',
      background: `linear-gradient(135deg, ${section.bgColor}40 0%, #FFFFFF 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${section.bgColor} 0%, ${section.color}20 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${section.color}30`,
        }}>
          <section.icon style={{ width: '24px', height: '24px', color: section.color }} />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>{section.label}</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
            {section.requiredFields.length > 0 ? `必須項目: ${section.requiredFields.length}件` : '任意設定'}
          </p>
        </div>
      </div>
      {isComplete && (
        <span style={{
          padding: '6px 14px',
          background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
          color: '#059669',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Check style={{ width: '14px', height: '14px' }} /> 入力完了
        </span>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
      paddingBottom: '120px',
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
               <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>アカウント設定</h1>
               <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>入力パターン集</p>
             </div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             <div style={{ textAlign: 'right' }}>
               <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>入力完了率</p>
               <p style={{ fontSize: '28px', fontWeight: 700, color: '#3B82F6', margin: 0, lineHeight: 1.2 }}>{Math.round(completionRate)}%</p>
             </div>
             <div style={{ width: '120px', height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{
                   height: '100%',
                   background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
                   borderRadius: '4px',
                   width: `${completionRate}%`,
                   transition: 'width 0.5s ease',
                 }} />
             </div>
         </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
          
          {/* サイドバー */}
          <nav style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px' }}>
             <div style={{ ...cardStyle, padding: '20px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
               <p style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', paddingLeft: '8px' }}>セクション</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                   {SECTIONS.map((section) => {
                       const Icon = section.icon;
                       const isComplete = isSectionComplete(section.id);
                       const isActive = activeSection === section.id;
                       return (
                          <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 14px',
                                fontSize: '14px',
                                fontWeight: 500,
                                borderRadius: '14px',
                                border: 'none',
                                cursor: 'pointer',
                                background: isActive ? `linear-gradient(135deg, ${section.bgColor} 0%, ${section.color}15 100%)` : 'transparent',
                                color: isActive ? section.color : '#4B5563',
                                boxShadow: isActive ? `0 4px 12px ${section.color}20` : 'none',
                                transition: 'all 0.2s ease',
                              }}
                          >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: isActive ? section.bgColor : '#F3F4F6',
                                }}>
                                  <Icon style={{ width: '18px', height: '18px', color: isActive ? section.color : '#9CA3AF' }} />
                                </div>
                                <span>{section.label}</span>
                              </div>
                              {isComplete ? (
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check style={{ width: '14px', height: '14px', color: '#059669' }} />
                                </div>
                              ) : section.requiredFields.length > 0 ? (
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <AlertCircle style={{ width: '14px', height: '14px', color: '#D97706' }} />
                                </div>
                              ) : null}
                          </button>
                       );
                   })}
               </div>
             </div>
          </nav>

          {/* メインコンテンツ */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* セクション 1: 基本情報 */}
              <section id="basic" ref={el => { sectionRefs.current['basic'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[0]} isComplete={isSectionComplete('basic')} />
                      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <InputField label="姓" field="lastName" required />
                          <InputField label="名" field="firstName" required />
                          <InputField label="メールアドレス" field="email" type="email" required />
                          <InputField label="電話番号" field="phone" type="tel" />
                          <div style={{ gridColumn: 'span 2' }}>
                            <InputField label="住所" field="address" />
                          </div>
                          <div style={{ gridColumn: 'span 2' }}>
                              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>自己紹介</label>
                              <textarea 
                                rows={3} 
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                style={{ ...inputStyle, resize: 'none' }}
                              />
                          </div>
                      </div>
                  </div>
              </section>

              {/* セクション 2: アカウント設定（パスワード・ラジオボタン） */}
              <section id="account" ref={el => { sectionRefs.current['account'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[1]} isComplete={isSectionComplete('account')} />
                      <div style={{ padding: '24px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <PasswordField 
                              label="パスワード" 
                              field="password" 
                              showPasswordState={showPassword}
                              setShowPasswordState={setShowPassword}
                              required 
                            />
                            <PasswordField 
                              label="パスワード（確認）" 
                              field="confirmPassword" 
                              showPasswordState={showConfirmPassword}
                              setShowPasswordState={setShowConfirmPassword}
                            />
                          </div>
                          
                          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '24px' }}>
                            <RadioGroup 
                              label="アカウントタイプ"
                              field="accountType"
                              required
                              options={[
                                { value: 'free', label: '無料プラン', description: '基本機能のみ利用可能。広告が表示されます。' },
                                { value: 'standard', label: 'スタンダードプラン', description: 'すべての機能が利用可能。月額 ¥980' },
                                { value: 'premium', label: 'プレミアムプラン', description: '優先サポート + 高度な分析機能。月額 ¥2,980' },
                              ]}
                            />
                          </div>
                      </div>
                  </div>
              </section>

              {/* セクション 3: 会社詳細 */}
              <section id="company" ref={el => { sectionRefs.current['company'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[2]} isComplete={isSectionComplete('company')} />
                      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <InputField label="会社名" field="companyName" required />
                          <InputField label="部署名" field="department" required />
                          <InputField label="役職" field="position" />
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>従業員数</label>
                            <select 
                              value={formData.employeeCount}
                              onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                              style={inputStyle}
                            >
                              <option value="1-10名">1-10名</option>
                              <option value="11-50名">11-50名</option>
                              <option value="51-200名">51-200名</option>
                              <option value="201-500名">201-500名</option>
                              <option value="501名以上">501名以上</option>
                            </select>
                          </div>
                      </div>
                  </div>
              </section>

              {/* セクション 4: 請求・支払い */}
              <section id="billing" ref={el => { sectionRefs.current['billing'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[3]} isComplete={isSectionComplete('billing')} />
                      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <InputField label="カード番号" field="cardNumber" required />
                          <InputField label="有効期限" field="cardExpiry" placeholder="MM/YY" required />
                          <InputField label="カード名義人" field="cardName" required />
                          <InputField label="請求先メール" field="billingEmail" type="email" />
                      </div>
                  </div>
              </section>

              {/* セクション 5: 外部連携 */}
              <section id="integrations" ref={el => { sectionRefs.current['integrations'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[4]} isComplete={isSectionComplete('integrations')} />
                      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          {[
                            { name: 'Google', field: 'googleConnected' as keyof FormData, color: '#EA4335' },
                            { name: 'Slack', field: 'slackConnected' as keyof FormData, color: '#4A154B' },
                            { name: 'GitHub', field: 'githubConnected' as keyof FormData, color: '#24292E' },
                            { name: 'Microsoft Teams', field: 'teamsConnected' as keyof FormData, color: '#5059C9' },
                          ].map((service) => (
                              <div key={service.name} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '16px',
                                background: formData[service.field] ? `${service.color}08` : '#FFFFFF',
                              }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                      <div style={{
                                        width: '44px',
                                        height: '44px',
                                        background: service.color,
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '16px',
                                      }}>
                                          {service.name[0]}
                                      </div>
                                      <div>
                                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{service.name}</span>
                                          <p style={{ fontSize: '12px', color: formData[service.field] ? '#059669' : '#9CA3AF', margin: '2px 0 0 0' }}>
                                            {formData[service.field] ? '✓ 連携済み' : '未連携'}
                                          </p>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => handleInputChange(service.field, !formData[service.field])}
                                    style={{
                                      padding: '10px 18px',
                                      fontSize: '13px',
                                      fontWeight: 600,
                                      borderRadius: '10px',
                                      border: 'none',
                                      cursor: 'pointer',
                                      background: formData[service.field] ? '#FEE2E2' : '#DBEAFE',
                                      color: formData[service.field] ? '#DC2626' : '#2563EB',
                                  }}>
                                      {formData[service.field] ? '解除' : '連携する'}
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>

               {/* セクション 6: 通知設定 */}
               <section id="notifications" ref={el => { sectionRefs.current['notifications'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[5]} isComplete={isSectionComplete('notifications')} />
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <CheckboxField label="週次レポート" description="毎週月曜日にアクティビティサマリーを送信" field="weeklyReport" />
                          <CheckboxField label="新しいコメント" description="自分の投稿にコメントがついた時" field="newComments" />
                          <CheckboxField label="メンション" description="@で自分がメンションされた時" field="mentions" />
                          <CheckboxField label="セキュリティアラート" description="不審なアクティビティを検知した時" field="securityAlerts" />
                      </div>
                  </div>
              </section>

              {/* セクション 7: 同意事項（カード型排他選択） */}
              <section id="agreements" ref={el => { sectionRefs.current['agreements'] = el; }}>
                  <div style={cardStyle}>
                      <SectionHeader section={SECTIONS[6]} isComplete={isSectionComplete('agreements')} />
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                          
                          <CardRadioGroup 
                            label="利用規約への同意"
                            field="termsAgreement"
                            required
                            options={[
                              { 
                                value: 'agree', 
                                label: '同意する', 
                                description: '利用規約のすべての条項に同意します',
                                icon: <Check style={{ width: '20px', height: '20px' }} />,
                              },
                              { 
                                value: 'partial', 
                                label: '一部同意', 
                                description: '一部の条項について確認が必要です',
                                icon: <AlertCircle style={{ width: '20px', height: '20px' }} />,
                              },
                              { 
                                value: 'disagree', 
                                label: '同意しない', 
                                description: '利用規約に同意できません',
                                icon: <AlertCircle style={{ width: '20px', height: '20px' }} />,
                              },
                            ]}
                          />

                          <CardRadioGroup 
                            label="プライバシーポリシーへの同意"
                            field="privacyAgreement"
                            options={[
                              { 
                                value: 'agree', 
                                label: '同意する', 
                                description: '個人情報の取り扱いに同意します',
                                icon: <Check style={{ width: '20px', height: '20px' }} />,
                              },
                              { 
                                value: 'partial', 
                                label: '一部同意', 
                                description: '一部のデータ利用について確認が必要です',
                                icon: <AlertCircle style={{ width: '20px', height: '20px' }} />,
                              },
                              { 
                                value: 'disagree', 
                                label: '同意しない', 
                                description: 'プライバシーポリシーに同意できません',
                                icon: <AlertCircle style={{ width: '20px', height: '20px' }} />,
                              },
                            ]}
                          />

                          <CardRadioGroup 
                            label="マーケティング情報の受信"
                            field="marketingAgreement"
                            options={[
                              { 
                                value: 'agree', 
                                label: '受け取る', 
                                description: '新機能やお得な情報をメールで受け取ります',
                                icon: <Bell style={{ width: '20px', height: '20px' }} />,
                              },
                              { 
                                value: 'partial', 
                                label: '一部のみ', 
                                description: '重要なお知らせのみ受け取ります',
                                icon: <Bell style={{ width: '20px', height: '20px' }} />,
                              },
                              { 
                                value: 'disagree', 
                                label: '受け取らない', 
                                description: 'マーケティング情報は不要です',
                                icon: <Bell style={{ width: '20px', height: '20px' }} />,
                              },
                            ]}
                          />

                      </div>
                  </div>
              </section>

              {/* その他の入力パターン */}
              <section id="extras" ref={el => { sectionRefs.current['extras'] = el; }}>
                  <div style={cardStyle}>
                      <div style={{
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #F3F4F6',
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                      }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: `linear-gradient(135deg, #F1F5F9 0%, #64748B20 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 12px #64748B30`,
                              }}>
                                <Settings style={{ width: '24px', height: '24px', color: '#64748B' }} />
                              </div>
                              <div>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>その他の入力</h2>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>トグル・スライダー・日付・ファイル・数量</p>
                              </div>
                          </div>
                      </div>
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          
                          {/* トグルスイッチ */}
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>トグルスイッチ（On/Off）</label>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '16px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '12px',
                              background: formData.darkMode ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' : '#FFFFFF',
                            }}>
                              <div>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>ダークモード</span>
                                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', margin: 0 }}>画面を暗くして目の負担を軽減</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleInputChange('darkMode', !formData.darkMode)}
                                style={{
                                  width: '52px',
                                  height: '28px',
                                  borderRadius: '14px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: formData.darkMode
                                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                                    : '#D1D5DB',
                                  position: 'relative',
                                  transition: 'all 0.3s ease',
                                  boxShadow: formData.darkMode ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none',
                                }}
                              >
                                <div style={{
                                  position: 'absolute',
                                  top: '2px',
                                  left: formData.darkMode ? '26px' : '2px',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.3s ease',
                                }} />
                              </button>
                            </div>
                          </div>

                          {/* スライダー */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>フォントサイズ</label>
                              <span style={{ 
                                fontSize: '14px', 
                                fontWeight: 600, 
                                color: '#3B82F6',
                                background: '#EFF6FF',
                                padding: '2px 10px',
                                borderRadius: '6px',
                              }}>
                                {formData.fontSize}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min={12}
                              max={24}
                              value={formData.fontSize}
                              onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value))}
                              style={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '4px',
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((formData.fontSize - 12) / 12) * 100}%, #E5E7EB ${((formData.fontSize - 12) / 12) * 100}%, #E5E7EB 100%)`,
                                appearance: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                              }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>12px</span>
                              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>24px</span>
                            </div>
                          </div>

                          {/* 日付選択 (react-datepicker) */}
                          <div>
                            <label style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '14px', 
                              fontWeight: 500, 
                              color: '#374151', 
                              marginBottom: '8px' 
                            }}>
                              生年月日
                            </label>
                            <DatePicker
                              selected={formData.birthDate}
                              onChange={(date: Date | null) => setFormData(prev => ({ ...prev, birthDate: date }))}
                              locale="ja"
                              dateFormat="yyyy年MM月dd日"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              placeholderText="日付を選択..."
                              openToDate={formData.birthDate || new Date()}  // 初期値なしの場合は今日の日付を表示
                              customInput={
                                <input
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    color: '#111827',
                                    background: '#FFFFFF',
                                    outline: 'none',
                                    cursor: 'pointer',
                                  }}
                                />
                              }
                            />
                          </div>

                          {/* ファイルアップロード */}
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                              プロフィール画像
                            </label>
                            <div
                              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                              onDragLeave={() => setIsDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragOver(false);
                                const droppedFile = e.dataTransfer.files[0];
                                if (droppedFile) setUploadedFile(droppedFile);
                              }}
                              style={{
                                border: `2px dashed ${isDragOver ? '#3B82F6' : '#D1D5DB'}`,
                                borderRadius: '16px',
                                padding: '32px',
                                textAlign: 'center',
                                background: isDragOver ? '#EFF6FF' : '#F9FAFB',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                                style={{ display: 'none' }}
                                id="file-upload-extras"
                              />
                              <label htmlFor="file-upload-extras" style={{ cursor: 'pointer' }}>
                                <Upload style={{ width: '32px', height: '32px', color: '#6B7280', margin: '0 auto 12px', display: 'block' }} />
                                <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                                  <span style={{ color: '#3B82F6', fontWeight: 600 }}>クリックしてアップロード</span>
                                  またはドラッグ＆ドロップ
                                </p>
                                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                                  PNG, JPG (最大5MB)
                                </p>
                              </label>
                            </div>
                            
                            {uploadedFile && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                background: '#F3F4F6',
                                borderRadius: '10px',
                                marginTop: '12px',
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <File style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                                  <span style={{ fontSize: '14px', color: '#374151' }}>{uploadedFile.name}</span>
                                </div>
                                <button 
                                  onClick={() => setUploadedFile(null)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                >
                                  <X style={{ width: '18px', height: '18px', color: '#6B7280' }} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* 数量ステッパー */}
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                              数量
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                                disabled={formData.quantity <= 1}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '12px',
                                  border: '1px solid #E5E7EB',
                                  background: formData.quantity <= 1 ? '#F3F4F6' : '#FFFFFF',
                                  cursor: formData.quantity <= 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: formData.quantity <= 1 ? '#D1D5DB' : '#374151',
                                }}
                              >
                                <Minus style={{ width: '18px', height: '18px' }} />
                              </button>
                              
                              <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                                min={1}
                                max={99}
                                style={{
                                  width: '80px',
                                  textAlign: 'center',
                                  padding: '12px',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '12px',
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: '#111827',
                                }}
                              />
                              
                              <button
                                type="button"
                                onClick={() => handleInputChange('quantity', Math.min(99, formData.quantity + 1))}
                                disabled={formData.quantity >= 99}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '12px',
                                  border: 'none',
                                  background: formData.quantity >= 99 
                                    ? '#F3F4F6' 
                                    : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                  cursor: formData.quantity >= 99 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: formData.quantity >= 99 ? '#D1D5DB' : '#FFFFFF',
                                  boxShadow: formData.quantity >= 99 ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.3)',
                                }}
                              >
                                <Plus style={{ width: '18px', height: '18px' }} />
                              </button>
                            </div>
                          </div>

                      </div>
                  </div>
              </section>

          </div>
      </div>

      {/* アクションバー */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '16px 32px',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.08)',
      }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {completionRate === 100 ? (
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                      <Check style={{ width: '24px', height: '24px', color: '#059669' }} />
                    </div>
                  ) : (
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)' }}>
                      <AlertCircle style={{ width: '24px', height: '24px', color: '#D97706' }} />
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
                      {completionRate === 100 ? 'すべて入力完了！' : '入力が必要な項目があります'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
                      {SECTIONS.filter(s => isSectionComplete(s.id)).length}/{SECTIONS.length} セクション完了
                      {formName && <span style={{ marginLeft: '8px', color: '#9CA3AF' }}>({formName})</span>}
                    </p>
                  </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link
                    href="/components/form-progress"
                    style={{ padding: '12px 20px', border: '1px solid #D1D5DB', borderRadius: '12px', background: '#FFFFFF', color: '#374151', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                  >
                      進捗一覧
                  </Link>
                  <button 
                    onClick={handleSaveForm}
                    style={{ padding: '12px 24px', border: '1px solid #10B981', borderRadius: '12px', background: '#D1FAE5', color: '#059669', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                      <Clock style={{ width: '16px', height: '16px' }} /> 一時保存
                  </button>
                  <button 
                    onClick={() => {
                      handleSaveForm();
                      setToast({ message: '保存が完了しました！', type: 'success' });
                    }}
                    style={{ padding: '12px 32px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
                  >
                      <Save style={{ width: '18px', height: '18px' }} /> 変更を保存
                  </button>
              </div>
          </div>
      </div>

      {/* トースト通知 */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 100,
          padding: '16px 24px',
          borderRadius: '12px',
          background: toast.type === 'success' ? '#10B981' : '#EF4444',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.type === 'success' ? (
            <Check style={{ width: '18px', height: '18px' }} />
          ) : (
            <AlertCircle style={{ width: '18px', height: '18px' }} />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ページコンポーネント（Suspenseでラップ）
export default function ComplexFormPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>読み込み中...</div>
      </div>
    }>
      <ComplexFormContent />
    </Suspense>
  );
}
