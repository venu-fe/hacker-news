import React, { useEffect, useState } from 'react';
import { Spinner, Row, Col, Card } from 'react-bootstrap'
import moment from 'moment';
import { RootState } from '../../../app/store';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getStoryByIdAsync, initializeStory } from '../reducers/storySlice';
import Comments from './Comments';

interface StoryProps {
    storyId: number;
};

const Story = ({ storyId }: StoryProps) => {
    const [showComments, setShowComments] = useState(false);
    const currentStory = useAppSelector((state:RootState) => state.story.stories[storyId.toString()]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // intializing the story 
        dispatch(initializeStory(storyId))
        
        // loading the current story by story Id
        dispatch(getStoryByIdAsync(storyId));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentStory) {
        return null;
    }

    const onViewComments = (evt: any) => {
        evt.preventDefault();
        setShowComments(!showComments);
    };

    return (
        <Row md={12}>
            <Col>
                <Card border='light' className='text-left'>
                    <Card.Body>
                        {currentStory.loadingStatus === 'loading' && (
                            <>
                                <Spinner animation="border" role="status" />
                                <span>Loading {storyId} Story Data...</span>
                            </>
                        )}
                        {currentStory.loadingStatus === 'succeeded' && (
                            <>
                                <Card.Title>
                                    <Card.Link target="_blank" href={currentStory.url}>{currentStory.title}</Card.Link>
                                </Card.Title>
                                {currentStory.text && <Card.Text as="div">
                                    <p dangerouslySetInnerHTML={{ __html: currentStory.text }}/>
                                </Card.Text>}
                                <Card.Text as="div">
                                    <span className="mr-3">Score: <Card.Text as="b">{currentStory.score}</Card.Text></span>
                                    <span className="mr-3">Posted By: <Card.Text as="b">{currentStory.by}</Card.Text></span>
                                    <span className="mr-3">Comments: <Card.Link href="#viewComments" onClick={onViewComments}>{showComments ? "Hide" : "View"} Comments</Card.Link></span>
                                    <span className="mr-3" title={moment(currentStory.time).utc().toString()}>Published At: <Card.Text as="b">{moment(currentStory.time).fromNow()}</Card.Text></span>
                                </Card.Text>

                                {showComments && (
                                    <Card.Text as="div">
                                        <Comments commentIds={currentStory.kids} storyId={storyId} />
                                    </Card.Text>
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Story;