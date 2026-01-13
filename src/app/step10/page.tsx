"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { payments as MOCK_DATA, type Payment } from '../../data/mockData';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from '@tanstack/react-table';
import { ArrowLeft, Palette, Moon, Sun, Leaf, Heart } from 'lucide-react';

/* 
  Step 10: テーマ切り替え (Theming)
  ------------------------------------------------
  CSS Variables (Custom Properties) を使用したテーマ切り替えの実装です。
  親要素の data-theme 属性を変更することで、配下の変数が一括で切り替わります。

  重要: Tailwind CSS のクラス (bg-primary 等) はビルド時に解決されるため、
        ランタイムで CSS 変数を切り替えても反映されません。
        そのため、テーマに応じた色には `style={{ ... }}` で直接 CSS 変数を参照します。
*/

// --- Table Setup ---
const columnHelper = createColumnHelper<Payment>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    // flex で作ったバッジ。テーマの --accent カラーを使用
    cell: info => (
       <span 
         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
         style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
       >
         {info.getValue()}
       </span>
    ),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: info => <span className="font-medium font-mono">${info.getValue()}</span>,
  }),
];

const data = MOCK_DATA.slice(0, 5);

type ThemeConfig = {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
};

const THEMES: ThemeConfig[] = [
    { id: 'default', name: 'Default', icon: <Sun className="w-4 h-4"/>, description: '標準の青系テーマ' },
    { id: 'forest', name: 'Forest', icon: <Leaf className="w-4 h-4"/>, description: '落ち着いた緑系' },
    { id: 'rose', name: 'Rose', icon: <Heart className="w-4 h-4"/>, description: '華やかな赤系' },
    { id: 'night', name: 'Night', icon: <Moon className="w-4 h-4"/>, description: 'ダークモード' },
];

export default function Step10Page() {
  const [currentTheme, setCurrentTheme] = useState('default');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div 
        className="min-h-screen p-8 transition-colors duration-300 font-sans"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
        data-theme={currentTheme}
    >
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm mb-4 transition-colors hover:opacity-70"
              style={{ color: 'var(--primary)' }}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              ホームに戻る
            </Link>
            <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                    <Palette className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Step 10: テーマ切り替え</h1>
            </div>
            <p className="mt-2 opacity-70">
                CSS Variables と Tailwind CSS を組み合わせて、アプリケーション全体の配色を一瞬で切り替えます。
            </p>
        </div>

        {/* Theme Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {THEMES.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme.id)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all"
                    style={{
                        borderColor: currentTheme === theme.id ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: currentTheme === theme.id ? 'var(--accent)' : 'var(--secondary)',
                        color: currentTheme === theme.id ? 'var(--accent-foreground)' : 'var(--secondary-foreground)',
                        transform: currentTheme === theme.id ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: currentTheme === theme.id ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                    }}
                >
                    <div className="mb-2">{theme.icon}</div>
                    <span className="font-bold text-sm">{theme.name}</span>
                    <span className="text-xs opacity-70 mt-1">{theme.description}</span>
                </button>
            ))}
        </div>

        {/* Main Content Area (Theme Applied Here) */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden transition-all duration-300"
          style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
        >
            {/* Toolbar */}
            <div 
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}
            >
                <h2 className="font-semibold" style={{ color: 'var(--secondary-foreground)' }}>Transactions</h2>
                <button 
                  className="px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                    New Transaction
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead 
                      className="uppercase text-xs"
                      style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                    >
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-3 font-semibold">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, idx) => (
                            <tr 
                              key={row.id} 
                              className="transition-colors"
                              style={{
                                borderBottom: '1px solid var(--border)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--accent)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div 
              className="p-4 flex justify-between items-center text-xs"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderTop: '1px solid var(--border)',
                color: 'var(--foreground)',
                opacity: 0.6 
              }}
            >
                <span>Showing {data.length} results</span>
                <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 rounded transition-colors"
                      style={{ 
                        border: '1px solid var(--border)',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >Prev</button>
                    <button 
                      className="px-3 py-1 rounded transition-colors"
                      style={{ 
                        border: '1px solid var(--border)',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >Next</button>
                </div>
            </div>
        </div>

        {/* Current CSS Variable Values (for Learning) */}
        <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--secondary-foreground)' }}>現在のテーマカラー</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>
                    <span className="text-xs font-mono">--primary</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}></div>
                    <span className="text-xs font-mono">--secondary</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span className="text-xs font-mono">--accent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}></div>
                    <span className="text-xs font-mono">--background</span>
                </div>
            </div>
        </div>

        {/* Code Explanation */}
        <div className="mt-8 p-6 bg-slate-900 text-slate-50 rounded-xl overflow-hidden shadow-xl">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                実装の仕組み (CSS Variables)
            </h3>
            <div className="grid md:grid-cols-2 gap-8 font-mono text-sm leading-relaxed">
                <div>
                   <p className="text-slate-400 mb-2">{/* globals.css */}</p>
<pre className="text-blue-300">
{`:root {
  --primary: #3b82f6; 
  --background: #ffffff;
}

[data-theme='forest'] {
  --primary: #10b981; 
}

[data-theme='night'] {
  --background: #0f172a;
  --foreground: #f8fafc;
}`}
</pre>
                </div>
                <div>
                <p className="text-slate-400 mb-2">{/* Step10Page.tsx */}</p>
<pre className="text-yellow-300">
{`<button
  style={{
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  }}
>
  New Transaction
</button>`}
</pre>
                </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              ポイント: Tailwind の <code>bg-primary</code> はビルド時に静的なCSSになるため、ランタイムでCSS変数を切り替えても反映されません。
              動的なテーマ切り替えには <code>style=&#123;&#123; backgroundColor: &apos;var(--primary)&apos; &#125;&#125;</code> を使用します。
            </p>
        </div>

      </div>
    </div>
  );
}
