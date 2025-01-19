export const hebrewContent = {
	companyName: 'בקפה',
	tagline: 'מכניסים אותך לעניינים בקפה של הבוקר',
	mainTitle: 'מהפכה בצריכת',
	mainTitleHighlight: 'התוכן שלך',
	description:
		'קבלו תקציר יומי של תוכן שמתאים בדיוק לכם, ישירות לערוצים המועדפים עליכם. ללא פרסומות, ללא בלגן - רק מה שאתם אוהבים.',
	startButton: 'התחל כאן',
	learnMore: 'למידע נוסף',
	metadata: {
		title: 'בקפה',
		description: 'תוכן שמתאים לכם בדיוק בזמן',
	},
	onboarding: {
		header: {
			title: 'בוא נכיר אותך טיפה',
			progress: 'שלב',
			of: 'מתוך',
		},
		steps: {
			1: {
				header: 'נעים להכיר!',
				subheader: 'בוא/י נתחיל בהיכרות קצרה',
			},
			2: {
				header: 'קצת עליך',
				subheader: 'כדי שנוכל להתאים את התוכן בדיוק בשבילך',
			},
			3: {
				header: 'תחומי עניין',
				subheader: 'ספר/י לנו מה מעניין אותך',
			},
			personalDetails: {
				name: {
					label: 'איך קוראים לך?',
					placeholder: 'הכנס/י את שמך',
					description: 'חשוב לדעת איך קוראים לך כדי להתקדם, לא?',
					error: 'שם חייב להכיל לפחות 2 תווים',
				},
				age: {
					label: 'בן/בת כמה את/ה?',
					placeholder: 'הכנס/י את גילך',
					description: 'זה יעזור לנו להמליץ על תוכן מתאים בשבילך!',
					error: 'גיל חייב להיות בין 13 ל-120',
				},
				gender: {
					label: 'מגדר',
					description: 'בחר/י את המגדר שלך',
					options: {
						male: 'זכר',
						female: 'נקבה',
						notSpecified: 'אל תכניסו אותי לקוביה בבקשה',
					},
					error: 'יש לבחור מגדר',
				},
			},
			interests: {
				title: 'מה מעניין אותך',
				description:
					'תתחילו להחליק ימינה/שמאלה כדי שנוכל להבין מה באמת אתם אוהבים!',
			},
			timePreference: {
				label: 'מתי תרצה/י לקבל את התוכן היומי?',
				description: 'נשלח לך את התקציר היומי בדיוק בזמן שמתאים לך',
				morning: {
					title: '☀️ בוקר',
					description: 'התחל את היום עם התוכן הכי חם',
					time: '08:00',
				},
				noon: {
					title: '🌤️ צהריים',
					description: 'הפסקת צהריים מושלמת עם התוכן שלנו',
					time: '12:00',
				},
				evening: {
					title: '🌙 ערב',
					description: 'סיכום היום לפני השינה',
					time: '20:00',
				},
				custom: {
					title: '🎯 שעה מותאמת אישית',
					description: 'בחר/י את השעה המועדפת עליך',
					placeholder: 'בחר/י שעה',
				},
				error: 'יש לבחר שעה לקבלת התוכן',
			},
		},
		buttons: {
			continue: 'המשך',
			back: 'חזרה',
			complete: 'סיום ההגדרות',
		},
		success: {
			title: 'עשית את זה!',
			subtitle: "ההרשמה הושלמה בהצלחה! 🌟 הדיג'סט היומי שלך כבר בדרך!",
			greeting: 'איזה כיף',
			contentPreferences: 'בחרת תוכן על {topics}. מי אם לא את/ה?',
			digestTime: "הדיג'סט שלך ינחת בתיבת המייל ב-{time}, בדיוק בזמן לקפה.",
			cta: 'לאזור האישי שלי',
			chatInvite:
				"רוצה שנכיר אותך עוד יותר טוב? בוא לצ'אט איתנו ונסגור לך פינה!",
			chatButton: "שוחח איתנו בצ'אט",
		},
	},

	navigation: {
		menu: {
			dailyDigest: "הדייג'סט היומי שלי",
			personalArea: 'אזור אישי',
			settings: 'הגדרות',
			privacyPolicy: 'מדיניות פרטיות',
			logout: 'התנתקות',
		},
	},

	login: {
		welcome: 'ברוכים השבים',
		subtitle: 'התחברו עם חשבון Apple או Google',
		socialLogin: {
			facebook: 'התחברות עם פייסבוק',
			google: 'התחברות עם גוגל',
		},
		divider: 'או המשיכו עם',
		form: {
			email: {
				label: 'אימייל',
				placeholder: 'your@email.com',
			},
			password: {
				label: 'סיסמה',
				forgotPassword: 'שכחת סיסמה?',
			},
			submit: 'התחברות',
			noAccount: 'עדיין אין לך חשבון?',
			signUp: 'הרשמה',
		},
		terms: {
			prefix: 'בלחיצה על המשך, את/ה מסכימ/ה',
			termsOfService: 'לתנאי השימוש',
			and: 'ו',
			privacyPolicy: 'מדיניות הפרטיות',
		},
	},

	auth: {
		backButton: 'חזרה',
		pages: {
			login: {
				title: 'התחברות',
				description: 'התחבר/י כדי להמשיך לאזור האישי',
			},
			signup: {
				title: 'הרשמה',
				description: 'צור/י חשבון חדש',
			},
		},
	},

	app: {
		loading: 'טוען...',
		redirect: 'מעביר אותך להשלמת תהליך ההיכרות...',
		welcome: {
			title: 'ברוכים הבאים לחוויה החדשה שלך',
			greeting: 'היי {name} 👋',
			subtitle: 'אנחנו בונים בשבילך את פרופיל התוכן המושלם',
			description:
				'בזמן שאנחנו מאמנים את האלגוריתם שלנו להכיר אותך, הנה כמה דברים שכדאי שתדע:',
			features: [
				'התוכן שלך נבחר בקפידה על פי ההעדפות שבחרת',
				'ככל שתשתמש/י יותר, כך נדע להתאים לך תוכן טוב יותר',
				'בכל יום נשלח לך תקציר מותאם אישית בדיוק בזמן שביקשת',
			],
			beta: {
				label: 'בטא',
				text: 'את/ה חלק מקבוצה נבחרת של משתמשים שמעצבים איתנו את העתיד של צריכת התוכן',
			},
		},
	},
};
