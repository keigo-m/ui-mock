"use client";

import Link from "next/link";
import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, Bell, Shield } from "lucide-react";

export default function TabsPage() {
  // 現在アクティブな（選択されている）タブのIDを管理します
  const [activeTab, setActiveTab] = useState('profile');

  // タブの定義配列
  const tabs = [
    { id: 'profile', label: 'プロフィール', icon: User },
    { id: 'billing', label: '支払い設定', icon: CreditCard },
    { id: 'notifications', label: '通知設定', icon: Bell },
    { id: 'security', label: 'セキュリティ', icon: Shield },
  ];

  return (
    <div className="p-8 max-w-[1000px] mx-auto min-h-screen">
      <div className="mb-8">
         <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            ホームに戻る
         </Link>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">タブ (Tabs)</h1>
         <p className="text-gray-500 mt-2">画面遷移をせずに、表示するコンテンツを切り替えるUIコンポーネントです。</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        
        {/* --- タブのヘッダー部分 --- */}
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    // 現在のタブがこのタブかどうか判定
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            // クリック時に State を更新して表示を切り替えます
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 sm:flex-none group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors
                                ${isActive 
                                    ? 'border-blue-500 text-blue-600' // アクティブ時のスタイル
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // 非アクティブ時のスタイル
                                }
                            `}
                        >
                            <Icon className={`
                                -ml-0.5 mr-2 h-5 w-5
                                ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                            `} />
                            {tab.label}
                        </button>
                    )
                })}
            </nav>
        </div>

        {/* --- タブのコンテンツ部分 (Body) --- */}
        <div className="p-8">
            
            {/* プロフィールタブの中身 */}
            {activeTab === 'profile' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">プロフィール設定</h3>
                    <p className="mt-1 text-sm text-gray-500">公開プロフィールと自己紹介文を管理します。</p>
                    
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                                JD
                            </div>
                            <div>
                                <button className="text-sm text-blue-600 font-medium hover:text-blue-500">アイコンを変更</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 支払い設定タブの中身 */}
            {activeTab === 'billing' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">請求情報</h3>
                    <p className="mt-1 text-sm text-gray-500">クレジットカードや請求先住所を更新します。</p>

                     <div className="mt-6 border-t border-gray-100 pt-6">
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-200">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-gray-400 w-8 h-8" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Visa 末尾 4242</p>
                                    <p className="text-xs text-gray-500">有効期限 12/2026</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                デフォルト
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 通知設定タブの中身 */}
            {activeTab === 'notifications' && (
                 <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">通知設定</h3>
                    <p className="mt-1 text-sm text-gray-500">受け取る通知の種類を選択してください。</p>

                    <div className="mt-6 space-y-4">
                        {['メールダイジェスト', 'リアルタイムアラート', 'マーケティングニュース'].map(item => (
                             <div key={item} className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-700">{item}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* セキュリティタブの中身 */}
            {activeTab === 'security' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">セキュリティ</h3>
                    <p className="mt-1 text-sm text-gray-500">パスワードと2要素認証の設定を行います。</p>

                    <div className="mt-6">
                        <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium">
                            パスワードを変更
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    
      <div className="mt-12 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">学習ポイント</h3>
            <ul className="list-disc list-inside text-sm text-indigo-800 space-y-2">
                <li><strong>State による UI 切り替え</strong>: 
                    <br/><span className="ml-5 text-xs">`activeTab` の値によって、表示するコンポーネント（divブロック）を切り替えています。React では「条件付きレンダリング」と呼ばれます。</span>
                </li>
                <li><strong>スタイルの動的変更</strong>: 
                    <br/><span className="ml-5 text-xs">タブのボタン部分も `isActive` フラグを使って、選択中のタブだけ文字色を青く、下線を引くようにクラス名を出し分けています。</span>
                </li>
                <li><strong>簡単なアニメーション</strong>: 
                    <br/><span className="ml-5 text-xs">Tailwind の `animate-in fade-in` 等を使って、切り替わった瞬間にふわっと表示される演出を加えています。</span>
                </li>
            </ul>
        </div>
    </div>
  );
}
