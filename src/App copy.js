import React from "react";
import axios from "axios";
import styles from "./App.module.css";
import styled from "styled-components";
import { ReactComponent as Check } from './check.svg';

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

const getSumComments = (stories) => {
  console.log('C');
  return stories.data.reduce(
    (result, value) => result + value.num_comments, 0
  );
}

const initialStories = [
  {
    title: "dsf",
    objectID: 1,
    author: "Jordan Walke",
    url: "https://abc/index.html",
    num_comments: 1,
  },
  {
    title: "React",
    objectID: 3,
    author: "Jordan Walke",
    url: "https://abc/index.html",
    num_comments: 2,
  },
  {
    title: "Laravel",
    objectID: 4,
    author: "Jordan Walke",
    url: "https://abc/index.html",
    num_comments: 3,
  },
  {
    title: "Redux",
    objectID: 2,
    author: "Dan Abramov, Andrew Clark",
    url: "https://abc/index.html",
    num_comments: 4,
  },
];

// const getAsyncStories = () =>
//   new Promise((resolve, reject) => setTimeout(reject, 2000));

// const getAsyncStories = () =>
//   new Promise((resolve) =>
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
//   );

// Promise.resolve({ data: { stories: initialStories }});

const App = () => {
  const useSemiPersistentState = (key, initialState) => {
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

  const storiesReducer = (state, action) => {
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
      case "STORIES_FETCH_FAIL":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };

      case "REMOVE_STORIES":
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
      dispatchStroies({ type: "STORIES_FETCH_FAIL" });
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

  const handleRemoveStory = React.useCallback(item =>  {
    dispatchStroies({
      type: "REMOVE_STORIES",
      payload: item,
    });
  }, []);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };
  // const searchedStories = stories.data.filter( story => story.title.includes(searchTerm))

  console.log('B:App');


  const sumComments= React.useMemo( () => getSumComments(stories), [stories]);

  return (
    <div>
      <StyledContainer>
        <StyledHeadlinePrimary>My Hacker Stories have {sumComments} comments.</StyledHeadlinePrimary>

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
const SearchForm = ({ searchTerm, onInputChange, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onInputChange}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button
      type="submit"
      disabled={!searchTerm}
      className={`${styles.button} ${styles.buttonLarge}`}
    >
      Submit
    </button>
  </form>
);

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
        className={styles.input}
      />
    </>
  );
};

const List = React.memo(({ list, onRemoveItem }) =>
  console.log('B:List') ||
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ))
);
const Item = ({ item, onRemoveItem }) => {
  return (
    <div className={styles.item} key={item.objectID}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>
        <button
          type="button"
          onClick={() => onRemoveItem(item)}
          className={`${styles.button} ${styles.buttonSmall}`}
        >
          <Check width="18px" height="18px" />
        </button>
      </span>
    </div>
  );
};
export default App;
