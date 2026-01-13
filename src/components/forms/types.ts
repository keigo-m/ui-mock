// フォーム関連の型定義
// このファイルをコピーして、プロジェクトに合わせてカスタマイズしてください

// 同意設定の型（'' = 未選択, 'agree' = 同意, 'disagree' = 不同意, 'partial' = 一部同意）
export type AgreementValue = '' | 'agree' | 'disagree' | 'partial';

// セクション定義の型
export type SectionDefinition = {
  id: string;
  label: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  color: string;
  bgColor: string;
  requiredFields: string[];
};

// カード型ラジオボタンのオプション
export type CardRadioOption = {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
};

// 通常ラジオボタンのオプション
export type RadioOption = {
  value: string;
  label: string;
};

// セレクトボックスのオプション
export type SelectOption = {
  value: string;
  label: string;
};
