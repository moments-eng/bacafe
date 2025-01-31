export const emailContent = {
  approvalEmail: {
    subject: 'ברוכים הבאים לבול בפוני! 🎉',
    title: 'בקשתך אושרה!',
    greeting: 'היי {username}',
    mainMessage: 'אנחנו שמחים לבשר לך שבקשת ההצטרפות שלך לבול בפוני אושרה! 🦄',
    description: [
      'הגיע הזמן להכיר אותך ולהתחיל להתאים עבורך את התוכן המושלם.',
      'אנחנו כבר מחכים לך בפלטפורמה כדי להתחיל יחד במסע מרתק של תוכן מותאם אישית.',
    ],
    features: [
      'סיכומי חדשות יומיים מותאמים אישית',
      'תכנים מגוונים מהארץ ומהעולם',
      'חוויית קריאה מהנה ונוחה',
    ],
    cta: 'להתחלת המסע',
    footer: {
      needHelp: 'צריכים עזרה?',
      contactUs: 'אנחנו כאן בשבילכם',
      regards: 'צוות בול בפוני',
    },
  },
} as const; 