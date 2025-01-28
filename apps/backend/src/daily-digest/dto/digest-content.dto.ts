import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
  @ApiProperty({ description: 'The category or tag for the section' })
  category: string;

  @ApiProperty({ description: 'A catchy Hebrew title for the section' })
  title: string;

  @ApiProperty({ description: 'A short Hebrew teaser summarizing the section' })
  teaser: string;

  @ApiProperty({ description: '1–3 Hebrew bullet points highlighting key info', type: [String] })
  highlights: string[];

  @ApiProperty({ description: "1–3 short Hebrew paragraphs summarizing the section's articles", type: [String] })
  body: string[];

  @ApiProperty({ description: 'A list of URLs for the included articles', type: [String] })
  articleLinks: string[];

  @ApiProperty({ description: 'Link to an image relevant to the section' })
  imageUrl: string;

  @ApiProperty({ description: 'Approximate read time in minutes', required: false })
  readTime?: number;

  @ApiProperty({
    description: 'Mood indicator for the section',
    enum: ['positive', 'negative', 'neutral'],
    required: false,
  })
  mood?: 'positive' | 'negative' | 'neutral';
}

export class DigestContentDto {
  @ApiProperty({ description: 'A collection of sections in the news digest', type: [SectionDto] })
  sections: SectionDto[];

  @ApiProperty({ description: 'A short Hebrew teaser for the entire digest' })
  teaser: string;

  @ApiProperty({ description: 'A string representing the current date (e.g., 2025-01-31)' })
  date: string;

  @ApiProperty({ description: 'Approximate total read time for the entire digest in minutes' })
  readTime: number;
}
