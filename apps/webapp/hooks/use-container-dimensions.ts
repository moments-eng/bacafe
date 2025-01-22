'use client';

import { useState, useEffect } from 'react';

interface ContainerDimensions {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function useContainerDimensions(): ContainerDimensions {
	const [dimensions, setDimensions] = useState<ContainerDimensions>({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const container = document.querySelector('.mobile-container');
		if (!container) return;

		const updateDimensions = () => {
			const rect = container.getBoundingClientRect();
			setDimensions({
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height,
			});
		};

		updateDimensions();

		const resizeObserver = new ResizeObserver(updateDimensions);
		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return dimensions;
}
