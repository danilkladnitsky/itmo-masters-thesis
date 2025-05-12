import {Button, Text as GravityText, TextInput} from '@gravity-ui/uikit';
import {useState} from 'react';
import styled from '@emotion/styled';
import {v4 as uuidv4} from 'uuid';

export interface YoutubeVideo {
    id: string;
    url: string;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const VideoListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const VideoItemContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const VideoItem = ({
    video,
    onRemove,
    onUrlChange,
}: {
    video: YoutubeVideo;
    onRemove: (id: string) => void;
    onUrlChange: (id: string, url: string) => void;
}) => {
    return (
        <VideoItemContainer>
            <TextInput
                size="l"
                placeholder="Введите URL видео"
                value={video.url}
                onChange={(e) => onUrlChange(video.id, e.target.value)}
            />
            <Button size="l" view="flat-danger" onClick={() => onRemove(video.id)}>
                ✕
            </Button>
        </VideoItemContainer>
    );
};

const AddVideoButton = ({onClick}: {onClick: () => void}) => {
    return (
        <Button size="l" view="flat-action" onClick={onClick} width="max">
            Добавить видео
        </Button>
    );
};

interface YoutubeVideoListProps {
    onVideoChange: (videos: YoutubeVideo[]) => void;
}

export const YoutubeVideoList = ({onVideoChange}: YoutubeVideoListProps) => {
    const [videos, setVideos] = useState<YoutubeVideo[]>([
        {
            id: uuidv4(),
            url: 'https://www.youtube.com/watch?v=OjNpRbNdR7E',
        },
    ]);

    const handleAddVideo = () => {
        const newVideo: YoutubeVideo = {
            id: uuidv4(),
            url: '',
        };

        const state = [...videos, newVideo];

        setVideos(state);
        onVideoChange(state);
    };

    const handleRemoveVideo = (id: string) => {
        const state = videos.filter((video) => video.id !== id);

        setVideos(state);
        onVideoChange(state);
    };

    const handleUrlChange = (id: string, url: string) => {
        const state = videos.map((video) => (video.id === id ? {...video, url} : video));

        setVideos(state);
        onVideoChange(state);
    };

    return (
        <Container>
            <GravityText variant="body-1" color="secondary">
                Добавьте ссылки на YouTube видео для обучения модели
            </GravityText>
            <VideoListContainer>
                {videos.map((video) => (
                    <VideoItem
                        key={video.id}
                        video={video}
                        onRemove={handleRemoveVideo}
                        onUrlChange={handleUrlChange}
                    />
                ))}
            </VideoListContainer>

            <AddVideoButton onClick={handleAddVideo} />
        </Container>
    );
};
