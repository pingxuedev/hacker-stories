import React from "react";
import styles from "./App.module.css";

type SearchFormProps = {
    searchTerm: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  };
  
  const SearchForm = ({ searchTerm, onInputChange, onSearchSubmit }: SearchFormProps) => (
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
  
  type InputWithLabelProps = {
    id: string;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?:boolean;
    children: React.ReactNode;
  }
  
  const InputWithLabel = ({
    id,
    value,
    type = "text",
    onInputChange,
    isFocused,
    children,
  }: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null!);
  
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
  
  export default SearchForm;