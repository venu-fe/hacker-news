const baseUrl = 'https://hacker-news.firebaseio.com/v0';

const getFetch = async (apiUrl: string) => {
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const data = await response.json();
    return data;
};

const getTopStories = async (noOfStories: number) => {
    try {
        const topStories = await getFetch(`${baseUrl}/topstories.json?print=pretty&orderBy="$key"&limitToFirst=${noOfStories || 10}`);
        
        return { topStories };
    }
    catch (error) {
        console.error('Error while loading the top stories');
        return { error };
    }
};

const getStoryById = async (storyId: number) => {
    try {
        const story = await getFetch(`${baseUrl}/item/${storyId}.json?print=pretty`);

        return { story };
    }
    catch (error) {
        console.error('Error while loading the story by id: ', storyId);
        return { error };
    }
};

const getCommentsForAStory = async (commentIds: Array<number>, noOfComments: number, storyId: number) => {
    try {
        const topComments = commentIds.slice(0, noOfComments);

        const getCommentsPromiseArray = topComments.map((commentId) => {
            return getFetch(`${baseUrl}/item/${commentId}.json?print=pretty`);
        });

        const promiseData = await Promise.all(getCommentsPromiseArray);

        return { comments: promiseData.map(d => d) };
    }
    catch (error) {
        console.error(`Error while loading the top comments ${noOfComments}  to the story `, storyId);
        return { error };
    }
};

const storiesAPI = {
    getTopStories,
    getStoryById,
    getCommentsForAStory,
};

export default storiesAPI;
