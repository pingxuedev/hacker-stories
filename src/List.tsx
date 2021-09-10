import React from "react";
import styles from "./App.module.css";
import { ReactComponent as Check } from "./check.svg";


type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};


type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
  };
  type Stories = Array<Story>;
  type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
  };

const List =React.memo( ({ list, onRemoveItem }: ListProps) =>
(
  <>
  {list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ))}
  </>
))

const Item = ({ item, onRemoveItem }: ItemProps) => {
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

export default List;
export { List, Item };
