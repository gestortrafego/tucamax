import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço que você procura não existe ou foi movido.
        </p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em instantes.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tucamax — Velocidade que voa alto" },
      { name: "description", content: "Inteligência comercial B2B: busque, filtre, enriqueça e organize empresas brasileiras por CNPJ, segmento e mais." },
      { property: "og:title", content: "Tucamax — Velocidade que voa alto" },
      { property: "og:description", content: "Inteligência comercial B2B: busque, filtre, enriqueça e organize empresas brasileiras por CNPJ, segmento e mais." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Tucamax — Velocidade que voa alto" },
      { name: "twitter:description", content: "Inteligência comercial B2B: busque, filtre, enriqueça e organize empresas brasileiras por CNPJ, segmento e mais." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/378a4207-61ca-4aec-be7e-5b0db6a04742/id-preview-2a6175fa--64a46952-1962-423d-8680-aff323457e62.lovable.app-1779580344520.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/378a4207-61ca-4aec-be7e-5b0db6a04742/id-preview-2a6175fa--64a46952-1962-423d-8680-aff323457e62.lovable.app-1779580344520.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
