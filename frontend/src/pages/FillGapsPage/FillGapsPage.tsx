import {FillGapsWidget} from '../../widgets/FillGapsWidget/FillGapsWidget';

export const FillGapsPage = () => {
    return (
        <FillGapsWidget
            sentence="我喜欢喝_"
            options={['书', '茶', '酒店', '咖啡', '酒', '啡']}
            onSubmit={() => {}}
        />
    );
};
