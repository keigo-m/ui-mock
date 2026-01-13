"use client";

import Link from "next/link";
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Menu, 
  Search, 
  Bell, 
  User, 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown // Note: アイコンとして使用するためにインポート
} from "lucide-react";

export default function LayoutsPage() {
  // モバイル時のサイドバー開閉状態を管理します
  // true = 開いている, false = 閉じている
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // 画面全体のコンテナ: h-screen で画面の高さいっぱいに広げ、overflow-hidden で全体スクロールを止めます
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 
        --- サイドバー (左側メニュー) --- 
        - デスクトップ(md以上): `md:relative` で通常の配置。常に表示されます。
        - モバイル: `fixed` で画面に浮いて表示され、`translate-x` で出し入れのアニメーションをします。
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
      `}>
        {/* サイドバーヘッダー: ロゴなど */}
        <div className="h-16 flex items-center px-6 bg-slate-950">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
             <span className="font-bold text-xl">A</span>
           </div>
           <span className="font-bold text-lg tracking-wide">AdminPanel</span>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
           {[
             { icon: Home, label: 'ダッシュボード', active: true },
             { icon: Users, label: '顧客管理', active: false },
             { icon: BarChart2, label: 'アナリティクス', active: false },
             { icon: Settings, label: '設定', active: false },
           ].map((item) => (
             <div 
               key={item.label}
               className={`
                 flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                 ${item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                 }
               `}
             >
               <item.icon className="w-5 h-5 mr-3" />
               <span className="font-medium text-sm">{item.label}</span>
             </div>
           ))}
        </nav>

        {/* サイドバーフッター: ログアウトなど */}
        <div className="p-4 border-t border-slate-800">
           <Link href="/" className="flex items-center px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">デモ終了 (Homeへ)</span>
           </Link>
        </div>
      </aside>

      {/* 
        --- メインエリア ---
        - flex-1: サイドバー以外の残りの幅をすべて使います
        - flex-col: ヘッダー、コンテンツ、フッターを縦に積みます
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* --- ヘッダー (TOP) --- */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
           
           {/* 左側: ハンバーガーメニュー(モバイル用) & タイトル */}
           <div className="flex items-center">
              <button 
                className="md:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)} // 開閉をトグル
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 truncate">ダッシュボード概要</h1>
           </div>

           {/* 右側: 検索、通知、プロフィール */}
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="検索..." 
                   className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 transition-all"
                 />
              </div>

              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                 <Bell className="w-5 h-5" />
                 {/* 通知バッジ */}
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                 <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-700">山田 花子</p>
                    <p className="text-xs text-gray-500">管理者</p>
                 </div>
                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm cursor-pointer">
                    <User className="w-5 h-5" />
                 </div>
              </div>
           </div>
        </header>

        {/* --- コンテンツエリア (SCROLLABLE) --- */}
        {/* flex-1 と overflow-y-auto により、このエリアだけがスクロールします */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
           
           {/* 学習ポイントバナー */}
           <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-indigo-900">
              <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
                 レイアウト実装のポイント
              </h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800">
                 <li><strong>レスポンシブ・サイドバー</strong>: 画面が狭いときは隠れ、ボタンで出てくるドロワーメニューに切り替わります。</li>
                 <li><strong>独立スクロール</strong>: 
                    <br/><span className="ml-5 text-xs">`h-screen` (画面いっぱい) の中に `overflow-y-auto` なエリアを作ることで、ヘッダーとサイドバーを固定したままコンテンツだけスクロールさせています。</span>
                 </li>
                 <li><strong>Flexbox設計</strong>: 縦横の並びを `flex-row`, `flex-col` で制御し、残りの領域を `flex-1` で埋めるのが基本パターンです。</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                 <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    ホームに戻る
                 </Link>
              </div>
           </div>

           {/* ダッシュボードのコンテンツ例 */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-500 text-sm font-medium">総売上 (Total Revenue)</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">+12.5%</span>
                   </div>
                   <p className="text-2xl font-bold text-gray-900">¥4,523,100</p>
                </div>
              ))}
           </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-96 p-8 flex items-center justify-center text-gray-400">
               ここにグラフなどが入ります (Chart Placeholder)
           </div>

           {/* --- フッター --- */}
           <footer className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>&copy; 2024 Corporate UI Mockup. All rights reserved.</p>
              <div className="flex gap-6">
                 <a href="#" className="hover:text-gray-900">プライバシーポリシー</a>
                 <a href="#" className="hover:text-gray-900">利用規約</a>
                 <a href="#" className="hover:text-gray-900">サポート</a>
              </div>
           </footer>

        </main>
      </div>
      
      {/* モバイル用：サイドバーが開いている時の背景黒オーバーレイ */}
      {sidebarOpen && (
        <div 
           className="fixed inset-0 z-40 bg-gray-900/50 md:hidden backdrop-blur-sm"
           onClick={() => setSidebarOpen(false)} // 背景クリックで閉じる
        ></div>
      )}

    </div>
  );
}
