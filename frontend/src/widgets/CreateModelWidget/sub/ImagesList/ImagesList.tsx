import {Button, Text as GravityText} from '@gravity-ui/uikit';
import React, {useCallback, useState} from 'react';
import styled from '@emotion/styled';
import {v4 as uuidv4} from 'uuid';

export interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const DropZone = styled.div<{isDragging: boolean}>`
    border: 1px dashed ${(props) => (props.isDragging ? 'gray' : '#ccc')};
    border-radius: 8px;
    padding: 32px;
    text-align: center;
    background-color: ${(props) => (props.isDragging ? '#E8F5E9' : 'transparent')};
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        border-color: #444444;
    }
`;

const ImageListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
`;

const ImageItem = styled.div`
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f5f5f5;
`;

const ImagePreview = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const RemoveButton = styled(Button)`
    position: absolute;
    top: 4px;
    right: 4px;
`;

interface ImagesListProps {
    onAddImages: (images: ImageFile[]) => void;
}

export const ImagesList = ({onAddImages}: ImagesListProps) => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFiles = useCallback((files: FileList) => {
        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImage: ImageFile = {
                        id: uuidv4(),
                        file,
                        preview: e.target?.result as string,
                    };

                    const state = [...images, newImage];

                    setImages(state);
                    onAddImages(state);
                };
                reader.readAsDataURL(file);
            }
        });
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            processFiles(e.dataTransfer.files);
        },
        [processFiles],
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                processFiles(e.target.files);
            }
        },
        [processFiles],
    );

    const handleRemove = useCallback((id: string) => {
        const state = images.filter((img) => img.id !== id);

        setImages(state);
        onAddImages(state);
    }, []);

    return (
        <Container>
            <GravityText variant="body-1" color="secondary">
                Добавьте изображения для обучения модели
            </GravityText>

            <DropZone
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
            >
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg"
                    onChange={handleFileInput}
                    style={{display: 'none'}}
                />
                <GravityText variant="body-1" color="secondary">
                    Перетащите изображения сюда или нажмите для выбора. Поддерживаются форматы: PNG,
                    JPG
                </GravityText>
            </DropZone>
            {images.length > 0 && (
                <ImageListContainer>
                    {images.map((image) => (
                        <ImageItem key={image.id}>
                            <ImagePreview src={image.preview} alt="Preview" />
                            <RemoveButton
                                view="flat"
                                size="s"
                                onClick={() => handleRemove(image.id)}
                            >
                                ✕
                            </RemoveButton>
                        </ImageItem>
                    ))}
                </ImageListContainer>
            )}
        </Container>
    );
};
