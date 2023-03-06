import { useCallback, useRef, useState } from 'react';
import './App.css';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1);

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }
  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)
  console.log("books", books)

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current=new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting){
        console.log("Visible")
        setPageNumber(prevPageNumber => prevPageNumber+1)
      }
    })
    // console.log(node)
    if(node) observer.current.observe(node)
  },[loading,hasMore])


  return (
    <div className="App">
      <input value={query} onChange={handleSearch} />
      {books.map((book, idx) => {
        if (books.length === idx + 1) {
          return <div ref={lastBookElementRef} key={book}>
            {book}
          </div>
        }
        else{
          return <div  key={book}> {book} </div>
        }
      })}

      <div>{loading && "loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default App;
