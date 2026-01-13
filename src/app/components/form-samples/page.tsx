"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Component } from 'lucide-react';
import {
  InputField,
  PasswordField,
  SelectField,
  CheckboxField,
  RadioGroup,
  CardRadioGroup,
  ToggleSwitch,
  RangeSlider,
  DatePickerField,
  NumberStepper,
  TextAreaField,
  FileUpload,
} from '@/components/forms';

// セクション定義
const SECTIONS = [
  { id: 'input', label: 'テキスト入力', num: 1 },
  { id: 'password', label: 'パスワード', num: 2 },
  { id: 'select', label: 'セレクト', num: 3 },
  { id: 'checkbox', label: 'チェックボックス', num: 4 },
  { id: 'radio', label: 'ラジオボタン', num: 5 },
  { id: 'cardradio', label: 'カードラジオ', num: 6 },
  { id: 'toggle', label: 'トグル', num: 7 },
  { id: 'slider', label: 'スライダー', num: 8 },
  { id: 'datepicker', label: '日付選択', num: 9 },
  { id: 'stepper', label: 'ステッパー', num: 10 },
  { id: 'textarea', label: 'テキストエリア', num: 11 },
  { id: 'fileupload', label: 'ファイル', num: 12 },
  { id: 'layouts', label: 'レイアウト', num: 13 },
];

