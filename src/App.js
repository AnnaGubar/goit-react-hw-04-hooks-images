import { useState, useEffect, useRef } from 'react';
import s from './App.module.css';
import searchApi from './services/search-api';
import Loader from './Components/Loader';
import Button from './Components/Button';
import Modal from './Components/Modal';
import Searchbar from './Components/Searchbar';
import ImageGallery from './Components/ImageGallery';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);

  const [isNotFound, setIsNotFound] = useState(false);

  const isSearchValueFirstRender = useRef(true);


  useEffect(() => {
    if (isSearchValueFirstRender.current) {
      isSearchValueFirstRender.current = false;
    }

    if (searchValue) {
      setIsLoading(true);
      setIsNotFound(false)

      searchApi
        .fetchImages(searchValue, page)
        .then(({ total, hits }) => {
          if (!total) {
            setIsNotFound(true);
            return;
          }

          let data = hits.map(value => {
            return {
              id: value.id,
              tags: value.tags,
              webformatURL: value.webformatURL,
              largeImageURL: value.largeImageURL,
            };
          });

          // gallery.length === 0
          //   ? setGallery(data)
          //   : setGallery(prev => [...prev, ...data]);
          
          setTotalHits(total);
          setGallery(prev => [...prev, ...data]);
        })
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
    }
  }, [page, searchValue]);

  
  function handleValueSearch (searchValue) {
    if (!searchValue || !isSearchValueFirstRender) {
      alert('Пожалуйста введите значение для поиска');
      return;
    }
    setSearchValue(searchValue);
    setGallery([]);
    setPage(1);
  };

  function toggleModal () {
    setShowModal(!showModal);
  };

  function showModalImage (clickedImage)  {
    toggleModal();
    setClickedImage(clickedImage);
  };

  function incrementPage () {
    setPage(prev => prev + 1);
  };

  // console.log('gallery', page, gallery);

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleValueSearch} />

      {!isLoading && gallery.length === 0 && !isNotFound && (
          <div className={s.title}>Пока еще ничего не искали</div>
        )}

        {isNotFound && <div className={s.title}>Поиск не дал результатов</div>}

        {gallery && (
          <ImageGallery gallery={gallery} showModalImage={showModalImage} />
        )}

        {isLoading && <Loader />}

        {gallery.length > 11 && gallery.length !== totalHits && !isLoading && (
          <Button title="Load more" onClick={incrementPage} />
        )}

      {showModal && (
        <Modal onClose={toggleModal} source={clickedImage}>
          <img src={clickedImage} alt="large" />
        </Modal>
      )}
    </div>
  );
}

export default App;
