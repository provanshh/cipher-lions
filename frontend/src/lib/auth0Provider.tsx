import { Auth0Provider } from "@auth0/auth0-react";
import type { ReactNode } from "react";

interface Auth0ProviderWithConfigProps {
  children: ReactNode;
}

export function Auth0ProviderWithConfig({ children }: Auth0ProviderWithConfigProps) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    // If Auth0 is not configured yet, render children without wrapping
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
}

