export interface ScraperConfig {
	baseUrl: string;
	selectors: {
		articleMainTitle: string;
		articleSubTitle: string;
		articleParagraph: string;
	};
}

export const YNET_CONFIG: ScraperConfig = {
	baseUrl: 'https://www.ynet.co.il',
	selectors: {
		articleMainTitle: '.mainTitleWrapper',
		articleSubTitle: '.subTitleWrapper',
		articleParagraph: '.text_editor_paragraph',
	},
};
