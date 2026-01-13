"use client";

import Link from "next/link";
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function FormsPage() {
  // フォームの状態（State）を一元管理します。
  // 初期値として、空文字やfalseを設定しています。
  const [formData, setFormData] = useState({
    name: '',           // 名前
    email: '',          // メールアドレス
    department: '',     // 部署
    notifications: false, // 通知を受け取るか
  });
  
  // バリデーションエラーのメッセージを保持するStateです。
  // キーはフィールド名、値はエラーメッセージです。
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // 送信中かどうかを管理するフラグです。送信ボタンの無効化（二重送信防止）に使います。
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 送信成功時のメッセージ表示用フラグです。
  const [success, setSuccess] = useState(false);

  // 簡単なバリデーション（入力チェック）ロジック
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    // 名前の必須チェック: trim() で空白のみの入力を弾きます
    if (!formData.name.trim()) newErrors.name = "名前は必須です";
    
    // メールアドレスの必須＆形式チェック
    if (!formData.email.trim()) {
        newErrors.email = "メールアドレスは必須です";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        // 正規表現を使ってメールアドレスの形式を確認します
        newErrors.email = "正しい形式で入力してください";
    }
    
    // 部署の選択チェック
    if (!formData.department) newErrors.department = "部署を選択してください";

    setErrors(newErrors);
    // エラーが0個なら true（合格）を返します
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信によるページの再読み込み（デフォルトの挙動）を防ぎます
    setSuccess(false);

    // バリデーションを実行
    if (validate()) {
      setIsSubmitting(true);
      // APIコールのシミュレーション（1秒後に完了）
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        console.log("Form Submitted:", formData);
      }, 1000);
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto min-h-screen">
      <div className="mb-8">
         <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            ホームに戻る
         </Link>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">フォーム (Forms)</h1>
         <p className="text-gray-500 mt-2">状態管理、バリデーション、エラー表示を行う一般的なフォーム実装例です。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* サンプルフォーム */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">従業員登録</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* テキスト入力: 名前 */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">氏名 <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        id="name"
                        value={formData.name}
                        // 入力内容が変更されるたびにStateを更新します（Controlled Component）
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                            ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                        `}
                        placeholder="山田 太郎"
                    />
                    {/* エラーがある場合のみメッセージを表示 */}
                    {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name}</p>}
                </div>

                {/* メールアドレス入力 */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                            ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                        `}
                        placeholder="taro.yamada@example.com"
                    />
                     {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email}</p>}
                </div>

                {/* セレクトボックス: 部署 */}
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">部署 <span className="text-red-500">*</span></label>
                    <select 
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors
                             ${errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                        `}
                    >
                        <option value="">部署を選択してください...</option>
                        <option value="engineering">開発部 (Engineering)</option>
                        <option value="design">デザイン部 (Design)</option>
                        <option value="marketing">マーケティング部 (Marketing)</option>
                        <option value="sales">営業部 (Sales)</option>
                    </select>
                     {errors.department && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.department}</p>}
                </div>

                {/* チェックボックス: 通知 */}
                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="notifications"
                            type="checkbox"
                            checked={formData.notifications}
                            onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="notifications" className="font-medium text-gray-700">メール通知を受け取る</label>
                        <p className="text-gray-500">会社からのニュースやアップデートを受信します。</p>
                    </div>
                </div>

                {/* 送信ボタン */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting} // 送信中はボタンを押せないようにします
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
                            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                    >
                        {isSubmitting ? '登録処理中...' : '従業員を登録する'}
                    </button>
                </div>

                {/* 成功メッセージ */}
                {success && (
                    <div className="rounded-md bg-green-50 p-4 mt-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">登録が完了しました！</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>

        {/* 学習用：Stateの中身表示 */}
        <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">現在の State の中身</h3>
                <p className="text-xs text-gray-500 mb-2">ここを見ると、入力に合わせてデータがリアルタイムに更新されているのが分かります。</p>
                <pre className="bg-gray-900 text-gray-50 p-4 rounded-md text-xs overflow-auto font-mono">
{JSON.stringify(formData, null, 2)}
                </pre>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 mb-2">学習ポイント</h3>
                <ul className="list-disc list-inside text-sm text-indigo-800 space-y-2">
                    <li><strong>Controlled Components (制御されたコンポーネント)</strong>: 
                        <br/><span className="ml-5 text-xs">全ての入力フォーム (`input`) の `value` は、React の `useState` と紐付いています。これにより、常に最新の入力状態をプログラムで管理できます。</span>
                    </li>
                    <li><strong>バリデーション (Validation)</strong>: 
                        <br/><span className="ml-5 text-xs">送信ボタンが押されたタイミング (`submit`) で入力値をチェックしています。エラーがあれば `errors` State に保存し、画面に赤字で表示します。</span>
                    </li>
                    <li><strong>フィードバック (Feedback)</strong>: 
                        <br/><span className="ml-5 text-xs">エラー時の「赤い枠線」や送信中の「ボタン無効化」など、ユーザーに状況を伝える工夫をしています。</span>
                    </li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
}
