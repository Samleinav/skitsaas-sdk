import type { ComponentType, ReactNode } from 'react';
import type { ModuleEventHandler } from '../events/types';
import type { ModuleMessagesByArea } from '../i18n/types';
export type ModuleArea = 'admin' | 'dashboard' | 'api';
export type ModuleNavArea = 'admin' | 'dashboard';
export type ModuleNavItem = {
    id: string;
    href: string;
    label: string;
    description?: string;
    order?: number;
    exact?: boolean;
};
export type ModuleWidgetDefinition<Props = unknown> = {
    id: string;
    Component: ComponentType<Props>;
    order?: number;
};
export type ModuleRouteContext = {
    moduleId: string;
    slug: string[];
    searchParams?: Record<string, string | string[] | undefined>;
};
export type ModulePageHandler = (context: ModuleRouteContext) => Promise<ReactNode | null> | ReactNode | null;
export type ModuleApiHandler = (request: Request, context: ModuleRouteContext) => Promise<Response>;
export type ModuleManifest = {
    moduleId: string;
    version: string;
    displayName: string;
    description?: string;
    i18n?: ModuleMessagesByArea;
    adminNavItems?: ModuleNavItem[];
    dashboardNavItems?: ModuleNavItem[];
    adminDashboardWidgets?: ModuleWidgetDefinition<unknown>[];
    dashboardWidgets?: ModuleWidgetDefinition<unknown>[];
    adminPage?: ModulePageHandler;
    dashboardPage?: ModulePageHandler;
    apiHandler?: ModuleApiHandler;
    eventHandlers?: ModuleEventHandler[];
};
export declare function defineModule(manifest: ModuleManifest): ModuleManifest;
export declare function validateModuleManifest(manifest: ModuleManifest): string[];
