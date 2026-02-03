"use client";

import { Component, ReactNode } from "react";
import { Alert, Button } from "flowbite-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4">
          <Alert color="failure">
            <div className="flex flex-col gap-2">
              <span className="font-medium">Something went wrong</span>
              <span className="text-sm">
                {this.state.error?.message || "An unexpected error occurred"}
              </span>
              <Button size="sm" onClick={this.handleRetry}>
                Try again
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
