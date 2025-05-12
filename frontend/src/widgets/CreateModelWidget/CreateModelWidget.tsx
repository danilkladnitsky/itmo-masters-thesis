import styled from '@emotion/styled';
import {Tab, TabList, TabPanel, TabProvider} from '@gravity-ui/uikit';
import {useState} from 'react';
import {YoutubeVideo, YoutubeVideoList} from './sub/YoutubeVideoList/YoutubeVideoList';
import {ImageFile, ImagesList} from './sub/ImagesList/ImagesList';
import {Prompt, PromptList} from './sub/PromptList/PromptList';
import {ModelInfoForm} from './sub/ModelInfoForm/ModelInfoForm';

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    width: 500px;
    max-width: 100%;
    min-height: 400px;
`;

export interface ModelData {
    images: ImageFile[];
    videos: YoutubeVideo[];
    prompts: Prompt[];
    name: string;
    description: string;
    hskLevel: number;
}

export const CreateModelWidget = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [modelData, setModelData] = useState<ModelData>({
        images: [],
        videos: [],
        prompts: [],
        name: '',
        description: '',
        hskLevel: 1,
    });
    const [isLoading] = useState(false);

    const handleAddImages = (payload: ImageFile[]) => {
        setModelData({...modelData, images: payload});
    };

    const onVideoChange = (payload: YoutubeVideo[]) => {
        setModelData({...modelData, videos: payload});
    };

    const handleAddPrompts = (payload: Prompt[]) => {
        setModelData({...modelData, prompts: payload});
    };

    const onFormChange = (data: Pick<ModelData, 'name' | 'description' | 'hskLevel'>) => {
        setModelData((prev) => ({
            images: prev.images,
            videos: prev.videos,
            prompts: prev.prompts,
            name: data.name,
            description: data.description,
            hskLevel: data.hskLevel,
        }));
    };

    const handleSubmit = () => {
        console.log(modelData);
    };

    return (
        <SettingsContainer>
            <TabProvider value={activeTab} onUpdate={setActiveTab}>
                <TabList>
                    <Tab value="info">Информация о модели</Tab>
                    <Tab value="youtube">YouTube</Tab>
                    <Tab value="images">Изображения</Tab>
                    <Tab value="prompts">Промты</Tab>
                </TabList>
                <div>
                    <TabPanel value="info">
                        <ModelInfoForm
                            modelData={modelData}
                            onFormChange={onFormChange}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </TabPanel>
                    <TabPanel value="youtube">
                        <YoutubeVideoList onVideoChange={onVideoChange} />
                    </TabPanel>
                    <TabPanel value="images">
                        <ImagesList onAddImages={handleAddImages} />
                    </TabPanel>
                    <TabPanel value="prompts">
                        <PromptList onAddPrompts={handleAddPrompts} />
                    </TabPanel>
                </div>
            </TabProvider>
        </SettingsContainer>
    );
};
