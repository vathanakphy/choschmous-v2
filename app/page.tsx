import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { Button } from '@/ui/design-system/primitives/Button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">Choschmous</h1>
        <p className="text-muted-foreground mt-3 text-lg">Sports Registration Management System</p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href={ROUTES.AUTH.LOGIN}>Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.PUBLIC.SURVEY}>Survey</Link>
        </Button>
      </div>
    </main>
  );
}
