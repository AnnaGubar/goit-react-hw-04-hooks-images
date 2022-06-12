import propTypes from 'prop-types';
import s from './Searchbar.module.css';

function Searchbar({ onSubmit }) {
  const handleSubmit = event => {
    event.preventDefault();

    const { searchValue } = event.currentTarget.children;
    onSubmit(searchValue.value);

    searchValue.value = '';
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={s.SearchFormBtn}>
          <span className={s.SearchFormBtnLabel}>Search</span>
        </button>

        <input
          className={s.SearchFormInput}
          name="searchValue"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: propTypes.func.isRequired,
};

export default Searchbar;
