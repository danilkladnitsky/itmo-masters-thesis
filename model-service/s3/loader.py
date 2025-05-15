import os
import boto3
from botocore.exceptions import ClientError
from pathlib import Path

class ModelS3Loader:
    def __init__(self, bucket_name: str, local_base_dir: str = "./models"):
        self.bucket_name = bucket_name
        self.local_base_dir = Path(local_base_dir)
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('S3_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('S3_SECRET_ACCESS_KEY'),
            region_name=os.getenv('S3_REGION', 'ru-1'),
            endpoint_url=os.getenv('S3_URL', 'https://s3.twcstorage.ru')
        )

    def load(self, model_name: str) -> Path:
        """
        Load model folder. If not found locally, download from S3.

        Returns:
            Path to local model folder
        """
        local_model_dir = self.local_base_dir / model_name

        if local_model_dir.exists():
            print(f"[ModelS3Loader] Found model locally: {local_model_dir}")
        else:
            print(f"[ModelS3Loader] Model not found locally. Downloading from S3...")
            self._download_model_from_s3(model_name, local_model_dir)

        print(f"[ModelS3Loader] Model loaded: {local_model_dir}")
        return model_name

    def _download_model_from_s3(self, model_name: str, target_dir: Path):
        """
        Download all files under `models/{model_name}/` prefix from S3
        into local target_dir
        """
        prefix = f"models/{model_name}/"
        target_dir.mkdir(parents=True, exist_ok=True)

        try:
            paginator = self.s3_client.get_paginator("list_objects_v2")
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
                for obj in page.get("Contents", []):
                    s3_key = obj["Key"]
                    rel_path = s3_key[len(prefix):]  # strip prefix
                    local_path = target_dir / rel_path

                    # Create subfolders if needed
                    local_path.parent.mkdir(parents=True, exist_ok=True)

                    print(f"[ModelS3Loader] Downloading: {s3_key} -> {local_path}")
                    self.s3_client.download_file(self.bucket_name, s3_key, str(local_path))

        except ClientError as e:
            raise RuntimeError(f"Failed to download model from S3: {e}")