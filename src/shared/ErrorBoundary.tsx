import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error(error, info.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app-shell">
          <section className="empty-state" role="alert">
            VectorForge Studio hit an unexpected rendering error. Refresh the
            page to recover the editor state from local storage.
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
