"use client";

import Link from "next/link";
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

// トースト通知のデータ型定義
type Toast = {
    id: number;
    type: 'success' | 'error' | 'info'; // 成功、失敗、情報
    title: string;   // タイトル
    message: string; // 本文
};

export default function ToastsPage() {
  // 複数のトーストを管理するために配列で State を持ちます
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type']) => {
    // ユニークなIDとして現在時刻ミリ秒を使用（簡易的ですが実用的です）
    const id = Date.now();
    
    // タイプに応じたメッセージ定義
    const titles = {
        success: '保存しました',
        error: '接続エラー',
        info: 'アップデート'
    };
    const messages = {
        success: '変更内容がデータベースに保存されました。',
        error: 'サーバーに接続できませんでした。再試行してください。',
        info: '新しいバージョンのアプリケーションが利用可能です。'
    };

    const newToast: Toast = {
        id,
        type,
        title: titles[type],
        message: messages[type]
    };

    // 新しいトーストを配列に追加
    setToasts(prev => [...prev, newToast]);

    // 4秒後に自動的に消えるようにタイマーをセット
    setTimeout(() => {
        removeToast(id);
    }, 4000);
  };

  // 指定したIDのトーストを配列から削除する関数
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto min-h-screen">
      <div className="mb-8">
         <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            ホームに戻る
         </Link>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">トースト通知 (Toasts)</h1>
         <p className="text-gray-500 mt-2">ユーザーの操作結果を一時的に画面隅に表示する通知UIです。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
            onClick={() => addToast('success')}
            className="p-6 bg-white border border-green-200 rounded-xl shadow-sm hover:shadow-md transition text-left group"
        >
            <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-900 group-hover:text-green-700">成功 (Success)</h3>
            </div>
            <p className="text-sm text-gray-500">緑色のポジティブな完了メッセージを表示します。</p>
        </button>

        <button
            onClick={() => addToast('error')}
            className="p-6 bg-white border border-red-200 rounded-xl shadow-sm hover:shadow-md transition text-left group"
        >
            <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-500" />
                <h3 className="font-semibold text-gray-900 group-hover:text-red-700">エラー (Error)</h3>
            </div>
            <p className="text-sm text-gray-500">赤色のネガティブな失敗メッセージを表示します。</p>
        </button>

        <button
            onClick={() => addToast('info')}
            className="p-6 bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition text-left group"
        >
            <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">情報 (Info)</h3>
            </div>
            <p className="text-sm text-gray-500">青色のニュートラルなお知らせを表示します。</p>
        </button>
      </div>

      <div className="mt-12 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">学習ポイント</h3>
            <ul className="list-disc list-inside text-sm text-indigo-800 space-y-2">
                <li><strong>固定配置コンテナ (Fixed Container)</strong>: 
                    <br/><span className="ml-5 text-xs">トーストを表示する場所は `fixed top-4 right-4` で画面右上に固定しています。通常の文書フローからは独立しています。</span>
                </li>
                <li><strong>スタッキング (Stacking)</strong>: 
                    <br/><span className="ml-5 text-xs">`toasts.map(...)` を使って配列の中身を全てレンダリングすることで、通知が来た順に積み重なって表示されます。</span>
                </li>
                <li><strong>自動消去 (Auto Dismiss)</strong>: 
                    <br/><span className="ml-5 text-xs">`setTimeout` を使い、追加されてから数秒後に自動的に `removeToast` を呼び出して消しています。</span>
                </li>
            </ul>
        </div>


      {/* --- トーストを表示するコンテナ --- */}
      {/* pointer-events-none にすることで、トーストがない部分はクリックが奥に透過するようにします */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
             <div 
                key={toast.id}
                // トースト自体は pointer-events-auto にして、閉じるボタン等が押せるようにします
                className={`
                    pointer-events-auto w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all animate-in slide-in-from-right-full
                    ${toast.type === 'success' ? 'border-l-4 border-green-500' : ''}
                    ${toast.type === 'error' ? 'border-l-4 border-red-500' : ''}
                    ${toast.type === 'info' ? 'border-l-4 border-blue-500' : ''}
                `}
            >
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
                            {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
                            {toast.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-400" />}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                            <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                        </div>
                        <div className="ml-4 flex flex-shrink-0">
                            <button
                                type="button"
                                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => removeToast(toast.id)}
                            >
                                <span className="sr-only">閉じる</span>
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
}
