import React, { useEffect } from 'react';
import { Spinner, Container, Row, Col, Jumbotron } from 'react-bootstrap'
import { RootState } from '../../app/store';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getTopStoriesAsync, } from './reducers/topStoriesSlice';
import Story from './components/Story';

const NUM_TOP_STORIES = 10;

const TopStories = () => {
    const topStories = useAppSelector((state:RootState) => state.topStories.stories);
    const status = useAppSelector((state:RootState) => state.topStories.status);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getTopStoriesAsync(NUM_TOP_STORIES));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Container fluid>
            {status === 'loading' && (
                <Row md={12}>
                    <Col>
                        <Jumbotron>
                            <Spinner animation="border" role="status" />
                            <span>Loading Top {NUM_TOP_STORIES} Stories...</span>
                        </Jumbotron>
                    </Col>
                </Row>
            )}
            {status === 'succeeded' && (
                <>
                    <h2  className='text-center'>Top Stories</h2>
                    {(topStories || []).map(storyId => <Story key={storyId} storyId={storyId} />)}  
                </>
            )}
        </Container>
    );
};

export default TopStories;