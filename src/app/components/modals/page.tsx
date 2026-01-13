"use client";

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, AlertTriangle, Info } from "lucide-react";

export default function ModalsPage() {
  // どのモーダルが開いているかを管理するState
  // 'basic' | 'destructive' | null (開いていない)
  const [openModal, setOpenModal] = useState<string | null>(null);

  // Escキーで閉じる処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenModal(null);
    };
    // 画面全体にキーボードイベントを監視させます
    window.addEventListener('keydown', handleKeyDown);
    
    // コンポーネントが画面から消える（Unmount）時に監視を解除します（メモリリーク防止）
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="p-8 max-w-[1000px] mx-auto min-h-screen">
      <div className="mb-8">
         <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            ホームに戻る
         </Link>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">モーダル (Modals)</h1>
         <p className="text-gray-500 mt-2">ユーザーの操作を一時的に中断し、重要な情報を伝えたり入力を求めたりするダイアログです。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 通常のモーダルを開くボタン */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-blue-50 rounded-full mb-4">
                <Info className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">通常モーダル (Basic)</h2>
            <p className="text-gray-500 mb-6">情報表示や簡単なフォーム入力に使用します。</p>
            <button
                onClick={() => setOpenModal('basic')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm font-medium"
            >
                モーダルを開く
            </button>
        </div>

        {/* 警告モーダルを開くボタン */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-red-50 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">警告モーダル (Destructive)</h2>
            <p className="text-gray-500 mb-6">データ削除など、取り消せない操作の確認に使用します。</p>
            <button
                onClick={() => setOpenModal('destructive')}
                className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition shadow-sm font-medium"
            >
                削除処理を実行...
            </button>
        </div>

      </div>

      {/* --- モーダル本体の実装 (条件付きレンダリング) --- */}

      {/* 1. 通常モーダル */}
      {openModal === 'basic' && (
        // z-50 で他の要素より手前に表示します
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
            {/* 背景 (Backdrop): これがあることで後ろのコンテンツがクリックできないことを示します */}
            <div 
                className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm transition-opacity" 
                onClick={() => setOpenModal(null)} // 背景クリックでも閉じるようにします
            ></div>

            {/* モーダルの中身 (Panel) */}
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl transition-all sm:my-8 scale-100 opacity-100">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">プロジェクト仕様書</h3>
                    {/* 閉じるボタン (X) */}
                    <button onClick={() => setOpenModal(null)} className="text-gray-400 hover:text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        現在のプロジェクト設定の詳細は以下の通りです。管理者権限があれば設定パネルから変更可能です。
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
                        <li className="flex justify-between"><span>ステータス:</span> <span className="font-medium">稼働中 (Active)</span></li>
                        <li className="flex justify-between"><span>バージョン:</span> <span className="font-medium">v2.4.0</span></li>
                        <li className="flex justify-between"><span>リージョン:</span> <span className="font-medium">ap-northeast-1 (Tokyo)</span></li>
                    </ul>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setOpenModal(null)}
                    >
                        閉じる
                    </button>
                    <button
                        type="button"
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        onClick={() => setOpenModal(null)}
                    >
                        確認しました
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 2. 警告モーダル (削除確認など) */}
      {openModal === 'destructive' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
             {/* 背景 */}
             <div 
                className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm transition-opacity" 
                onClick={() => setOpenModal(null)}
            ></div>

            {/* パネル */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl transition-all sm:my-8">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">アカウントを停止しますか？</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                本当にアカウントを停止してもよろしいですか？この操作は取り消すことができず、すべてのデータが削除されます。
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={() => {
                            alert("アカウントを削除しました");
                            setOpenModal(null);
                        }}
                    >
                        停止する
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpenModal(null)}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
      )}

       <div className="mt-12 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">学習ポイント</h3>
            <ul className="list-disc list-inside text-sm text-indigo-800 space-y-2">
                <li><strong>レイヤー (Layering)</strong>: `fixed inset-0 z-50` を使うことで、画面のスクロールに関係なく最前面に表示させています。</li>
                <li><strong>バックドロップ (Backdrop)</strong>: 半透明の黒い背景を敷くことで、ユーザーの注意を中央のダイアログに向けさせます。</li>
                <li><strong>配置 (Positioning)</strong>: Flexbox (`flex items-center justify-center`) を使って画面中央に配置しています。</li>
                <li><strong>アクセシビリティ</strong>: 
                    <br/><span className="ml-5 text-xs">`ESC` キーで閉じられるようにしたり、背景クリックで閉じられるようにするのは、使いやすいモーダルの必須条件です。</span>
                </li>
            </ul>
        </div>
    </div>
  );
}
