export type EmailJobType = 'user-approved' | 'daily-digest' | 'welcome';

export interface BaseEmailJob {
  type: EmailJobType;
  to: string;
}

export interface UserApprovedEmailJob extends BaseEmailJob {
  type: 'user-approved';
  data: {
    username: string;
  };
}

export interface DailyDigestEmailJob extends BaseEmailJob {
  type: 'daily-digest';
  data: {
    userId: string;
    digestDate: string;
    articles: Array<{ title: string; url: string }>;
  };
}

export interface WelcomeEmailJob extends BaseEmailJob {
  type: 'welcome';
  data: {
    username: string;
  };
}

export type EmailJob = UserApprovedEmailJob | DailyDigestEmailJob | WelcomeEmailJob;
