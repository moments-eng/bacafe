import pandas as pd
import numpy as np
from sklearn.cluster import HDBSCAN
from sklearn.neighbors import KNeighborsClassifier
import umap
from ..utils.logger import logger
from typing import List, Dict, Any

class ClusteringService:
    def __init__(self):
        pass

    def _get_np_embeddings(self, df: pd.DataFrame) -> np.ndarray:
        """Convert embeddings from DataFrame to numpy array."""
        return df["embeddings"].apply(pd.Series).values

    def _fix_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Fix outliers in clustering results using KNN.
        Also handles small clusters (less than 3 items) by marking them as outliers
        and then re-applying KNN.
        """
        def fix_outliers_(df: pd.DataFrame) -> pd.DataFrame:
            outliers = df[df['cluster'] == -1]
            if not outliers.empty:
                knn = KNeighborsClassifier(n_neighbors=3)
                
                known_points = df[df['cluster'] != -1]
                known_points = self._get_np_embeddings(known_points)
                known_labels = df[df['cluster'] != -1]['cluster']
                
                knn.fit(known_points, known_labels)
                df.loc[df['cluster'] == -1, 'cluster'] = knn.predict(self._get_np_embeddings(outliers))
            return df

        # Fix initial outliers
        df = fix_outliers_(df)
        
        # Fix small clusters
        cluster_counts = df['cluster'].value_counts()
        categories_less_than_3 = cluster_counts[cluster_counts < 3].index.tolist()
        df["cluster"] = df["cluster"].apply(lambda x: -1 if x in categories_less_than_3 else x)
        
        # Fix new outliers from small clusters
        df = fix_outliers_(df)
        return df

    def _dbscan_clusters(self, embeddings: np.ndarray, min_cluster_size: int) -> np.ndarray:
        """Apply HDBSCAN clustering to embeddings."""
        hdb = HDBSCAN(min_cluster_size=min_cluster_size)
        hdb.fit_predict(embeddings)
        return hdb.labels_

    def get_clusters(self, df: pd.DataFrame, min_cluster_size: int = 2, use_umap: bool = True) -> pd.DataFrame:
        """
        Cluster articles based on their embeddings using HDBSCAN algorithm.
        
        The process:
        1. Optionally reduce dimensionality using UMAP
        2. Apply HDBSCAN clustering
        3. Fix outliers using KNN
        4. Handle small clusters
        
        Args:
            df: DataFrame containing articles with embeddings
            min_cluster_size: Minimum size for a cluster
            use_umap: Whether to use UMAP dimensionality reduction
            
        Returns:
            DataFrame with cluster assignments added as 'cluster' column
        """
        logger.info(
            "Computing clusters",
            extra={
                'min_cluster_size': min_cluster_size,
                'use_umap': use_umap,
                'total_articles': len(df)
            }
        )

        df = df.dropna(axis=0)
        
        # Apply UMAP if requested
        if use_umap:
            reducer = umap.UMAP(random_state=42)
            umap_embedding = reducer.fit_transform(self._get_np_embeddings(df))
            df["embeddings"] = list(umap_embedding)

        # Perform clustering
        clusters = self._dbscan_clusters(self._get_np_embeddings(df), min_cluster_size)
        df["cluster"] = clusters
        
        # Fix outliers and small clusters
        df = self._fix_outliers(df)

        logger.info(
            "Computed clusters",
            extra={
                'total_clusters': df["cluster"].nunique(),
                'total_articles': len(df)
            }
        )
        return df

    def print_clusters(self, df: pd.DataFrame) -> None:
        """Print cluster contents for debugging/logging purposes."""
        for c in df["cluster"].unique():
            print(f"Cluster {c}")
            for r in df[df["cluster"] == c]["title"].tolist():
                print(r) 