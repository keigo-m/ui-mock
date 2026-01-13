// フォーム保存ユーティリティ
// LocalStorageへの保存/読み込み機能を提供

// ワークフローステータス
export type WorkflowStatus = 
  | 'inputting'      // 入力中
  | 'input_complete' // 入力済
  | 'inspecting'     // 検査中
  | 'analyzing'      // 解析中
  | 'unconfirmed'    // 結果未確認
  | 'confirmed';     // 結果確認済み

// 解析状態
export type AnalysisStatus = 'none' | 'intermediate' | 'final';

// ダウンロード状態
export type DownloadStatus = 'unavailable' | 'available' | 'downloaded';

// 保存フォームの型定義
export type SavedForm = {
  id: string;                    // 一意のID
  name: string;                  // フォーム名（例：アカウント設定 #1）
  data: Record<string, unknown>; // フォームデータ
  sectionStatus: {               // 各セクションの完了状態
    [sectionId: string]: boolean;
  };
  completionRate: number;        // 完了率（0-100）
  createdAt: string;             // 作成日時（ISO形式）
  updatedAt: string;             // 更新日時（ISO形式）
  // 拡張ステータス
  workflowStatus: WorkflowStatus;  // 全体ステータス
  analysisStatus: AnalysisStatus;  // 解析状態
  downloadStatus: DownloadStatus;  // DLステータス
};

// LocalStorageのキー
const STORAGE_KEY = 'complex-form-drafts';

/**
 * 一意のIDを生成
 */
export function generateFormId(): string {
  return `form_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 次のフォーム番号を取得（自動採番用）
 */
export function getNextFormNumber(): number {
  const forms = loadForms();
  if (forms.length === 0) return 1;
  
  // 既存のフォーム名から最大番号を取得
  const numbers = forms.map(form => {
    const match = form.name.match(/#(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });
  
  return Math.max(...numbers) + 1;
}

/**
 * 全フォームを読み込む
 */
export function loadForms(): SavedForm[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedForm[];
  } catch (error) {
    console.error('フォームの読み込みに失敗しました:', error);
    return [];
  }
}

/**
 * IDでフォームを取得
 */
export function loadFormById(id: string): SavedForm | null {
  const forms = loadForms();
  return forms.find(form => form.id === id) || null;
}

/**
 * フォームを保存（新規または更新）
 */
export function saveForm(form: SavedForm): void {
  if (typeof window === 'undefined') return;
  
  try {
    const forms = loadForms();
    const existingIndex = forms.findIndex(f => f.id === form.id);
    
    if (existingIndex >= 0) {
      // 既存フォームを更新
      forms[existingIndex] = {
        ...form,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 新規フォームを追加
      forms.push({
        ...form,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('フォームの保存に失敗しました:', error);
    throw error;
  }
}

/**
 * フォームを削除
 */
export function deleteForm(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const forms = loadForms();
    const filtered = forms.filter(form => form.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('フォームの削除に失敗しました:', error);
    throw error;
  }
}

/**
 * 日時を表示用にフォーマット
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * セクション完了状態から完了率を計算
 */
export function calculateCompletionRate(sectionStatus: { [key: string]: boolean }): number {
  const sections = Object.values(sectionStatus);
  if (sections.length === 0) return 0;
  
  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
}
