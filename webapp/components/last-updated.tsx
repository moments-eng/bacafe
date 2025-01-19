interface LastUpdatedProps {
	date: string;
}

export function LastUpdated({ date }: LastUpdatedProps) {
	return <p className="text-sm text-muted-foreground">Last Updated: {date}</p>;
}
