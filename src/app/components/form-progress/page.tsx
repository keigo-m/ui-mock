"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowLeft, Plus, Edit2, Trash2, Check, Circle, AlertCircle, ChevronDown, ChevronRight, Download, Eye, EyeOff } from 'lucide-react';
import { 
  SavedForm, 
  loadForms, 
  deleteForm, 
  saveForm,
  formatDateTime,
  WorkflowStatus,
} from '@/lib/formStorage';

// セクション定義
const SECTIONS = [
  { id: 'basic', label: '基本情報', shortLabel: '基本' },
  { id: 'account', label: 'アカウント', shortLabel: 'ｱｶｳﾝﾄ' },
  { id: 'company', label: '会社詳細', shortLabel: '会社' },
  { id: 'billing', label: '請求・支払い', shortLabel: '請求' },
  { id: 'integrations', label: '外部連携', shortLabel: '連携' },
  { id: 'notifications', label: '通知設定', shortLabel: '通知' },
  { id: 'agreements', label: '同意事項', shortLabel: '同意' },
  { id: 'extras', label: 'その他入力', shortLabel: '他' },
];

// ワークフローステータス設定
const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; bgColor: string }> = {
  'inputting': { label: '入力中', color: '#9CA3AF', bgColor: '#F3F4F6' },
  'input_complete': { label: '入力済', color: '#3B82F6', bgColor: '#DBEAFE' },
  'inspecting': { label: '検査中', color: '#F59E0B', bgColor: '#FEF3C7' },
  'analyzing': { label: '解析中', color: '#F97316', bgColor: '#FFEDD5' },
  'unconfirmed': { label: '結果未確認', color: '#8B5CF6', bgColor: '#EDE9FE' },
  'confirmed': { label: '結果確認済', color: '#10B981', bgColor: '#D1FAE5' },
};

// テーブル用データ型
type TableData = SavedForm & {
  index: number;
};

const columnHelper = createColumnHelper<TableData>();

