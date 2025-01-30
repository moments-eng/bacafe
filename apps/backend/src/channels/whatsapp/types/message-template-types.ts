export type TemplateCategory = 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
export type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED' | 'PENDING_DELETION';
export type TemplateLanguage = string; // e.g., 'en_US', 'es_ES', etc.

export type ComponentType = 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
export type HeaderFormat = 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LOCATION';
export type ButtonType = 'PHONE_NUMBER' | 'URL' | 'QUICK_REPLY' | 'COPY_CODE' | 'MPM' | 'CATALOG' | 'OTP';

export interface BaseComponent {
  type: ComponentType;
}

export interface HeaderComponent extends BaseComponent {
  type: 'HEADER';
  format: HeaderFormat;
  text?: string;
  example?: {
    header_handle?: string[];
    header_text?: string[];
  };
}

export interface BodyComponent extends BaseComponent {
  type: 'BODY';
  text: string;
  example?: {
    body_text: string[][];
  };
}

export interface FooterComponent extends BaseComponent {
  type: 'FOOTER';
  text: string;
}

export interface ButtonComponent extends BaseComponent {
  type: 'BUTTONS';
  buttons: Button[];
}

export type Button =
  | PhoneNumberButton
  | URLButton
  | QuickReplyButton
  | CopyCodeButton
  | MPMButton
  | CatalogButton
  | OTPButton;

export interface BaseButton {
  type: ButtonType;
  text: string;
}

export interface PhoneNumberButton extends BaseButton {
  type: 'PHONE_NUMBER';
  phone_number: string;
}

export interface URLButton extends BaseButton {
  type: 'URL';
  url: string;
  example?: string[];
}

export interface QuickReplyButton extends BaseButton {
  type: 'QUICK_REPLY';
}

export interface CopyCodeButton extends BaseButton {
  type: 'COPY_CODE';
  example: string;
}

export interface MPMButton extends BaseButton {
  type: 'MPM';
}

export interface CatalogButton extends BaseButton {
  type: 'CATALOG';
}

export interface OTPButton extends BaseButton {
  type: 'OTP';
}

export type Component = HeaderComponent | BodyComponent | FooterComponent | ButtonComponent;

export interface CreateTemplateRequest {
  name: string;
  category: TemplateCategory;
  components: Component[];
  language: TemplateLanguage;
  allow_category_change?: boolean;
}

export interface CreateTemplateResponse {
  id: string;
  status: TemplateStatus;
  category: TemplateCategory;
}

export interface GetTemplatesParams {
  fields?: string;
  limit?: number;
}

export interface TemplateData {
  name: string;
  status: TemplateStatus;
  id: string;
  category?: TemplateCategory;
  components?: Component[];
  language?: TemplateLanguage;
}

export interface GetTemplatesResponse {
  data: TemplateData[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export type EditTemplateRequest = Partial<CreateTemplateRequest>;

export interface EditTemplateResponse {
  success: boolean;
}

export interface DeleteTemplateParams {
  name: string;
  hsm_id?: string;
}

export interface DeleteTemplateResponse {
  success: boolean;
}