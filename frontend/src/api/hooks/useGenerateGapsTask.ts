import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../config';

type Request = {
    model_name: string;
    word: string;
}

export const useGenerateGapsTask = () => {
    return useMutation({
        mutationFn: (request: Request) => {
            return fetch(API_URL + '/generate-gaps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
        },
    });
};
