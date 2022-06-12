import { useState, useEffect, useRef } from 'react';
import s from './App.module.css';
import searchApi from './services/search-api';
import Loader from './Components/Loader';
import Button from './Components/Button';
import Modal from './Components/Modal';
import Searchbar from './Components/Searchbar';
import ImageGallery from './Components/ImageGallery';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  NOTFOUND: 'not found',
};

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [gallery, setGallery] = useState([]);
  const [hitsLength, setHitsLength] = useState(null);

  const isSearchValueFirstRender = useRef(true);

  const handleValueSearch = searchValue => {
    if (!searchValue || !isSearchValueFirstRender) {
      alert('Пожалуйста введите значение для поиска');
      return;
    }
    setSearchValue(searchValue);
    setGallery([]);
    setPage(1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const showModalImage = clickedImage => {
    toggleModal();
    setClickedImage(clickedImage);
  };

  const incrementPage = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (isSearchValueFirstRender.current) {
      isSearchValueFirstRender.current = false;
    }

    if (searchValue) {
      setStatus(Status.PENDING);

      searchApi
        .fetchImages(searchValue, page)
        .then(({ total, hits }) => {
          if (!total) {
            setHitsLength(0);
            setStatus(Status.NOTFOUND);
            return;
          }

          // console.log(total);

          let data = hits.map(value => {
            return {
              id: value.id,
              tags: value.tags,
              webformatURL: value.webformatURL,
              largeImageURL: value.largeImageURL,
            };
          });

          setHitsLength(data.length);

          // gallery.length === 0
          //   ? setGallery(data)
          //   : setGallery(prev => [...prev, ...data]);

          setGallery(prev => [...prev, ...data]);
          setStatus(Status.RESOLVED);
        })
        .catch(error => setStatus(Status.REJECTED));
    }
  }, [page, searchValue]);

  // console.log('gallery', page, gallery);

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleValueSearch} />

      {status === 'idle' && (
        <div className={s.title}>Пока еще ничего не искали</div>
      )}

      {status === 'pending' && <Loader />}

      {status === 'not found' && (
        <div className={s.title}>Поиск не дал результатов</div>
      )}

      {status === 'resolved' && (
        <ImageGallery gallery={gallery} showModalImage={showModalImage} />
      )}

      {status === 'rejected' && <div className={s.title}>Произошла ошибка</div>}

      {hitsLength === 12 && status === 'resolved' && (
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