export default function FormComponentsSamplePage() {
  // 各コンポーネントの状態管理
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [cardRadioValue, setCardRadioValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [numberValue, setNumberValue] = useState(1);
  const [textareaValue, setTextareaValue] = useState('');
  const [fileValue, setFileValue] = useState<File | null>(null);
  
  // Scroll Spy用状態
  const [activeSection, setActiveSection] = useState('input');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Scroll Spy ロジック
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 80;
      let currentSection = 'input';
      
      for (const section of SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerOffset + 100) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // セクションへスクロール
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  // セレクトオプション
  const selectOptions = [
    { value: 'option1', label: 'オプション 1' },
    { value: 'option2', label: 'オプション 2' },
    { value: 'option3', label: 'オプション 3' },
  ];

  // ラジオオプション
  const radioOptions = [
    { value: 'radio1', label: '選択肢 A' },
    { value: 'radio2', label: '選択肢 B' },
    { value: 'radio3', label: '選択肢 C' },
  ];

  // カードラジオオプション
  const cardRadioOptions = [
    { value: 'card1', label: 'ベーシック', description: '基本的な機能のみ' },
    { value: 'card2', label: 'スタンダード', description: '一般的な用途に最適' },
    { value: 'card3', label: 'プレミアム', description: 'すべての機能が利用可能' },
  ];

  // スタイル定義
  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const codeStyle: React.CSSProperties = {
    background: '#F3F4F6',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#6B7280',
    marginTop: '12px',
    overflowX: 'auto',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
      
      {/* ==================== Sticky Header ==================== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            href="/components"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            戻る
          </Link>
          <div style={{ width: '1px', height: '20px', background: '#E5E7EB' }} />
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Component style={{ width: '20px', height: '20px', color: '#8B5CF6' }} />
            フォームコンポーネント一覧
          </h1>
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
          📌 Sticky Header
        </div>
      </header>

      {/* メインレイアウト（サイドバー + コンテンツ） */}
      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '24px 32px 120px 32px' }}>
        
        {/* ==================== Sticky Sidebar with Scroll Spy ==================== */}
        <aside style={{
          position: 'sticky',
          top: '80px',
          alignSelf: 'flex-start',
          width: '200px',
          flexShrink: 0,
          marginRight: '32px',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', marginBottom: '12px', textTransform: 'uppercase' }}>
              📍 Scroll Spy
            </div>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: activeSection === section.id ? '#8B5CF6' : '#6B7280',
                  background: activeSection === section.id ? '#F3E8FF' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '4px',
                  fontWeight: activeSection === section.id ? 600 : 400,
                  borderLeft: activeSection === section.id ? '3px solid #8B5CF6' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ 
                  fontSize: '10px', 
                  background: activeSection === section.id ? '#8B5CF6' : '#E5E7EB',
                  color: activeSection === section.id ? '#FFFFFF' : '#9CA3AF',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  minWidth: '20px',
                  textAlign: 'center',
                }}>
                  {section.num}
                </span>
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          {/* 1. InputField */}
          <section id="input" ref={el => { sectionRefs.current['input'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>1</span>
              InputField - テキスト入力
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="名前" value={textValue} onChange={setTextValue} required />
              <InputField label="メールアドレス" value={emailValue} onChange={setEmailValue} type="email" placeholder="example@email.com" />
            </div>
            <pre style={codeStyle}>{`<InputField label="名前" value={value} onChange={setValue} required />`}</pre>
          </section>

          {/* 2. PasswordField */}
          <section id="password" ref={el => { sectionRefs.current['password'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>2</span>
              PasswordField - パスワード入力
            </div>
            <div style={{ maxWidth: '400px' }}>
              <PasswordField 
                label="パスワード" 
                value={passwordValue} 
                onChange={setPasswordValue}
                showPassword={showPassword}
                onToggleShow={() => setShowPassword(!showPassword)}
                required 
              />
            </div>
            <pre style={codeStyle}>{`<PasswordField label="パスワード" value={value} onChange={setValue} showPassword={show} onToggleShow={toggle} />`}</pre>
          </section>

          {/* 3. SelectField */}
          <section id="select" ref={el => { sectionRefs.current['select'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>3</span>
              SelectField - セレクトボックス
            </div>
            <div style={{ maxWidth: '300px' }}>
              <SelectField label="カテゴリ" value={selectValue} onChange={setSelectValue} options={selectOptions} required />
            </div>
            <pre style={codeStyle}>{`<SelectField label="カテゴリ" value={value} onChange={setValue} options={[{value, label}]} />`}</pre>
          </section>

          {/* 4. CheckboxField */}
          <section id="checkbox" ref={el => { sectionRefs.current['checkbox'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>4</span>
              CheckboxField - チェックボックス
            </div>
            <CheckboxField 
              label="メール通知を受け取る" 
              description="重要なお知らせをメールでお届けします"
              checked={checkboxValue} 
              onChange={setCheckboxValue}
            />
            <pre style={codeStyle}>{`<CheckboxField label="通知" description="説明文" checked={value} onChange={setValue} />`}</pre>
          </section>

          {/* 5. RadioGroup */}
          <section id="radio" ref={el => { sectionRefs.current['radio'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>5</span>
              RadioGroup - ラジオボタン
            </div>
            <RadioGroup label="お支払い方法" value={radioValue} onChange={setRadioValue} options={radioOptions} required />
            <pre style={codeStyle}>{`<RadioGroup label="支払い" value={value} onChange={setValue} options={[{value, label}]} />`}</pre>
          </section>

          {/* 6. CardRadioGroup */}
          <section id="cardradio" ref={el => { sectionRefs.current['cardradio'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>6</span>
              CardRadioGroup - カード型ラジオ
            </div>
            <CardRadioGroup label="プランを選択" value={cardRadioValue} onChange={setCardRadioValue} options={cardRadioOptions} required />
            <pre style={codeStyle}>{`<CardRadioGroup label="プラン" value={value} onChange={setValue} options={[{value, label, description}]} />`}</pre>
          </section>

          {/* 7. ToggleSwitch */}
          <section id="toggle" ref={el => { sectionRefs.current['toggle'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>7</span>
              ToggleSwitch - トグルスイッチ
            </div>
            <ToggleSwitch label="ダークモード" description="画面の表示をダークテーマに切り替えます" enabled={toggleValue} onToggle={setToggleValue} />
            <pre style={codeStyle}>{`<ToggleSwitch label="ダークモード" description="説明文" enabled={value} onToggle={setValue} />`}</pre>
          </section>

          {/* 8. RangeSlider */}
          <section id="slider" ref={el => { sectionRefs.current['slider'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>8</span>
              RangeSlider - スライダー
            </div>
            <RangeSlider label="フォントサイズ" value={sliderValue} onChange={setSliderValue} min={12} max={32} unit="px" />
            <pre style={codeStyle}>{`<RangeSlider label="サイズ" value={value} onChange={setValue} min={12} max={32} unit="px" />`}</pre>
          </section>

          {/* 9. DatePickerField */}
          <section id="datepicker" ref={el => { sectionRefs.current['datepicker'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>9</span>
              DatePickerField - 日付選択
            </div>
            <div style={{ maxWidth: '300px' }}>
              <DatePickerField label="生年月日" value={dateValue} onChange={setDateValue} required />
            </div>
            <pre style={codeStyle}>{`<DatePickerField label="生年月日" value={dateValue} onChange={setDateValue} required />`}</pre>
          </section>

          {/* 10. NumberStepper */}
          <section id="stepper" ref={el => { sectionRefs.current['stepper'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>10</span>
              NumberStepper - 数値ステッパー
            </div>
            <div style={{ maxWidth: '200px' }}>
              <NumberStepper label="数量" value={numberValue} onChange={setNumberValue} min={1} max={10} />
            </div>
            <pre style={codeStyle}>{`<NumberStepper label="数量" value={value} onChange={setValue} min={1} max={10} />`}</pre>
          </section>

          {/* 11. TextAreaField */}
          <section id="textarea" ref={el => { sectionRefs.current['textarea'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>11</span>
              TextAreaField - テキストエリア
            </div>
            <TextAreaField label="自己紹介" value={textareaValue} onChange={setTextareaValue} placeholder="ここに入力してください..." rows={4} maxLength={500} />
            <pre style={codeStyle}>{`<TextAreaField label="自己紹介" value={value} onChange={setValue} rows={4} maxLength={500} />`}</pre>
          </section>

          {/* 12. FileUpload */}
          <section id="fileupload" ref={el => { sectionRefs.current['fileupload'] = el; }} style={cardStyle}>
            <div style={titleStyle}>
              <span style={{ background: '#DBEAFE', color: '#3B82F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>12</span>
              FileUpload - ファイルアップロード
            </div>
            <FileUpload label="プロフィール画像" file={fileValue} onFileSelect={setFileValue} accept="image/*" maxSizeText="最大5MB (JPG, PNG)" />
            <pre style={codeStyle}>{`<FileUpload label="画像" file={file} onFileSelect={setFile} accept="image/*" />`}</pre>
          </section>

          {/* 13. レイアウトパターン説明 */}
          <section id="layouts" ref={el => { sectionRefs.current['layouts'] = el; }} style={{ ...cardStyle, background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', color: '#FFFFFF' }}>
            <div style={{ ...titleStyle, color: '#FFFFFF' }}>
              <span style={{ background: '#8B5CF6', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>13</span>
              🎨 このページで使用しているレイアウトパターン
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>📌 Sticky Header</div>
                <div style={{ fontSize: '12px', color: '#A5B4FC' }}>position: sticky; top: 0;</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>📍 Scroll Spy</div>
                <div style={{ fontSize: '12px', color: '#A5B4FC' }}>スクロール位置を検出してナビをハイライト</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>📋 Sticky Sidebar</div>
                <div style={{ fontSize: '12px', color: '#A5B4FC' }}>position: sticky; top: 80px;</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>🔘 Sticky Footer</div>
                <div style={{ fontSize: '12px', color: '#A5B4FC' }}>position: fixed; bottom: 0;</div>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ==================== Sticky Footer / Action Bar ==================== */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
          🔘 Sticky Footer / Action Bar
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            現在のセクション: <strong style={{ color: '#8B5CF6' }}>{SECTIONS.find(s => s.id === activeSection)?.label}</strong>
          </span>
          <div style={{ width: '1px', height: '24px', background: '#E5E7EB' }} />
          {/* キャンセルボタン */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              padding: '10px 20px',
              background: '#FFFFFF',
              color: '#6B7280',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
          {/* 保存ボタン */}
          <button
            onClick={() => alert('保存しました')}
            style={{
              padding: '10px 20px',
              background: '#F3F4F6',
              color: '#374151',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            保存
          </button>
          {/* 依頼ボタン */}
          <button
            onClick={() => alert('依頼を送信しました')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
            }}
          >
            依頼
          </button>
        </div>
      </footer>

    </div>
  );
}
