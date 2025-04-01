import Link from 'next/link';
export default function Home() {
  return (
    <div>
      Hello World
      <Link href='/login'>login</Link>
      <Link href='/registration'>register</Link>
      <Link href='/reset-password/token'>password</Link>
      <Link href='/service'>service</Link>
    </div>
  );
}
