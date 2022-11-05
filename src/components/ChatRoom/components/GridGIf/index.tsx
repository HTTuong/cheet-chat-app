import { IGif } from '@giphy/js-types';
import styled from 'styled-components';
import React from 'react';
import {
    Grid, // our UI Component to display the results
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider
    Loader,
} from '@giphy/react-components';

interface ISearchExperienceProps {
    handleOnSubmitGif: (gif: IGif) => void;
    setShowGif: React.Dispatch<React.SetStateAction<boolean>>;
    setIsNewMessage?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SInput_SearchBar = styled(SearchBar)`
    &&& {
        & > div {
            display: none;
        }
        margin-bottom: 12px;
        border-radius: 0;
        border-bottom: 1px solid #000;
    }
`;

export default function SearchExperience(props: ISearchExperienceProps) {
    return (
        <SearchContextManager apiKey={'2xK2iP7W5cITGFk3nKzjG3JHdFqrAg1e'}>
            <Components
                handleOnSubmitGif={props.handleOnSubmitGif}
                setShowGif={props.setShowGif}
                setIsNewMessage={props.setIsNewMessage}
            />
        </SearchContextManager>
    );
}

function Components(props: ISearchExperienceProps) {
    const { fetchGifs, searchKey } = React.useContext(SearchContext);
    return (
        <div style={{ padding: '12px', overflowY: 'auto', maxHeight: '40rem' }}>
            <SInput_SearchBar />
            <Grid
                key={searchKey}
                columns={3}
                width={360}
                loader={Loader}
                fetchGifs={fetchGifs}
                onGifClick={(gif: IGif, e) => {
                    e.preventDefault();
                    props.handleOnSubmitGif(gif);
                    props.setShowGif(false);
                }}
            />
        </div>
    );
}
