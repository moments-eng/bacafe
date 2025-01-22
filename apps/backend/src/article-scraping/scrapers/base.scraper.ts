export interface ScrapingResult {
	content: string;
	author?: string;
	imageUrl?: string;
}

export abstract class BaseArticleScraper {
	abstract readonly provider: string;

	abstract scrape(url: string): Promise<ScrapingResult>;

	protected async fetchPage(url: string): Promise<string> {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch page: ${response.statusText}`);
			}
			return await response.text();
		} catch (error) {
			throw new Error(`Error fetching page: ${error.message}`);
		}
	}
}
