"use client";

// 再利用可能なフォームコンポーネント集
// このファイルをコピーして、プロジェクトで使用してください

import React from 'react';
import { Check, Eye, EyeOff, AlertCircle, Plus, Minus } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { inputStyle, labelStyle, selectStyle, colors } from './styles';
import type { CardRadioOption, RadioOption, SelectOption } from './types';

// 日本語ロケールを登録
registerLocale('ja', ja);

// ==========================================
// テキスト入力フィールド
// ==========================================
type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  placeholder = '' 
}) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: colors.error }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  </div>
);

// ==========================================
// パスワード入力フィールド（表示/非表示切り替え）
// ==========================================
type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  required?: boolean;
};

export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  showPassword,
  onToggleShow,
  required = false 
}) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: colors.error }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, paddingRight: '48px' }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: colors.textLight,
        }}
      >
        {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
      </button>
    </div>
  </div>
);

// ==========================================
// セレクトボックス
// ==========================================
type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
};

export const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  options,
  required = false 
}) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: colors.error }}>*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={selectStyle}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// ==========================================
// チェックボックス（カード型）
// ==========================================
type CheckboxFieldProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ 
  label, 
  description, 
  checked, 
  onChange 
}) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      border: `1px solid ${checked ? colors.primary : colors.border}`,
      borderRadius: '12px',
      cursor: 'pointer',
      background: checked ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primaryBg} 100%)` : '#FFFFFF',
      transition: 'all 0.2s ease',
    }}
  >
    <div>
      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textDark }}>{label}</span>
      <p style={{ fontSize: '12px', color: colors.textLight, marginTop: '2px', margin: 0 }}>{description}</p>
    </div>
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        border: `2px solid ${checked ? colors.primary : colors.borderInput}`,
        background: checked ? colors.primary : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      onClick={() => onChange(!checked)}
    >
      {checked && <Check style={{ width: '14px', height: '14px', color: '#FFFFFF' }} />}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ display: 'none' }}
    />
  </label>
);

// ==========================================
// ラジオボタングループ（通常）
// ==========================================
type RadioGroupProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  label, 
  value: selectedValue, 
  onChange, 
  options,
  required = false 
}) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: colors.error }}>*</span>}
    </label>
    <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
      {options.map((option) => (
        <label
          key={option.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: `2px solid ${selectedValue === option.value ? colors.primary : colors.borderInput}`,
              background: selectedValue === option.value ? colors.primary : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {selectedValue === option.value && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
            )}
          </div>
          <span style={{ fontSize: '14px', color: colors.textMedium }}>{option.label}</span>
          <input
            type="radio"
            name={label}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            style={{ display: 'none' }}
          />
        </label>
      ))}
    </div>
  </div>
);

// ==========================================
// カード型ラジオボタングループ（排他選択）
// ==========================================
type CardRadioGroupProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CardRadioOption[];
  required?: boolean;
};

export const CardRadioGroup: React.FC<CardRadioGroupProps> = ({ 
  label, 
  value: selectedValue, 
  onChange, 
  options,
  required = false 
}) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <span style={{ fontSize: '15px', fontWeight: 600, color: colors.textDark }}>{label}</span>
      {required && <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFFFFF', background: colors.error, padding: '2px 8px', borderRadius: '4px' }}>必須</span>}
      {!selectedValue && required && (
        <span style={{ fontSize: '12px', color: colors.warning, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          選択してください
        </span>
      )}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '20px',
              border: `2px solid ${isSelected ? colors.primary : colors.border}`,
              borderRadius: '16px',
              cursor: 'pointer',
              background: isSelected ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primaryBg} 100%)` : '#FFFFFF',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? `0 4px 12px ${colors.primary}30` : 'none',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? colors.primary : colors.borderInput}`,
                background: isSelected ? colors.primary : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
                transition: 'all 0.2s ease',
              }}
            >
              {isSelected && <Check style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {option.icon && (
                  <div style={{ color: isSelected ? colors.primary : colors.textLight }}>
                    {option.icon}
                  </div>
                )}
                <span style={{ 
                  fontSize: '15px', 
                  fontWeight: 600, 
                  color: isSelected ? colors.primary : colors.textDark 
                }}>
                  {option.label}
                </span>
              </div>
              <p style={{ 
                fontSize: '13px', 
                color: colors.textLight, 
                marginTop: '6px',
                margin: '6px 0 0 0',
                lineHeight: 1.5,
              }}>
                {option.description}
              </p>
            </div>
            
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              style={{ display: 'none' }}
            />
          </label>
        );
      })}
    </div>
  </div>
);

// ==========================================
// トグルスイッチ
// ==========================================
type ToggleSwitchProps = {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  description, 
  enabled, 
  onToggle 
}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    background: enabled ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primaryBg} 100%)` : '#FFFFFF',
  }}>
    <div>
      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textDark }}>{label}</span>
      {description && <p style={{ fontSize: '12px', color: colors.textLight, marginTop: '2px', margin: 0 }}>{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        background: enabled
          ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
          : colors.borderInput,
        position: 'relative',
        transition: 'all 0.3s ease',
        boxShadow: enabled ? `0 2px 8px ${colors.primary}66` : 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '2px',
        left: enabled ? '26px' : '2px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }} />
    </button>
  </div>
);

// ==========================================
// スライダー（レンジ入力）
// ==========================================
type RangeSliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
};

