export type SendMessageParams =
  | SendTextParams
  | SendImageParams
  | SendAudioParams
  | SendDocumentParams
  | SendStickerParams
  | SendVideoParams
  | SendLocationParams
  | SendTemplateParams
  | SendInteractiveParams
  | SendReactionParams;

export interface BaseMessageParams {
  to: string;
  recipient_type?: 'individual' | 'group';
}

export interface SendTextParams extends BaseMessageParams {
  type: 'text';
  text: {
    body: string;
    preview_url?: boolean;
  };
}

export interface SendMediaParams extends BaseMessageParams {
  type: 'image' | 'audio' | 'document' | 'sticker' | 'video';
  [mediaType: string]:
    | {
        id?: string;
        link?: string;
        caption?: string;
        filename?: string;
      }
    | any;
}

export interface SendImageParams extends SendMediaParams {
  type: 'image';
  image: {
    id?: string;
    link?: string;
    caption?: string;
  };
}

export interface SendAudioParams extends SendMediaParams {
  type: 'audio';
  audio: {
    id?: string;
    link?: string;
  };
}

export interface SendDocumentParams extends SendMediaParams {
  type: 'document';
  document: {
    id?: string;
    link?: string;
    caption?: string;
    filename?: string;
  };
}

export interface SendStickerParams extends SendMediaParams {
  type: 'sticker';
  sticker: {
    id?: string;
    link?: string;
  };
}

export interface SendVideoParams extends SendMediaParams {
  type: 'video';
  video: {
    id?: string;
    link?: string;
    caption?: string;
  };
}

export interface SendLocationParams extends BaseMessageParams {
  type: 'location';
  location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

export interface SendTemplateParams extends BaseMessageParams {
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components: TemplateComponent[];
  };
}

export type TemplateComponent = HeaderComponent | BodyComponent | ButtonComponent;

export interface HeaderComponent {
  type: 'header';
  parameters: HeaderParameter[];
}

export type HeaderParameter =
  | { type: 'text'; text: string }
  | { type: 'image'; image: { link: string } }
  | { type: 'video'; video: { link: string } }
  | { type: 'document'; document: { link: string } };

export interface BodyComponent {
  type: 'body';
  parameters: BodyParameter[];
}

export type BodyParameter =
  | { type: 'text'; text: string }
  | {
      type: 'currency';
      currency: {
        fallback_value: string;
        code: string;
        amount_1000: number;
      };
    }
  | {
      type: 'date_time';
      date_time: {
        fallback_value: string;
        day_of_week?: number;
        year?: number;
        month?: number;
        day_of_month?: number;
        hour?: number;
        minute?: number;
        calendar?: string;
      };
    }
  | { type: 'image'; image: { link: string } }
  | { type: 'document'; document: { link: string } }
  | { type: 'video'; video: { link: string } };

export type ButtonComponent = QuickReplyButton | URLButton | PhoneNumberButton | CopyCodeButton;

export interface QuickReplyButton {
  type: 'button';
  sub_type: 'quick_reply';
  index: number;
  parameters: [{ type: 'payload'; payload: string }];
}

export interface URLButton {
  type: 'button';
  sub_type: 'url';
  index: number;
  parameters: [{ type: 'text'; text: string }];
}

export interface PhoneNumberButton {
  type: 'button';
  sub_type: 'phone_number';
  index: number;
  parameters: [{ type: 'text'; text: string }];
}

export interface CopyCodeButton {
  type: 'button';
  sub_type: 'copy_code';
  index: number;
  parameters: [{ type: 'text'; text: string }];
}

export interface SendInteractiveParams extends BaseMessageParams {
  type: 'interactive';
  interactive: InteractiveObject;
}

export type InteractiveObject =
  | ProductInteractive
  | ProductListInteractive
  | ButtonReplyInteractive
  | ListInteractive
  | FlowInteractive
  | CTAURLInteractive;

interface BaseInteractive {
  type: string;
  header?: InteractiveHeader;
  body: InteractiveBody;
  footer?: InteractiveFooter;
}

export interface ProductInteractive extends BaseInteractive {
  type: 'product';
  action: ProductAction;
}

export interface CTAURLInteractive extends BaseInteractive {
  type: 'cta_url';
  action: CTAURLAction;
}

export interface CTAURLAction {
  name: 'cta_url';
  parameters: {
    display_text: string;
    url: string;
  };
}

export interface ProductListInteractive extends BaseInteractive {
  type: 'product_list';
  action: ProductListAction;
}

export interface ButtonReplyInteractive extends BaseInteractive {
  type: 'button';
  action: ButtonReplyAction;
}

export interface ListInteractive extends BaseInteractive {
  type: 'list';
  action: ListAction;
}

export interface FlowInteractive extends BaseInteractive {
  type: 'flow';
  action: FlowAction;
}

export interface InteractiveHeader {
  type: 'text' | 'video' | 'image' | 'document';
  text?: string;
  video?: { link: string };
  image?: { link: string };
  document?: { link: string };
}

export interface InteractiveBody {
  text: string;
}

export interface InteractiveFooter {
  text: string;
}

export interface ProductAction {
  catalog_id: string;
  product_retailer_id: string;
}

export interface ProductListAction {
  catalog_id: string;
  sections: ProductSection[];
}

export interface ProductSection {
  title: string;
  product_items: ProductItem[];
}

export interface ProductItem {
  product_retailer_id: string;
}

export interface ButtonReplyAction {
  buttons: Button[];
}

export interface Button {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
}

export interface ListAction {
  button: string;
  sections: ListSection[];
}

export interface ListSection {
  title: string;
  rows: ListItem[];
}

export interface ListItem {
  id: string;
  title: string;
  description?: string;
}

export interface FlowAction {
  name: 'flow';
  parameters: {
    flow_message_version: string;
    flow_token: string;
    flow_id: string;
    flow_cta: string;
    flow_action: string;
    flow_action_payload: {
      screen: string;
      data: Record<string, any>;
    };
  };
}

export interface SendReactionParams extends BaseMessageParams {
  type: 'reaction';
  reaction: {
    message_id: string;
    emoji: string;
  };
}

export interface WhatsAppResponse {
  messaging_product: string;
  contacts: {
    input: string;
    wa_id: string;
  }[];
  messages: {
    id: string;
    message_status?: 'accepted' | 'held_for_quality_assessment';
  }[];
}
