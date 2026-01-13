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
import { ArrowLeft, Check } from 'lucide-react';

/* 
  Step 9: スタイリング実験室 (Styling Playground)
  ------------------------------------------------
  Tailwind CSS のクラスをインタラクティブに切り替えて、
  テーブルの見た目がどう変わるかを学習するためのページです。
*/

const columnHelper = createColumnHelper<Payment>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: info => `$${info.getValue()}`,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: info => info.getValue(),
  }),
];

// 表示するデータは少なめにします
const data = MOCK_DATA.slice(0, 5);

export default function Step9Page() {
  // --- スタイル制御用の State ---
  const [styles, setStyles] = useState({
     rounded: true,      // 角丸 (rounded-xl)
     shadow: true,       // 影 (shadow-sm)
     striped: false,     // 縞模様 (even:bg-gray-50)
     borders: true,      // 枠線 (divide-y)
     hover: true,        // ホバー効果 (hover:bg-gray-50)
     headerBg: true,     // ヘッダー背景 (bg-gray-50)
     dense: false,       // 密度 (p-2 vs p-4)
  });

  const toggleStyle = (key: keyof typeof styles) => {
      setStyles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen font-sans text-gray-900">
      
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          ホームに戻る
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Step 9: スタイリング実験室</h1>
        <p className="text-gray-500 mt-2">Tailwind CSS のクラスを切り替えて、デザインの変化を観察しましょう。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* --- コントロールパネル (左側) --- */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 lg:col-span-1">
             <div>
                 <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    スタイル設定
                 </h3>
                 <div className="space-y-3">
                     {/* Density Toggle */}
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.dense ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.dense && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.dense} onChange={() => toggleStyle('dense')} />
                        <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">高密度 (Dense)</span>
                            <p className="text-xs text-gray-400">padding check</p>
                        </div>
                     </label>

                     <hr className="border-gray-100" />

                     {/* Rounded Toggle */}
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.rounded ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.rounded && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.rounded} onChange={() => toggleStyle('rounded')} />
                         <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">角丸 (Rounded)</span>
                            <p className="text-xs text-gray-400">rounded-xl</p>
                        </div>
                     </label>

                     {/* Shadow Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.shadow ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.shadow && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.shadow} onChange={() => toggleStyle('shadow')} />
                        <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">影 (Shadow)</span>
                            <p className="text-xs text-gray-400">shadow-sm</p>
                        </div>
                     </label>

                     {/* Striped Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.striped ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.striped && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.striped} onChange={() => toggleStyle('striped')} />
                        <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">縞模様 (Striped)</span>
                            <p className="text-xs text-gray-400">even:bg-gray-50</p>
                        </div>
                     </label>

                     {/* Borders Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.borders ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.borders && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.borders} onChange={() => toggleStyle('borders')} />
                        <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">枠線 (Divider)</span>
                            <p className="text-xs text-gray-400">divide-y</p>
                        </div>
                     </label>
                    
                    {/* Hover Toggle */}
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.hover ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.hover && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.hover} onChange={() => toggleStyle('hover')} />
                        <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">ホバー効果</span>
                            <p className="text-xs text-gray-400">hover:bg-gray-...</p>
                        </div>
                     </label>

                     {/* Header Bg Toggle */}
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${styles.headerBg ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {styles.headerBg && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={styles.headerBg} onChange={() => toggleStyle('headerBg')} />
                        <div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">ヘッダー背景</span>
                            <p className="text-xs text-gray-400">bg-gray-50</p>
                        </div>
                     </label>

                 </div>
             </div>

             <div className="bg-gray-50 p-4 rounded text-xs text-gray-500 font-mono">
                 <p className="mb-1 font-bold text-gray-700">Applied Classes (Outer):</p>
                 <div className="break-all">
                     border border-gray-200 overflow-hidden<br/>
                     {styles.rounded && 'rounded-xl '}<br/>
                     {styles.shadow && 'shadow-sm '}
                 </div>
             </div>
          </div>

          {/* --- プレビューエリア (右側) --- */}
          <div className="lg:col-span-3 space-y-6">
              
              <div className={`
                 w-full border border-gray-200 overflow-hidden transition-all duration-300
                 ${styles.rounded ? 'rounded-xl' : ''}
                 ${styles.shadow ? 'shadow-sm' : ''}
              `}>
                <table className={`w-full text-left text-sm text-gray-500 ${styles.borders ? 'divide-y divide-gray-200' : ''}`}>
                    <thead className={`
                        text-xs text-gray-700 uppercase
                        ${styles.headerBg ? 'bg-gray-50' : 'bg-white'}
                    `}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className={`font-semibold ${styles.dense ? 'px-4 py-2' : 'px-6 py-3'}`}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className={`bg-white ${styles.borders ? 'divide-y divide-gray-200' : ''}`}>
                        {table.getRowModel().rows.map(row => (
                            <tr 
                                key={row.id} 
                                className={`
                                    transition-colors
                                    ${styles.striped ? 'even:bg-gray-50' : ''}
                                    ${styles.hover ? 'hover:bg-blue-50 cursor-pointer' : ''}
                                `}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={`whitespace-nowrap text-gray-900 ${styles.dense ? 'px-4 py-2' : 'px-6 py-4'}`}>
                                        {cell.column.id === 'status' ? (
                                            // ステータスだけバッジスタイルにする例
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${cell.getValue() === 'success' ? 'bg-green-100 text-green-800' : 
                                                  cell.getValue() === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                                                  'bg-gray-100 text-gray-800'}
                                            `}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </span>
                                        ) : (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                 <h2 className="text-lg font-bold text-indigo-900 mb-2">デザインのヒント</h2>
                 <ul className="list-disc list-inside space-y-2 text-sm text-indigo-800">
                     <li>
                         <strong>情報密度 (Density)</strong>: <br/>
                         多くの情報を一度に見せたい管理画面では `p-2` などの狭いパディングが好まれますが、一般的なリストでは `p-4` 程度が読みやすいです。
                     </li>
                     <li>
                         <strong>視線の誘導 (Striped vs Borders)</strong>: <br/>
                         横に長いデータの場合、`even:bg-gray-50` (縞模様) があると行を追いやすくなります。一方で、シンプルなリストなら `divide-y` (枠線) だけの方がスッキリします。
                     </li>
                     <li>
                         <strong>コンテナ (Container)</strong>: <br/>
                         テーブル自体を `rounded-xl border shadow-sm` で囲むと、ページ背景から独立した「カード」のように見え、現代的な UI になります。
                     </li>
                 </ul>
              </div>

          </div>
      </div>
    </div>
  );
}