export const RangeSlider: React.FC<RangeSliderProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100,
  unit = '' 
}) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500, color: colors.textMedium }}>{label}</label>
      <span style={{ 
        fontSize: '14px', 
        fontWeight: 600, 
        color: colors.primary,
        background: colors.primaryLight,
        padding: '2px 10px',
        borderRadius: '6px',
      }}>
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      style={{
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${((value - min) / (max - min)) * 100}%, ${colors.border} ${((value - min) / (max - min)) * 100}%, ${colors.border} 100%)`,
        appearance: 'none',
        outline: 'none',
        cursor: 'pointer',
      }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
      <span style={{ fontSize: '12px', color: colors.textMuted }}>{min}{unit}</span>
      <span style={{ fontSize: '12px', color: colors.textMuted }}>{max}{unit}</span>
    </div>
  </div>
);

// ==========================================
// 日付選択（react-datepicker）
// ==========================================
type DatePickerFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  placeholder?: string;
};

export const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  required = false,
  placeholder = '日付を選択...' 
}) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: colors.error }}>*</span>}
    </label>
    <DatePicker
      selected={value}
      onChange={onChange}
      locale="ja"
      dateFormat="yyyy年MM月dd日"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      placeholderText={placeholder}
      openToDate={value || new Date()}
      customInput={
        <input style={inputStyle} />
      }
    />
  </div>
);

// ==========================================
// 数値ステッパー（＋/－ボタン付き）
// ==========================================
type NumberStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export const NumberStepper: React.FC<NumberStepperProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 99 
}) => (
  <div>
    <label style={{ ...labelStyle, marginBottom: '8px' }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          background: value <= min ? '#F3F4F6' : '#FFFFFF',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: value <= min ? colors.borderInput : colors.textMedium,
        }}
      >
        <Minus style={{ width: '18px', height: '18px' }} />
      </button>
      
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
        min={min}
        max={max}
        style={{
          width: '80px',
          textAlign: 'center',
          padding: '12px',
          border: `1px solid ${colors.borderInput}`,
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 600,
          color: colors.textDark,
        }}
      />
      
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: 'none',
          background: value >= max 
            ? '#F3F4F6' 
            : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          cursor: value >= max ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: value >= max ? colors.borderInput : '#FFFFFF',
          boxShadow: value >= max ? 'none' : `0 2px 8px ${colors.primary}4D`,
        }}
      >
        <Plus style={{ width: '18px', height: '18px' }} />
      </button>
    </div>
  </div>
);

// ==========================================
// テキストエリア（複数行入力）
// ==========================================
type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '',
  rows = 4,
  maxLength 
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      style={{
        ...inputStyle,
        resize: 'vertical',
        minHeight: `${rows * 24}px`,
      }}
    />
    {maxLength && (
      <div style={{ textAlign: 'right', marginTop: '4px' }}>
        <span style={{ fontSize: '12px', color: colors.textMuted }}>
          {value.length} / {maxLength}
        </span>
      </div>
    )}
  </div>
);

// ==========================================
// ファイルアップロード
// ==========================================
type FileUploadProps = {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeText?: string;
};

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  file, 
  onFileSelect, 
  accept = '*',
  maxSizeText = '最大5MB' 
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputId = React.useId();
  
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) onFileSelect(droppedFile);
        }}
        style={{
          border: `2px dashed ${isDragOver ? colors.primary : colors.borderInput}`,
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          background: isDragOver ? colors.primaryLight : '#F9FAFB',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
          id={inputId}
        />
        <label htmlFor={inputId} style={{ cursor: 'pointer' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            margin: '0 auto 12px', 
            background: colors.primaryLight, 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p style={{ fontSize: '14px', color: colors.textMedium, margin: 0 }}>
            <span style={{ color: colors.primary, fontWeight: 600 }}>クリックしてアップロード</span>
            またはドラッグ＆ドロップ
          </p>
          <p style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>
            {maxSizeText}
          </p>
        </label>
      </div>
      
      {file && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#F3F4F6',
          borderRadius: '10px',
          marginTop: '12px',
        }}>
          <span style={{ fontSize: '14px', color: colors.textMedium }}>{file.name}</span>
          <button 
            onClick={() => onFileSelect(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
