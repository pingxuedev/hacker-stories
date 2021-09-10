import { render, screen } from "@testing-library/react";
import React from 'react';
import renderer from  'react-test-renderer';

import App, { Item, List, SearchForm, InputWithLabel } from './App';

// test("renders learn react link", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe('Item', () => {
  const item= {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectIS: 0,
  };
  const handleRemoveItem = jest.fn();
  let component;
  beforeEach(() => {
  component = renderer.create(
    <Item item={item} onRemoveItem = {handleRemoveItem} />
  )
  });

  test('renders snapshot', ()=> {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('calls onRemoveItem on button click', () => {
    
    expect(component.root.findAllByType(Item).length).toEqual(1);
    
    component.root.findByType('button').props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

  });


  it('renders all properties', () => {

    expect(component.root.findByType('a').props.href).toEqual(
      'https://reactjs.org/'
    );

    expect(component.root.findAllByType('span')[1].props.children).toEqual('Jordan Walke');

    expect(
      component.root.findAllByProps({ children: 'Jordan Walke'}).length
    ).toEqual(1);

  });


})

//test suite
// describe("truthy and falsy", () => {
  // test('true to be true', () => {
  //   expect(true).toBe(false);
  // })

  // //test case
  // it("true to be ture", () => {
  //   //test assertion
  //   expect(true).toBe(true);
  // });
  // it('false to be false', () => {
  //   expect(false).toBe(false);
  // });
//});
