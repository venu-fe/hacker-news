import React, { useEffect } from 'react';
import { Spinner, ListGroup } from 'react-bootstrap'
import moment from 'moment';
import { RootState } from '../../../app/store';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getCommentsForAStoryAsync, initializeCommentsForAStory } from '../reducers/commentsSlice';

const MAX_NUM_COMMENTS = 20;

interface CommentsProps {
    commentIds: Array<number>;
    storyId: number;
};

const Comments = ({ storyId, commentIds }: CommentsProps) => {
    const currentStoryComments = useAppSelector((state:RootState) => state.comments.comments[storyId.toString()]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // intializing the story comments 
        dispatch(initializeCommentsForAStory(storyId))
        
        // loading the current story by story Id
        dispatch(getCommentsForAStoryAsync({commentIds, noOfComments: MAX_NUM_COMMENTS, storyId}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentStoryComments) {
        return null;
    }

    return (
        <ListGroup>
            {currentStoryComments.loadingStatus === 'loading' && (
                <ListGroup.Item>
                    <Spinner animation="border" role="status" />
                    <span>Loading comments for the story {storyId}...</span>
                </ListGroup.Item>
            )}
            {currentStoryComments.loadingStatus === 'succeeded' && (
                
                (currentStoryComments.comments || []).map((comment) => (
                    <ListGroup.Item as="div" key={comment.id}>
                        <p dangerouslySetInnerHTML={{ __html: comment.text }} />
                        <div>
                            <span className="mr-3">Posted By: <b>{comment.by}</b></span>
                            <span className="mr-3" title={moment(comment.time).utc().toString()}>commented At: <b>{moment(comment.time).fromNow()}</b></span>
                        </div>
                    </ListGroup.Item>
                ))
            )}
        </ListGroup>
    );
};

export default Comments;