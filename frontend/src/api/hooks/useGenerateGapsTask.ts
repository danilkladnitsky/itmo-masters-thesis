import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../config';

type Request = {
    inference_model_name: string;
    word: string;
}

type Response = {
    status: string;
    sentence_with_gap: string;
    options: string[];
    answer: string;
}

export const useGenerateGapsTask = () => {
    return useMutation<Response, Error, Request>({
        mutationFn: async (request: Request) => {
            const response = await fetch(API_URL + '/generate-gaps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            return response.json();
        },
    });
};