export default function FormProgressPage() {
  const [forms, setForms] = useState<SavedForm[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sectionGroupExpanded, setSectionGroupExpanded] = useState(true);
  const [statusGroupExpanded, setStatusGroupExpanded] = useState(true);

  // フォーム一覧を読み込む
  useEffect(() => {
    const loadedForms = loadForms();
    loadedForms.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    // マイグレーション
    const migratedForms = loadedForms.map(form => ({
      ...form,
      workflowStatus: form.workflowStatus || (form.completionRate === 100 ? 'input_complete' : 'inputting') as WorkflowStatus,
      analysisStatus: form.analysisStatus || 'none',
      downloadStatus: form.downloadStatus || 'unavailable',
    }));
    
    setForms(migratedForms);
    setIsLoading(false);
  }, []);

  // テーブルデータ
  const tableData = useMemo<TableData[]>(() => 
    forms.map((form, index) => ({ ...form, index: index + 1 })),
    [forms]
  );

  // フォームを削除
  const handleDelete = (id: string) => {
    deleteForm(id);
    setForms(prev => prev.filter(f => f.id !== id));
    setDeleteTarget(null);
  };

  // ステータス変更
  const handleStatusChange = (formId: string, status: WorkflowStatus) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      const updated = { ...form, workflowStatus: status, updatedAt: new Date().toISOString() };
      saveForm(updated);
      setForms(prev => prev.map(f => f.id === formId ? updated : f));
    }
  };

  // セクショングループ表示切替
  const toggleSectionGroup = () => {
    const newExpanded = !sectionGroupExpanded;
    setSectionGroupExpanded(newExpanded);
    const newVisibility: VisibilityState = { ...columnVisibility };
    SECTIONS.forEach(s => {
      newVisibility[`section_${s.id}`] = newExpanded;
    });
    setColumnVisibility(newVisibility);
  };

  // ステータスグループ表示切替
  const toggleStatusGroup = () => {
    const newExpanded = !statusGroupExpanded;
    setStatusGroupExpanded(newExpanded);
    setColumnVisibility(prev => ({
      ...prev,
      analysisStatus: newExpanded,
      resultStatus: newExpanded,
      downloadStatus: newExpanded,
    }));
  };

  // カラム定義
  const columns = useMemo(() => [
    // 基本情報グループ
    columnHelper.accessor('index', {
      header: '#',
      cell: info => info.getValue(),
      size: 50,
    }),
    columnHelper.accessor('name', {
      header: '名前',
      cell: info => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
      size: 150,
    }),
    columnHelper.accessor('workflowStatus', {
      header: 'ステータス',
      cell: info => {
        const status = info.getValue() as WorkflowStatus;
        const config = WORKFLOW_STATUS_CONFIG[status] || WORKFLOW_STATUS_CONFIG['inputting'];
        return (
          <select
            value={status}
            onChange={(e) => handleStatusChange(info.row.original.id, e.target.value as WorkflowStatus)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              color: config.color,
              background: config.bgColor,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <option value="inputting">入力中</option>
            <option value="input_complete">入力済</option>
            <option value="inspecting">検査中</option>
            <option value="analyzing">解析中</option>
            <option value="unconfirmed">結果未確認</option>
            <option value="confirmed">結果確認済</option>
          </select>
        );
      },
      size: 110,
    }),
    columnHelper.accessor('completionRate', {
      header: '入力率',
      cell: info => {
        const rate = info.getValue() as number;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${rate}%`, height: '100%', background: rate === 100 ? '#10B981' : '#3B82F6' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>{rate}%</span>
          </div>
        );
      },
      size: 90,
    }),
    
    // セクション列（動的生成）
    ...SECTIONS.map(section => 
      columnHelper.accessor(row => row.sectionStatus[section.id], {
        id: `section_${section.id}`,
        header: section.shortLabel,
        cell: info => {
          const isComplete = info.getValue() as boolean;
          return isComplete ? (
            <Check style={{ width: '14px', height: '14px', color: '#10B981' }} />
          ) : (
            <Circle style={{ width: '14px', height: '14px', color: '#D1D5DB' }} />
          );
        },
        size: 50,
      })
    ),
    
    // ステータス列
    columnHelper.accessor('analysisStatus', {
      header: '解析',
      cell: info => {
        const status = info.getValue();
        if (status === 'none') return <span style={{ color: '#D1D5DB' }}>─</span>;
        return <span style={{ fontSize: '11px', color: status === 'final' ? '#10B981' : '#F59E0B' }}>
          {status === 'final' ? '最終' : '中間'}
        </span>;
      },
      size: 60,
    }),
    columnHelper.accessor(row => row.workflowStatus === 'confirmed' ? 'confirmed' : row.workflowStatus === 'unconfirmed' ? 'unconfirmed' : 'none', {
      id: 'resultStatus',
      header: '結果',
      cell: info => {
        const status = info.getValue();
        if (status === 'confirmed') return <Check style={{ width: '14px', height: '14px', color: '#10B981' }} />;
        if (status === 'unconfirmed') return <span style={{ fontSize: '11px', color: '#8B5CF6' }}>未確認</span>;
        return <span style={{ color: '#D1D5DB' }}>─</span>;
      },
      size: 60,
    }),
    columnHelper.accessor('downloadStatus', {
      header: 'DL',
      cell: info => {
        const status = info.getValue();
        if (status === 'downloaded') return <Check style={{ width: '14px', height: '14px', color: '#10B981' }} />;
        if (status === 'available') return <Download style={{ width: '14px', height: '14px', color: '#3B82F6' }} />;
        return <span style={{ color: '#D1D5DB' }}>─</span>;
      },
      size: 50,
    }),
    
    // 更新日時
    columnHelper.accessor('updatedAt', {
      header: '更新日時',
      cell: info => <span style={{ fontSize: '11px', color: '#6B7280' }}>{formatDateTime(info.getValue())}</span>,
      size: 130,
    }),
    
    // 操作
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: info => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Link
            href={`/components/complex-form?id=${info.row.original.id}`}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              color: '#3B82F6',
              background: '#EFF6FF',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Edit2 style={{ width: '12px', height: '12px' }} /> 編集
          </Link>
          <button
            onClick={() => setDeleteTarget(info.row.original.id)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              color: '#DC2626',
              background: '#FEE2E2',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Trash2 style={{ width: '12px', height: '12px' }} />
          </button>
        </div>
      ),
      size: 130,
    }),
  ], [forms]);

  // テーブルインスタンス
  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  // ヘッダースタイル
  const thStyle: React.CSSProperties = {
    padding: '10px 8px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 600,
    color: '#6B7280',
    borderBottom: '2px solid #E5E7EB',
    background: '#F9FAFB',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
  };

  const tdStyle: React.CSSProperties = {
    padding: '10px 8px',
    fontSize: '12px',
    color: '#374151',
    borderBottom: '1px solid #F3F4F6',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '32px',
    }}>
      {/* ヘッダー */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', marginBottom: '24px' }}>
        <Link 
          href="/components"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', marginBottom: '16px' }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          コンポーネント一覧に戻る
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>📋 入力進捗一覧</h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
              {tableData.length} 件のフォーム
            </p>
          </div>
          
          <Link
            href="/components/complex-form"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
              background: '#FFFFFF', color: '#7C3AED', borderRadius: '12px',
              textDecoration: 'none', fontWeight: 600, fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} /> 新規作成
          </Link>
        </div>
      </div>

      {/* 列グループ折りたたみコントロール */}
      <div style={{
        maxWidth: '1600px', margin: '0 auto 16px', background: '#FFFFFF',
        borderRadius: '12px', padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: '24px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>列グループ表示:</span>
        
        <button
          onClick={toggleSectionGroup}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', fontSize: '12px', fontWeight: 500,
            color: sectionGroupExpanded ? '#3B82F6' : '#9CA3AF',
            background: sectionGroupExpanded ? '#EFF6FF' : '#F3F4F6',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          {sectionGroupExpanded ? <Eye style={{ width: '14px', height: '14px' }} /> : <EyeOff style={{ width: '14px', height: '14px' }} />}
          セクション状態 ({SECTIONS.length}列)
          {sectionGroupExpanded ? <ChevronDown style={{ width: '14px', height: '14px' }} /> : <ChevronRight style={{ width: '14px', height: '14px' }} />}
        </button>
        
        <button
          onClick={toggleStatusGroup}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', fontSize: '12px', fontWeight: 500,
            color: statusGroupExpanded ? '#10B981' : '#9CA3AF',
            background: statusGroupExpanded ? '#D1FAE5' : '#F3F4F6',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          {statusGroupExpanded ? <Eye style={{ width: '14px', height: '14px' }} /> : <EyeOff style={{ width: '14px', height: '14px' }} />}
          処理状態 (3列)
          {statusGroupExpanded ? <ChevronDown style={{ width: '14px', height: '14px' }} /> : <ChevronRight style={{ width: '14px', height: '14px' }} />}
        </button>

        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF' }}>
          表示: {table.getVisibleLeafColumns().length} / {table.getAllLeafColumns().length} 列
        </div>
      </div>

      {/* テーブル */}
      <div style={{
        maxWidth: '1600px', margin: '0 auto', background: '#FFFFFF',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>読み込み中...</div>
        ) : tableData.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Circle style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 16px' }} />
            <p style={{ color: '#6B7280', margin: 0 }}>保存されたフォームはありません</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} style={{ ...thStyle, width: header.getSize() }}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} style={{ background: row.index % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={tdStyle}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', background: '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertCircle style={{ width: '24px', height: '24px', color: '#DC2626' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>削除の確認</h3>
            </div>
            <p style={{ color: '#6B7280', margin: '0 0 24px', fontSize: '14px' }}>
              このフォームを削除してもよろしいですか？
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ padding: '10px 20px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                style={{ padding: '10px 20px', background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
