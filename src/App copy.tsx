import React from "react";
import axios from "axios";
import styled from 'styled-components';
import List from './List';
import SearchForm from './SearchForm';


const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;
type Stories = Array<Story>;

const getSumComments = (stories : Stories) => {
  return stories.reduce((result, value) => result + value.num_comments, 0);
};

// const getAsyncStories = () =>
//   new Promise((resolve, reject) => setTimeout(reject, 2000));

// const getAsyncStories = () =>
//   new Promise((resolve) =>
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
//   );

// Promise.resolve({ data: { stories: initialStories }});

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

// type StoriesAction = {
//   type: string;
//   payload: any;
// };

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}
interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}
interface StoriesRemoveAction {
  type: "REMOVE_STORY";
  payload: Story;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const App = () => {
  const useSemiPersistentState = (
    key: string,
    initialState: string
  ): [string, (newValue: string) => void] => {
    const isMounted = React.useRef(false);
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    );
    React.useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        localStorage.setItem(key, value);
      }
    }, [value, key]);
    return [value, setValue];
  };
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const storiesReducer = (state: StoriesState, action: StoriesAction) => {
    switch (action.type) {
      case "STORIES_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
        };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          data: action.payload,
          isLoading: false,
        };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };

      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error();
    }
  };

  const [stories, dispatchStroies] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () => {
    // if (!searchTerm) return;
    dispatchStroies({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url);

      dispatchStroies({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStroies({ type: "STORIES_FETCH_FAILURE" });
    }

    // getAsyncStories().then(result => {
    //   dispatchStroies({
    //     type: 'STORIES_FETCH_SUCCESS',
    //     payload: result.data.stories,
    //   });
    // }).catch(() => dispatchStroies({type:'STORIES_FETCH_FAIL'}) );
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item: Story) => {
    dispatchStroies({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };
  // const searchedStories = stories.data.filter( story => story.title.includes(searchTerm))

  console.log("B:App");

  const sumComments = React.useMemo(() => getSumComments(stories.data), [stories]);

  return (
    <div>
      <StyledContainer>
        <StyledHeadlinePrimary>
          My Hacker Stories have {sumComments} comments.
        </StyledHeadlinePrimary>

        <SearchForm
          searchTerm={searchTerm}
          onInputChange={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />
        {stories.isError && <p>Something went wrong...</p>}
        {stories.isLoading ? (
          <p>Loading...</p>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
      </StyledContainer>
    </div>
  );
};

export default App;
export { SearchForm,  List };