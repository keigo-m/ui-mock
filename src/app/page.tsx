import { redirect } from 'next/navigation';

// トップページを複合フォームにリダイレクト
export default function Home() {
  redirect('/components/complex-form');
}
